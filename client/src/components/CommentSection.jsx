import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import { Avatar } from './Avatar';
import { Button } from './ui/button';
import { apiService } from '../services/api';
import LazyImage from './LazyImage';
import { useTranslation } from 'react-i18next';
import Skeleton from './ui/skeleton';

function CommentSection({ postId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('latest'); // 'latest', 'popular', 'oldest'
  const [replyTo, setReplyTo] = useState(null);
  const [newComment, setNewComment] = useState('');
  const { showToast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    fetchComments();
  }, [postId, sortBy]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.get(`/posts/${postId}/comments`, {
        params: { page, limit: 10, sort: sortBy },
      });

      if (page === 1) {
        setComments(response.data);
      } else {
        setComments(prev => [...prev, ...response.data]);
      }

      setHasMore(response.data.length === 10);
    } catch (error) {
      showToast(t('fetch_comments_failed'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
      fetchComments();
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setIsLoading(true);
      const response = await apiService.post(`/posts/${postId}/comments`, {
        content: newComment.trim(),
        parentId: replyTo?._id,
      });

      setComments(prev => [response.data, ...prev]);
      setNewComment('');
      setReplyTo(null);
      showToast(t('comment_post_success'), 'success');
    } catch (error) {
      showToast(t('comment_post_failed'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const renderComment = (comment, level = 0) => {
    const replies = comments.filter(c => c.parentId === comment._id);
    const maxLevel = 2; // 最大嵌套层级

    return (
      <div key={comment._id} className={`${level > 0 ? 'ml-8' : ''} bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-4 mb-2 transition-shadow hover:shadow-md`}>
        <div className="flex space-x-3">
          <LazyImage
            src={comment.author.avatar}
            alt={comment.author.username}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-gray-900 dark:text-white">{comment.author.username}</span>
              <span className="text-gray-500 text-xs">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: zhCN })}</span>
            </div>
            <p className="mt-1 text-[15px] text-gray-900 dark:text-white">{comment.content}</p>
            <div className="mt-2 flex items-center space-x-4">
              <button
                onClick={() => setReplyTo(comment)}
                className="text-gray-500 hover:text-blue-500 rounded-full px-2 py-1 transition-colors"
              >
                {t('reply')}
              </button>
              <button className="text-gray-500 hover:text-red-500 rounded-full px-2 py-1 transition-colors">
                ❤️ {comment.likes}
              </button>
            </div>
          </div>
        </div>
        {/* 嵌套回复 */}
        {level < maxLevel && replies.length > 0 && (
          <div className="mt-2">{replies.map(reply => renderComment(reply, level + 1))}</div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-4">
      {/* 排序选项 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">{t('comments')}</h3>
        <select
          value={sortBy}
          onChange={e => {
            setSortBy(e.target.value);
            setPage(1);
          }}
          className="bg-transparent border border-twitter-gray-200 dark:border-twitter-gray-800 rounded-full px-4 py-1"
        >
          <option value="latest">{t('latest')}</option>
          <option value="popular">{t('popular')}</option>
          <option value="oldest">{t('oldest')}</option>
        </select>
      </div>

      {/* 评论输入框 */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex space-x-3">
          <LazyImage src={user?.avatar} alt={user?.username} className="w-10 h-10 rounded-full object-cover" />
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder={replyTo ? t('reply_to', { user: replyTo.author.username }) : t('add_comment')}
              className="w-full p-3 bg-transparent border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-[15px]"
              rows="2"
            />
            {replyTo && (
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-sm text-gray-500">{t('reply_to', { user: replyTo.author.username })}</span>
                <button
                  type="button"
                  onClick={() => setReplyTo(null)}
                  className="text-blue-500 hover:underline text-sm"
                >
                  {t('cancel')}
                </button>
              </div>
            )}
            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t('post')}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* 评论骨架屏 */}
      {isLoading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex space-x-3 p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm">
              <Skeleton variant="avatar" className="w-10 h-10" />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" className="w-1/4" />
                <Skeleton variant="rect" className="w-full h-4" />
                <Skeleton variant="rect" className="w-1/2 h-4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 评论列表 */}
      {!isLoading && (
        <div className="space-y-4">
          {Array.isArray(comments) && comments.map(comment => renderComment(comment))}
        </div>
      )}

      {/* 加载更多 */}
      {hasMore && (
        <div className="mt-4 text-center">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="text-twitter-blue hover:underline disabled:opacity-50"
          >
            {isLoading ? t('loading') : t('load_more')}
          </button>
        </div>
      )}
    </div>
  );
}

export default CommentSection;

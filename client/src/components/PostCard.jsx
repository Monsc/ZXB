import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './Button';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import ReportModal from './ReportModal';
import { Heart, MessageCircle, Share2, MoreHorizontal, Repeat2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useToast } from '../hooks/useToast';
import { apiService } from '../services/api';

export const PostCard = ({ post, onLike, onComment, onDelete }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [isLiked, setIsLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);
  const [shares, setShares] = useState(post.shares || 0);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const [isReposted, setIsReposted] = useState(post.isReposted);
  const [repostCount, setRepostCount] = useState(post.repostCount);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmitComment = e => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    onComment(post._id, commentContent);
    setCommentContent('');
  };

  const handleAuthorClick = e => {
    e.stopPropagation();
    navigate(`/profile/${post.author._id}`);
  };

  const handlePostClick = () => {
    navigate(`/post/${post._id}`);
  };

  const handleLike = async () => {
    try {
      if (isLiked) {
        await apiService.unlikePost(post._id);
        setLikes(prev => prev - 1);
      } else {
        await apiService.likePost(post._id);
        setLikes(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      showToast('操作失败', 'error');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${post.author.username} 的帖子`,
        text: post.content,
        url: window.location.origin + `/post/${post._id}`,
      });
      setShares(prev => prev + 1);
    } catch (error) {
      console.error('分享失败:', error);
    }
  };

  const handleDelete = () => {
    if (window.confirm('确定要删除这条帖子吗？')) {
      onDelete(post._id);
    }
  };

  const handleRepost = async () => {
    try {
      if (isReposted) {
        await apiService.unrepostPost(post._id);
        setRepostCount(prev => prev - 1);
      } else {
        await apiService.repostPost(post._id);
        setRepostCount(prev => prev + 1);
      }
      setIsReposted(!isReposted);
    } catch (error) {
      showToast('操作失败', 'error');
    }
  };

  const renderMedia = () => {
    // 推特风格多图九宫格
    if (Array.isArray(post.media) && post.media.length > 0) {
      const count = post.media.length;
      // 只支持最多4张图的九宫格
      const gridClass =
        count === 1
          ? 'grid-cols-1'
          : count === 2
          ? 'grid-cols-2'
          : count === 3
          ? 'grid-cols-2'
          : 'grid-cols-2';
      return (
        <div
          className={`mt-3 grid gap-1 rounded-xl overflow-hidden ${gridClass}`}
          style={{ maxHeight: count === 1 ? 400 : 300 }}
        >
          {post.media.slice(0, 4).map((media, idx) => (
            <img
              key={idx}
              src={typeof media === 'string' ? media : media.url}
              alt={`图片${idx + 1}`}
              className={`w-full h-full object-cover rounded-xl transition-transform duration-200 hover:scale-105 ${
                count === 3 && idx === 0 ? 'row-span-2' : ''
              }`}
              style={{ aspectRatio: count === 1 ? '16/9' : '1/1', minHeight: 120, maxHeight: count === 1 ? 400 : 180 }}
            />
          ))}
        </div>
      );
    }
    // 单图
    if (post.media && post.media.type === 'image') {
      return (
        <img
          src={post.media.url}
          alt="Post attachment"
          className="mt-3 rounded-xl max-h-96 w-full object-cover transition-transform duration-200 hover:scale-105"
          loading="lazy"
        />
      );
    }
    // 视频
    if (post.media && post.media.type === 'video') {
      return (
        <video
          src={post.media.url}
          controls
          className="mt-3 rounded-xl w-full max-h-96 bg-black"
          poster={post.media.thumbnail}
          style={{ minHeight: 180 }}
        />
      );
    }
    return null;
  };

  return (
    <div
      className="group cursor-pointer px-4 py-3 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 transition-colors hover:bg-gray-50 dark:hover:bg-[#16181c]"
      onClick={handlePostClick}
      style={{ borderRadius: 0, boxShadow: 'none', marginBottom: 0 }}
    >
      <div className="flex items-start gap-3">
        <img
          src={post.author.avatar}
          alt={post.author.username}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          onClick={handleAuthorClick}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-[15px]">
            <span
              className="font-bold text-gray-900 dark:text-white hover:underline leading-tight"
              onClick={handleAuthorClick}
            >
              {post.author.username}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">@{post.author.handle}</span>
            <span className="text-gray-400 text-xs">· {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: zhCN })}</span>
          </div>
          <div className="mt-1 text-[15px] leading-[1.5] text-[#0f1419] dark:text-white whitespace-pre-wrap break-words">
            {post.content}
          </div>
          {renderMedia()}
          <div className="mt-3 flex items-center justify-between max-w-full pr-8 select-none">
            {/* 评论 */}
            <button
              type="button"
              onClick={e => { e.stopPropagation(); setShowComments(true); }}
              className="flex items-center gap-1 text-gray-500 hover:text-twitter-blue transition-colors group/comment px-2 py-1 rounded-full"
              aria-label="评论"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm group-hover/comment:text-twitter-blue">{post.comments?.length || 0}</span>
            </button>
            {/* 转推 */}
            <button
              type="button"
              onClick={e => { e.stopPropagation(); handleRepost(); }}
              className={`flex items-center gap-1 transition-colors px-2 py-1 rounded-full group/retweet ${isReposted ? 'text-green-500' : 'text-gray-500 hover:text-green-500'}`}
              aria-label="转推"
            >
              <Repeat2 className="h-5 w-5" />
              <span className="text-sm group-hover/retweet:text-green-500">{repostCount}</span>
            </button>
            {/* 点赞 */}
            <button
              type="button"
              onClick={e => { e.stopPropagation(); handleLike(); }}
              className={`flex items-center gap-1 transition-colors px-2 py-1 rounded-full group/like ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
              aria-label="点赞"
            >
              <Heart className={`h-5 w-5 transition-all ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm group-hover/like:text-red-500">{likes}</span>
            </button>
            {/* 分享 */}
            <button
              type="button"
              onClick={e => { e.stopPropagation(); handleShare(); }}
              className="flex items-center gap-1 text-gray-500 hover:text-twitter-blue transition-colors px-2 py-1 rounded-full group/share"
              aria-label="分享"
            >
              <Share2 className="h-5 w-5" />
            </button>
            {/* 更多 */}
            <div className="relative">
              <button
                type="button"
                onClick={e => { e.stopPropagation(); setShowMenu(!showMenu); }}
                aria-label="更多选项"
                className="text-gray-500 hover:text-twitter-blue transition-colors px-2 py-1 rounded-full"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-10">
                  <button onClick={handleDelete} className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700">删除</button>
                  <button onClick={() => setShowReport(true)} className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">举报</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showReport && (
        <ReportModal
          type="content"
          targetId={post._id}
          onClose={() => setShowReport(false)}
        />
      )}
      {/* 推特风格评论弹窗 */}
      {showComments && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={() => setShowComments(false)}>
          <div className="w-full max-w-xl bg-white dark:bg-black rounded-t-2xl shadow-xl p-4 pb-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-lg">评论</span>
              <button className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl" onClick={() => setShowComments(false)}>&times;</button>
            </div>
            {/* 评论输入框 */}
            <form onSubmit={handleSubmitComment} className="flex items-start gap-2 mb-4">
              <img src={user?.avatar || '/default-avatar.png'} alt={user?.username} className="w-9 h-9 rounded-full object-cover mt-1" />
              <textarea
                className="flex-1 min-h-[40px] max-h-32 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#192734] text-gray-900 dark:text-gray-100 p-2 text-[15px] resize-none focus:outline-none focus:ring-2 focus:ring-twitter-blue transition-all"
                placeholder="发表你的评论..."
                value={commentContent}
                onChange={e => setCommentContent(e.target.value)}
                maxLength={280}
                rows={2}
              />
              <button type="submit" className="px-4 py-2 rounded-full font-bold text-white bg-twitter-blue hover:bg-twitter-blue/90 transition-all disabled:opacity-60" disabled={!commentContent.trim()}>发布</button>
            </form>
            {/* 评论列表 */}
            <div className="max-h-72 overflow-y-auto space-y-4 pr-2">
              {Array.isArray(post.comments) && post.comments.length > 0 ? (
                post.comments.map((comment, idx) => (
                  <div key={comment._id || idx} className="flex items-start gap-3">
                    <img src={comment.author?.avatar || '/default-avatar.png'} alt={comment.author?.username} className="w-8 h-8 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-[14px]">
                        <span className="font-bold text-gray-900 dark:text-white">{comment.author?.username}</span>
                        <span className="text-gray-500 text-xs">@{comment.author?.handle}</span>
                        <span className="text-gray-400 text-xs">· {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: zhCN }) : ''}</span>
                      </div>
                      <div className="mt-1 text-[15px] leading-[1.5] text-[#0f1419] dark:text-white whitespace-pre-wrap break-words">{comment.content}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-center py-8">暂无评论</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

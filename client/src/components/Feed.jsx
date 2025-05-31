import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { apiService } from '../services/api';
import { useToast } from '../hooks/useToast';
import { PostCard } from './PostCard';
import { useAuth } from '../contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import LoginForm from './LoginForm';
import CreatePostButton from './CreatePostButton';
import { Loader2 } from 'lucide-react';
import MainLayout from './layout/MainLayout';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';
import Skeleton from './ui/skeleton';

export const Feed = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const { error: toastError, success } = useToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const feedRef = useRef(null);
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
  });
  const { t } = useTranslation();

  const fetchPosts = async (isRefreshing = false) => {
    try {
      setLoading(true);
      setError(null);
      let data;
      if (user) {
        data = await apiService.getPosts(isRefreshing ? 1 : page);
      } else {
        data = await apiService.getPublicFeed(isRefreshing ? 1 : page);
      }
      let postsArr = [];
      if (Array.isArray(data)) {
        postsArr = data;
      } else if (data && Array.isArray(data.posts)) {
        postsArr = data.posts;
      }
      if (isRefreshing || page === 1) {
        setPosts(postsArr);
      } else {
        setPosts(prev => [...prev, ...postsArr]);
      }
      setHasMore(data && typeof data.hasMore === 'boolean' ? data.hasMore : postsArr.length > 0);
    } catch (error) {
      setError(error?.response?.data?.message || t('load_failed'));
      toastError(error?.response?.data?.message || t('load_failed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [username, page, user]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  }, [inView, hasMore, loading]);

  const handleRefresh = async () => {
    await fetchPosts(true);
  };

  const handleLike = async postId => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    try {
      await apiService.likePost(postId);
      setPosts(
        posts.map(post =>
          post._id === postId
            ? {
                ...post,
                likes: post.liked ? post.likes - 1 : post.likes + 1,
                liked: !post.liked,
              }
            : post
        )
      );
    } catch (error) {
      toastError(t('like_failed'));
    }
  };

  const handleComment = async (postId, content) => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    try {
      const comment = await apiService.createComment(postId, content);
      setPosts(
        posts.map(post =>
          post._id === postId
            ? {
                ...post,
                comments: [...post.comments, comment],
                commentCount: post.commentCount + 1,
              }
            : post
        )
      );
    } catch (error) {
      toastError(t('comment_failed'));
    }
  };

  const handleDelete = async postId => {
    try {
      await apiService.deletePost(postId);
      setPosts(posts.filter(post => post._id !== postId));
      success(t('delete_success'));
    } catch (error) {
      toastError(t('delete_failed'));
    }
  };

  if (loading && page === 1) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 p-4">
            <CreatePostButton />
          </div>
          {/* Feed骨架屏 */}
          <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Skeleton variant="avatar" className="w-12 h-12" />
                  <div className="flex-1 space-y-2">
                    <Skeleton variant="text" className="w-1/3 h-4" />
                    <Skeleton variant="text" className="w-1/4 h-4" />
                  </div>
                </div>
                <Skeleton variant="rect" className="w-full h-6" />
                <Skeleton variant="rect" className="w-full h-40" />
              </div>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={() => setPage(1)} className="text-blue-500 hover:text-blue-600">
            {t('retry')}
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6" ref={feedRef}>
        {/* 发帖按钮 */}
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 p-4">
          <CreatePostButton />
        </div>

        {/* 内容列表 */}
        <div className="space-y-4">
          {Array.isArray(posts) && posts.length > 0 ? (
            <>
              {posts.map(post => (
                <PostCard
                  key={post._id}
                  post={post}
                  onLike={() => handleLike(post._id)}
                  onComment={handleComment}
                  onDelete={() => handleDelete(post._id)}
                />
              ))}
              <div ref={loadMoreRef} className="h-4" />
              {loading && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Skeleton variant="avatar" className="w-12 h-12" />
                    <div className="flex-1 space-y-2">
                      <Skeleton variant="text" className="w-1/3 h-4" />
                      <Skeleton variant="text" className="w-1/4 h-4" />
                    </div>
                  </div>
                  <Skeleton variant="rect" className="w-full h-6" />
                  <Skeleton variant="rect" className="w-full h-40" />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">{t('no_content')}</p>
            </div>
          )}
        </div>

        {/* 登录弹窗 */}
        <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('login')}</DialogTitle>
            </DialogHeader>
            <LoginForm />
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Feed;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { useToast } from '../hooks/useToast';
import { Button } from '../components/Button';
import { PostCard } from '../components/PostCard';
import { Hash, UserPlus, UserMinus, MoreHorizontal } from 'lucide-react';

export default function Topic() {
  const { name } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [topic, setTopic] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopic();
  }, [name]);

  const fetchTopic = async () => {
    try {
      setLoading(true);
      const [topicData, postsData] = await Promise.all([
        apiService.getTopic(name),
        apiService.getTopicPosts(name)
      ]);
      setTopic(topicData);
      setPosts(postsData);
    } catch (error) {
      showToast('获取话题信息失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!user) {
      showToast('请先登录', 'error');
      return;
    }

    try {
      if (topic.isFollowing) {
        await apiService.unfollowTopic(topic._id);
        showToast('已取消关注话题');
      } else {
        await apiService.followTopic(topic._id);
        showToast('已关注话题');
      }
      setTopic(prev => ({
        ...prev,
        isFollowing: !prev.isFollowing,
        followersCount: prev.isFollowing ? prev.followersCount - 1 : prev.followersCount + 1
      }));
    } catch (error) {
      showToast('操作失败，请稍后重试', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-twitter-blue" />
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="text-center py-16 text-gray-500">
        话题不存在
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* 头部吸顶栏 */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-black/90 backdrop-blur border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Hash className="w-7 h-7 text-twitter-blue" />
            <h1 className="text-2xl md:text-3xl font-extrabold text-twitter-blue leading-tight">#{topic.name}</h1>
          </div>
          <button className="p-2 rounded-full hover:bg-twitter-blue/10 transition-colors">
            <MoreHorizontal className="w-6 h-6 text-gray-400" />
          </button>
        </div>
      </div>
      {/* 话题信息卡片 */}
      <div className="bg-white dark:bg-black rounded-2xl shadow border border-gray-200 dark:border-gray-800 p-8 mb-6 mt-4">
        {topic.description && (
          <p className="text-base text-gray-700 dark:text-gray-300 mb-4">{topic.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span>{topic.postsCount} 条推文</span>
          <span className="mx-1">·</span>
          <span>{topic.followersCount} 位关注者</span>
        </div>
        {user && (
          <Button
            variant={topic.isFollowing ? 'outline' : 'primary'}
            size="lg"
            className="rounded-full px-6 font-bold"
            onClick={handleFollow}
          >
            {topic.isFollowing ? (
              <>
                <UserMinus className="w-4 h-4 mr-2" />
                已关注
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                关注
              </>
            )}
          </Button>
        )}
      </div>
      {/* 帖子列表 */}
      <div className="bg-white dark:bg-black rounded-2xl shadow border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
        {posts.length === 0 ? (
          <div className="text-center py-16 text-gray-500">暂无相关帖子</div>
        ) : (
          posts.map((post, idx) => (
            <div key={post._id} className={idx === 0 ? '' : ''}>
              <div className="hover:bg-twitter-blue/5 transition-colors cursor-pointer px-6 py-4">
                <PostCard post={post} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 
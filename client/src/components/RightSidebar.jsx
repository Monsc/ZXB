import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { FollowService } from '../services/FollowService';
import { Search } from 'lucide-react';

const mockUsers = [
  {
    _id: 'u1',
    avatar: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png',
    username: 'Elon Musk',
    handle: 'elonmusk',
    isFollowing: false,
  },
  {
    _id: 'u2',
    avatar: '',
    username: 'jack',
    handle: 'jack',
    isFollowing: true,
  },
  {
    _id: 'u3',
    avatar: '',
    username: 'Cat Girl',
    handle: 'catgirl',
    isFollowing: false,
  },
];
const mockTopics = [
  { tag: 'SpaceX', count: 1234 },
  { tag: 'AI', count: 888 },
  { tag: 'OpenSource', count: 456 },
  { tag: '可爱', count: 321 },
];

function RightSidebar() {
  const [users, setUsers] = useState([]);
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setIsLoading(true);
      const [recommendedUsers, trendingTopics] = await Promise.all([
        apiService.getRecommendedUsers(),
        apiService.getTrendingTopics(),
      ]);
      setUsers(Array.isArray(recommendedUsers) && recommendedUsers.length > 0 ? recommendedUsers : mockUsers);
      setTopics(Array.isArray(trendingTopics) && trendingTopics.length > 0 ? trendingTopics : mockTopics);
    } catch (error) {
      // 接口异常时兜底显示 mock 数据
      setUsers(mockUsers);
      setTopics(mockTopics);
      console.error('Error loading sidebar content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <aside className="sidebar-right hidden xl:flex flex-col w-80 p-4 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-black">
        <div className="loading-spinner" />
      </aside>
    );
  }

  return (
    <aside className="sidebar-right hidden xl:flex flex-col w-80 p-4 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-black space-y-6 transition-colors duration-300">
      {/* 搜索框 */}
      <div className="mb-2">
        <form className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索"
            className="w-full pl-12 pr-4 py-2 rounded-full bg-gray-100 dark:bg-[#232d36] border border-gray-200 dark:border-gray-700 focus:border-twitter-blue focus:ring-2 focus:ring-twitter-blue/30 text-gray-900 dark:text-gray-100 text-sm outline-none transition-all"
            onClick={() => navigate('/search')}
          />
        </form>
      </div>

      {/* 推荐关注 */}
      <div className="bg-white dark:bg-black rounded-2xl shadow border border-gray-200 dark:border-gray-800 p-0 overflow-hidden">
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-base font-bold mb-2 text-gray-900 dark:text-white">推荐关注</h2>
        </div>
        <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
          {users.map(user => (
            <div
              key={user._id}
              className="flex items-center justify-between px-6 py-3 hover:bg-twitter-blue/10 dark:hover:bg-twitter-blue/20 transition-colors cursor-pointer gap-2 group"
              onClick={() => navigate(`/profile/${user._id}`)}
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar || '/default-avatar.png'}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white group-hover:border-twitter-blue transition-all"
                />
                <div>
                  <div className="font-bold text-gray-900 dark:text-white text-sm">{user.username}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">@{user.handle}</div>
                </div>
              </div>
              <button
                className={`px-4 py-1 rounded-full text-xs font-bold transition-colors border-none focus:outline-none focus:ring-2 focus:ring-twitter-blue/50 ${
                  user.isFollowing
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'bg-twitter-blue text-white hover:bg-twitter-blue/90'
                }`}
                onClick={async e => {
                  e.stopPropagation();
                  try {
                    if (user.isFollowing) {
                      await FollowService.unfollowUser(user._id);
                    } else {
                      await FollowService.followUser(user._id);
                    }
                    setUsers(prev =>
                      prev.map(u =>
                        u._id === user._id ? { ...u, isFollowing: !u.isFollowing } : u
                      )
                    );
                  } catch (err) {}
                }}
              >
                {user.isFollowing ? '已关注' : '关注'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 热门话题 */}
      <div className="bg-white dark:bg-black rounded-2xl shadow border border-gray-200 dark:border-gray-800 p-0 overflow-hidden">
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-base font-bold mb-2 text-gray-900 dark:text-white">热门话题</h2>
        </div>
        <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
          {topics.map(topic => (
            <div
              key={topic.tag}
              className="flex items-center gap-2 px-6 py-3 hover:bg-twitter-blue/10 dark:hover:bg-twitter-blue/20 transition-colors cursor-pointer"
              onClick={() => navigate(`/topic/${topic.tag}`)}
            >
              <span className="text-twitter-blue font-bold">#{topic.tag}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{topic.count} 条帖子</span>
            </div>
          ))}
        </div>
      </div>

      {/* 底部链接 */}
      <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-2">
        <a href="/about" className="hover:underline">关于</a>
        <a href="/privacy" className="hover:underline">隐私</a>
        <a href="/terms" className="hover:underline">条款</a>
        <a href="/help" className="hover:underline">帮助</a>
        <span>© 2024 走线吧</span>
      </div>
    </aside>
  );
}

export default RightSidebar;

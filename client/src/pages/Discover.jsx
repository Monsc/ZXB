import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Flame, MoreHorizontal, Search } from 'lucide-react';
import { PostCard } from '../components/PostCard';
import Skeleton from '../components/ui/skeleton';
import LazyImage from '../components/LazyImage';

const Discover = () => {
  const [topics, setTopics] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hotPosts, setHotPosts] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const trendingTopics = await apiService.getTrendingTopics();
        const recommendedUsers = await apiService.getRecommendedUsers();
        setTopics(trendingTopics || []);
        setUsers(recommendedUsers || []);
        // mock 热门推文
        setHotPosts([
          {
            _id: 'p1',
            author: { username: 'elonmusk', avatar: '', name: 'Elon Musk' },
            content: 'AI is changing the world! #AI',
            images: [],
            likeCount: 1234,
            commentCount: 88,
            createdAt: new Date().toISOString(),
          },
          {
            _id: 'p2',
            author: { username: 'openai', avatar: '', name: 'OpenAI' },
            content: 'ChatGPT 新版本上线啦！',
            images: [],
            likeCount: 888,
            commentCount: 66,
            createdAt: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 搜索框回车跳转
  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-4">
      {/* 顶部吸顶栏+搜索框 */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-black/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
        <div className="px-4 pt-4 pb-2 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">探索</h1>
            <button className="p-2 rounded-full hover:bg-twitter-blue/10 transition-colors">
              <MoreHorizontal className="w-6 h-6 text-gray-400" />
            </button>
          </div>
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="搜索推文、话题或用户"
              className="w-full pl-12 pr-4 py-2 rounded-full bg-gray-100 dark:bg-[#232d36] border border-gray-200 dark:border-gray-700 focus:border-twitter-blue focus:ring-2 focus:ring-twitter-blue/30 text-base text-gray-900 dark:text-white placeholder:text-gray-400 transition-all outline-none"
            />
          </form>
        </div>
      </div>
      <div className="p-4 space-y-6">
        {/* 热门话题区块 */}
        <div className="bg-white dark:bg-black rounded-2xl shadow border border-gray-200 dark:border-gray-800 p-0 overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">热门话题</h2>
            <button className="p-2 rounded-full hover:bg-twitter-blue/10 transition-colors">
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-6 py-4">
                  <Skeleton variant="rect" className="w-24 h-6" />
                  <Skeleton variant="rect" className="w-20 h-4" />
                  <Skeleton variant="rect" className="w-10 h-4" />
                </div>
              ))
            ) : topics.length === 0 ? (
              <span className="text-gray-500 px-6 py-4">暂无热门话题</span>
            ) : (
              topics.map(topic => (
                <div
                  key={topic._id || topic.name}
                  className="flex items-center gap-3 px-6 py-4 hover:bg-twitter-blue/10 dark:hover:bg-twitter-blue/20 transition-colors cursor-pointer"
                  onClick={() => navigate(`/topic/${topic.name || topic}`)}
                >
                  <span className="font-bold text-twitter-blue text-base">#{topic.name || topic}</span>
                  <span className="flex items-center text-gray-500 text-sm ml-2">
                    <Flame className="w-4 h-4 mr-1 text-orange-500" />{topic.tweetCount || Math.floor(Math.random()*1000+100)}条推文
                  </span>
                  {typeof topic.trendChange === 'number' && (
                    <span className={`flex items-center ml-2 text-xs ${topic.trendChange > 0 ? 'text-green-500' : topic.trendChange < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                      {topic.trendChange > 0 ? <TrendingUp className="w-4 h-4 mr-0.5" /> : topic.trendChange < 0 ? <TrendingDown className="w-4 h-4 mr-0.5" /> : null}
                      {topic.trendChange > 0 ? `+${topic.trendChange}` : topic.trendChange}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        {/* 热门推文区块 */}
        <div className="bg-white dark:bg-black rounded-2xl shadow border border-gray-200 dark:border-gray-800 p-0 overflow-hidden">
          <div className="px-6 pt-6 pb-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">热门推文</h2>
          </div>
          <div className="space-y-4 px-6 pb-6">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton variant="rect" className="w-full h-6" />
                  <Skeleton variant="rect" className="w-full h-32" />
                </div>
              ))
            ) : hotPosts.length === 0 ? (
              <span className="text-gray-500">暂无热门推文</span>
            ) : (
              hotPosts.map(post => (
                <div key={post._id} onClick={() => navigate(`/post/${post._id}`)} className="cursor-pointer hover:bg-twitter-blue/5 rounded-xl transition-colors">
                  <PostCard post={post} />
                </div>
              ))
            )}
          </div>
        </div>
        {/* 推荐用户区块 */}
        <div className="bg-white dark:bg-black rounded-2xl shadow border border-gray-200 dark:border-gray-800 p-0 overflow-hidden">
          <div className="px-6 pt-6 pb-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">推荐用户</h2>
          </div>
          <div className="space-y-4 px-6 pb-6">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton variant="avatar" className="w-10 h-10" />
                  <div className="flex-1">
                    <Skeleton variant="rect" className="w-24 h-4 mb-1" />
                    <Skeleton variant="rect" className="w-20 h-3" />
                  </div>
                  <Skeleton variant="button" className="w-16" />
                </div>
              ))
            ) : users.length === 0 ? (
              <span className="text-gray-500">暂无推荐用户</span>
            ) : (
              users.map(user => (
                <div key={user._id} className="flex items-center space-x-4 group">
                  <LazyImage src={user.avatar || '/default-avatar.png'} alt="avatar" className="w-10 h-10 rounded-full object-cover border-2 border-white group-hover:border-twitter-blue transition-all" />
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 dark:text-white">{user.name || user.username}</div>
                    <div className="text-gray-500 text-sm">@{user.username}</div>
                  </div>
                  <button className="text-white bg-twitter-blue hover:bg-twitter-blue/90 rounded-full px-4 py-1 font-bold text-sm transition-colors">关注</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;

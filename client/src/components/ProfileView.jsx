import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import { apiService } from '../services/api';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import UserList from './UserList';
import MessageModal from './MessageModal';
import ReportModal from './ReportModal';

function ProfileView({ userId, onClose }) {
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    posts: 0,
    followers: 0,
    following: 0,
    likes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [userListType, setUserListType] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileResponse, statsResponse] = await Promise.all([
          apiService.get(`/users/${userId}`),
          apiService.get(`/users/${userId}/stats`),
        ]);
        setUser(profileResponse.data);
        setStats(statsResponse.data);
        setIsFollowing(profileResponse.data.followers.includes(currentUser._id));
      } catch (error) {
        showToast('获取用户信息失败', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleFollow = async () => {
    try {
      setLoading(true);
      const response = await apiService.post(`/users/${userId}/follow`);
      setUser(prev => ({
        ...prev,
        followers: response.data.followers,
        isFollowing: response.data.isFollowing,
      }));
      showToast(response.data.isFollowing ? '关注成功' : '取消关注成功', 'success');
    } catch (error) {
      showToast('操作失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUserListClick = type => {
    setUserListType(type);
    setShowUserList(true);
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-twitter-blue border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-black rounded-2xl w-full max-w-2xl mx-4 overflow-hidden shadow-xl"
          onClick={e => e.stopPropagation()}
        >
          {/* 顶部Banner */}
          <div className="relative h-48 bg-twitter-blue">
            {user.bannerUrl && (
              <img src={user.bannerUrl} alt="banner" className="absolute inset-0 w-full h-full object-cover" />
            )}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 text-white hover:bg-black/10 p-2 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 个人信息区 */}
          <div className="px-6 pb-4 bg-white dark:bg-black">
            <div className="relative flex flex-col gap-2 -mt-16 mb-2">
              <div className="flex items-end gap-4">
                <div className="relative z-10">
                  <Avatar user={user} size="xxl" className="ring-4 ring-white dark:ring-black -mt-12" />
                </div>
                <div className="flex-1 flex justify-end gap-2">
                  {currentUser._id !== userId && (
                    <>
                      <button
                        onClick={() => setShowMessageModal(true)}
                        className="px-4 py-2 rounded-full font-bold bg-twitter-blue text-white hover:bg-twitter-blue/90 transition-all"
                      >私信</button>
                      <button
                        onClick={() => setShowReportModal(true)}
                        className="px-4 py-2 rounded-full font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                      >举报</button>
                      <button
                        onClick={handleFollow}
                        className={`px-4 py-2 rounded-full font-bold transition-all ${
                          isFollowing
                            ? 'bg-white text-black border border-twitter-blue hover:bg-twitter-blue/10'
                            : 'bg-twitter-blue text-white hover:bg-twitter-blue/90'
                        }`}
                      >
                        {isFollowing ? '已关注' : '关注'}
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="mt-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{user.username}</h2>
                <p className="text-twitter-gray-500 text-base">@{user.handle}</p>
              </div>
              {user.bio && <p className="mt-2 text-[15px] text-gray-900 dark:text-gray-200 whitespace-pre-wrap">{user.bio}</p>}
              <div className="flex flex-wrap gap-4 text-sm text-twitter-gray-500 mt-2">
                {user.location && (
                  <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>{user.location}</span>
                )}
                {user.website && (
                  <a href={user.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-twitter-blue hover:underline"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>{user.website}</a>
                )}
                {user.birthdate && (
                  <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>{format(new Date(user.birthdate), 'yyyy年MM月dd日', { locale: zhCN })}</span>
                )}
                {user.gender && (
                  <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>{user.gender === 'male' ? '男' : user.gender === 'female' ? '女' : '其他'}</span>
                )}
                <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>加入时间 {user.createdAt ? format(new Date(user.createdAt), 'yyyy年MM月', { locale: zhCN }) : ''}</span>
              </div>
              {/* 统计数据 */}
              <div className="flex gap-6 mt-3 mb-2 text-sm">
                <button onClick={() => handleUserListClick('following')} className="hover:underline font-bold text-gray-900 dark:text-white"><span>{stats.following}</span> <span className="font-normal text-twitter-gray-500">关注中</span></button>
                <button onClick={() => handleUserListClick('followers')} className="hover:underline font-bold text-gray-900 dark:text-white"><span>{stats.followers}</span> <span className="font-normal text-twitter-gray-500">粉丝</span></button>
                <button onClick={() => handleUserListClick('posts')} className="hover:underline font-bold text-gray-900 dark:text-white"><span>{stats.posts}</span> <span className="font-normal text-twitter-gray-500">推文</span></button>
                <button onClick={() => handleUserListClick('likes')} className="hover:underline font-bold text-gray-900 dark:text-white"><span>{stats.likes}</span> <span className="font-normal text-twitter-gray-500">获赞</span></button>
              </div>
            </div>
            {/* 标签页 */}
            <div className="border-b border-gray-200 dark:border-gray-800 mt-2">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`flex-1 py-4 font-bold text-base transition-colors border-b-2 ${activeTab === 'posts' ? 'text-twitter-blue border-twitter-blue' : 'text-twitter-gray-500 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >推文</button>
                <button
                  onClick={() => setActiveTab('replies')}
                  className={`flex-1 py-4 font-bold text-base transition-colors border-b-2 ${activeTab === 'replies' ? 'text-twitter-blue border-twitter-blue' : 'text-twitter-gray-500 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >回复</button>
                <button
                  onClick={() => setActiveTab('media')}
                  className={`flex-1 py-4 font-bold text-base transition-colors border-b-2 ${activeTab === 'media' ? 'text-twitter-blue border-twitter-blue' : 'text-twitter-gray-500 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >媒体</button>
                <button
                  onClick={() => setActiveTab('likes')}
                  className={`flex-1 py-4 font-bold text-base transition-colors border-b-2 ${activeTab === 'likes' ? 'text-twitter-blue border-twitter-blue' : 'text-twitter-gray-500 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >喜欢</button>
              </div>
            </div>
            {/* 内容区域 */}
            <div className="mt-4">
              {posts.length > 0 ? (
                posts.map(post => (
                  <div key={post._id} className="border-b border-gray-200 dark:border-gray-800 py-4">
                    {/* 帖子内容 */}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-twitter-gray-500">暂无内容</div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
      {/* 用户列表模态框 */}
      {showUserList && (
        <UserList type={userListType} userId={userId} onClose={() => setShowUserList(false)} />
      )}
      {/* 私信模态框 */}
      {showMessageModal && (
        <MessageModal targetUser={user} onClose={() => setShowMessageModal(false)} />
      )}
      {/* 举报模态框 */}
      {showReportModal && (
        <ReportModal type="user" targetId={userId} onClose={() => setShowReportModal(false)} />
      )}
    </>
  );
}

export default ProfileView;

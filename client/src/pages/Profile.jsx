import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { useToast } from '../hooks/useToast';
import { Button } from '../components/Button';
import { PostCard } from '../components/PostCard';
import { UserPlus, UserMinus, Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';

export default function Profile() {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const { t } = useTranslation();

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const [profileData, postsData] = await Promise.all([
        apiService.getUserProfile(username),
        apiService.getUserPosts(username)
      ]);
      setProfile(profileData);
      setPosts(postsData);
    } catch (error) {
      showToast(t('fetch_user_failed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!currentUser) {
      showToast(t('please_login_first'), 'error');
      return;
    }

    try {
      if (profile.isFollowing) {
        await apiService.unfollowUser(profile._id);
        showToast(t('unfollow_success'));
      } else {
        await apiService.followUser(profile._id);
        showToast(t('follow_success'));
      }
      setProfile(prev => ({
        ...prev,
        isFollowing: !prev.isFollowing,
        followersCount: prev.isFollowing ? prev.followersCount - 1 : prev.followersCount + 1
      }));
    } catch (error) {
      showToast(t('operation_failed_retry'), 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8 text-gray-500">
        {t('user_not_found')}
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-sm mb-8 overflow-hidden">
      {/* 封面图 */}
      <div className="h-48 bg-gray-200 dark:bg-gray-800 relative">
        {profile.coverImage && (
          <img
            src={profile.coverImage}
            alt="封面"
            className="w-full h-full object-cover"
          />
        )}
        {/* 头像浮动在封面下方 */}
        <div className="absolute left-6 -bottom-16 z-10">
          <img
            src={profile.avatar}
            alt={profile.username}
            className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-900 object-cover shadow-lg"
          />
        </div>
      </div>

      {/* 个人信息 */}
      <div className="pt-20 px-6 pb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.username}</h1>
            <p className="text-gray-500 dark:text-gray-400">@{profile.handle}</p>
          </div>
          <div className="flex space-x-2">
            {currentUser && currentUser._id !== profile._id ? (
              <Button
                variant={profile.isFollowing ? 'outline' : 'default'}
                onClick={handleFollow}
                className="rounded-full px-5 py-2 font-bold text-sm transition-colors hover:bg-blue-600 hover:text-white"
              >
                {profile.isFollowing ? (
                  <>
                    <UserMinus className="w-4 h-4 mr-2" />{t('unfollow')}
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />{t('follow')}
                  </>
                )}
              </Button>
            ) : currentUser && currentUser._id === profile._id ? (
              <Link to="/settings">
                <Button variant="outline" className="rounded-full px-5 py-2 font-bold text-sm">
                  <Settings className="w-4 h-4 mr-2" />{t('edit_profile')}
                </Button>
              </Link>
            ) : null}
          </div>
        </div>
        {profile.bio && (
          <p className="text-gray-700 dark:text-gray-300 mb-4 text-[15px]">{profile.bio}</p>
        )}
        {/* 统计信息 */}
        <div className="flex space-x-4 mb-4 text-sm">
          <Link
            to={`/profile/${profile.username}/following`}
            className="text-gray-700 dark:text-gray-300 hover:underline"
          >
            <span className="font-bold">{profile.followingCount}</span> {t('following')}
          </Link>
          <Link
            to={`/profile/${profile.username}/followers`}
            className="text-gray-700 dark:text-gray-300 hover:underline"
          >
            <span className="font-bold">{profile.followersCount}</span> {t('followers')}
          </Link>
          <span className="text-gray-700 dark:text-gray-300">
            <span className="font-bold">{profile.postsCount}</span> {t('posts')}
          </span>
        </div>
        {/* 标签页 */}
        <div className="border-b border-gray-200 dark:border-gray-800">
          <div className="flex space-x-8">
            <button
              className={cn(
                'py-4 border-b-2 font-medium text-sm',
                activeTab === 'posts'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              )}
              onClick={() => setActiveTab('posts')}
            >
              {t('posts')}
            </button>
            <button
              className={cn(
                'py-4 border-b-2 font-medium text-sm',
                activeTab === 'media'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              )}
              onClick={() => setActiveTab('media')}
            >
              {t('media')}
            </button>
            <button
              className={cn(
                'py-4 border-b-2 font-medium text-sm',
                activeTab === 'likes'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              )}
              onClick={() => setActiveTab('likes')}
            >
              {t('likes')}
            </button>
          </div>
        </div>
        {/* 内容区 */}
        <div className="mt-6">
          {activeTab === 'posts' && (
            <div className="space-y-4">
              {posts.length > 0 ? posts.map(post => <PostCard key={post._id} post={post} />) : <div className="text-center text-gray-500">{t('no_posts')}</div>}
            </div>
          )}
          {/* 其他标签页内容可后续补充 */}
        </div>
      </div>
    </div>
  );
}

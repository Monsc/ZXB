import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { useToast } from '../hooks/useToast';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { User, Shield, Bell, Palette, ImagePlus, X } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import { Button } from '../components/Button';
import { cn } from '../lib/utils';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    handle: '',
    bio: '',
    avatar: null,
    coverImage: null,
  });
  const [preview, setPreview] = useState({
    avatar: '',
    coverImage: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        handle: user.handle || '',
        bio: user.bio || '',
        avatar: null,
        coverImage: null,
      });
      setPreview({
        avatar: user.avatar || '',
        coverImage: user.coverImage || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('请选择图片文件', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('图片大小不能超过5MB', 'error');
      return;
    }

    setFormData(prev => ({
      ...prev,
      [type]: file,
    }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(prev => ({
        ...prev,
        [type]: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('username', formData.username);
      data.append('handle', formData.handle);
      data.append('bio', formData.bio);
      if (formData.avatar) {
        data.append('avatar', formData.avatar);
      }
      if (formData.coverImage) {
        data.append('coverImage', formData.coverImage);
      }

      const updatedUser = await apiService.updateProfile(data);
      updateUser(updatedUser);
      showToast('个人资料已更新');
      navigate(`/profile/${updatedUser.username}`);
    } catch (error) {
      showToast('更新失败，请稍后重试', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">设置</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 左侧导航 */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-black rounded-2xl shadow border border-gray-200 dark:border-gray-800 p-4">
              <nav className="space-y-2">
                <Link
                  to="/settings/profile"
                  className={`flex items-center gap-3 px-4 py-3 rounded-full font-bold text-base transition-all duration-150 select-none ${currentPath === 'profile' ? 'bg-twitter-blue/10 text-twitter-blue' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                  <User className="w-5 h-5" /> 个人资料
                </Link>
                <Link
                  to="/settings/security"
                  className={`flex items-center gap-3 px-4 py-3 rounded-full font-bold text-base transition-all duration-150 select-none ${currentPath === 'security' ? 'bg-twitter-blue/10 text-twitter-blue' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                  <Shield className="w-5 h-5" /> 安全设置
                </Link>
                <Link
                  to="/settings/notifications"
                  className={`flex items-center gap-3 px-4 py-3 rounded-full font-bold text-base transition-all duration-150 select-none ${currentPath === 'notifications' ? 'bg-twitter-blue/10 text-twitter-blue' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                  <Bell className="w-5 h-5" /> 通知设置
                </Link>
                <Link
                  to="/settings/appearance"
                  className={`flex items-center gap-3 px-4 py-3 rounded-full font-bold text-base transition-all duration-150 select-none ${currentPath === 'appearance' ? 'bg-twitter-blue/10 text-twitter-blue' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                  <Palette className="w-5 h-5" /> 外观设置
                </Link>
              </nav>
            </div>
          </div>
          {/* 表单区域 */}
          <div className="md:col-span-3">
            <div className="bg-white dark:bg-black rounded-2xl shadow border border-gray-200 dark:border-gray-800 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">编辑个人资料</h2>
              <form onSubmit={handleSubmit} className="space-y-7">
                {/* 封面图 */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">封面图</label>
                  <div className="relative h-48 bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden group">
                    {preview.coverImage ? (
                      <img
                        src={preview.coverImage}
                        alt="封面预览"
                        className="w-full h-full object-cover transition-all group-hover:brightness-90"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImagePlus className="w-10 h-10 text-gray-400" />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 'coverImage')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
                {/* 头像 */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">头像</label>
                  <div className="relative w-24 h-24 rounded-full overflow-hidden group border-4 border-white dark:border-black shadow mx-auto">
                    {preview.avatar ? (
                      <img
                        src={preview.avatar}
                        alt="头像预览"
                        className="w-full h-full object-cover transition-all group-hover:brightness-90"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                        <User className="w-10 h-10 text-gray-400" />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 'avatar')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
                {/* 用户名、handle、简介 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">用户名</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full rounded-full bg-gray-50 dark:bg-[#232d36] border border-gray-200 dark:border-gray-700 px-5 py-2 text-base text-gray-900 dark:text-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-twitter-blue focus:border-twitter-blue disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                      placeholder="用户名"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">@Handle</label>
                    <input
                      type="text"
                      name="handle"
                      value={formData.handle}
                      onChange={handleChange}
                      className="w-full rounded-full bg-gray-50 dark:bg-[#232d36] border border-gray-200 dark:border-gray-700 px-5 py-2 text-base text-gray-900 dark:text-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-twitter-blue focus:border-twitter-blue disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                      placeholder="@handle"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">简介</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-2xl bg-gray-50 dark:bg-[#232d36] border border-gray-200 dark:border-gray-700 px-5 py-2 text-base text-gray-900 dark:text-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-twitter-blue focus:border-twitter-blue disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                    placeholder="简介"
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" variant="primary" size="lg" disabled={loading}>
                    {loading ? '保存中...' : '保存修改'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;

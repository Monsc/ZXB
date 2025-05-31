import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';
import { toast } from 'react-hot-toast';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import ErrorState from '@/components/common/ErrorState';
import Switch from '@/components/common/Switch';
import { useTranslation } from 'react-i18next';

const NotificationSettingsPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [settings, setSettings] = useState({
    email: {
      follow: true,
      like: true,
      comment: true,
      mention: true,
      system: true,
    },
    push: {
      follow: true,
      like: true,
      comment: true,
      mention: true,
      system: true,
    },
    inApp: {
      follow: true,
      like: true,
      comment: true,
      mention: true,
      system: true,
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // 获取通知设置
  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/notifications/settings');
      setSettings(response.data.settings);
    } catch (err) {
      setError(err.message || t('fetch_settings_failed'));
      toast.error(t('fetch_settings_failed_retry'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  // 更新通知设置
  const updateSettings = async () => {
    try {
      setSaving(true);
      await api.put('/notifications/settings', settings);
      toast.success(t('settings_saved'));
    } catch (err) {
      toast.error(t('save_settings_failed_retry'));
    } finally {
      setSaving(false);
    }
  };

  // 处理开关切换
  const handleToggle = (channel, type) => {
    setSettings(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [type]: !prev[channel][type],
      },
    }));
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('please_login_first')}</h2>
            <p className="text-gray-600 mb-4">{t('login_to_customize_notifications')}</p>
            <Button onClick={() => router.push('/login')}>{t('go_login')}</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm">
          {/* 标题 */}
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-900">{t('notification_settings')}</h1>
            <p className="mt-2 text-gray-600">{t('customize_notification_types')}</p>
          </div>

          <LoadingOverlay isLoading={loading}>
            {error ? (
              <div className="p-6">
                <ErrorState
                  title={t('fetch_settings_failed')}
                  description={error}
                  action={<Button onClick={fetchSettings}>{t('retry')}</Button>}
                />
              </div>
            ) : (
              <div className="divide-y">
                {/* 邮件通知 */}
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">{t('email_notifications')}</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{t('new_follower')}</h3>
                        <p className="text-sm text-gray-500">{t('email_new_follower_desc')}</p>
                      </div>
                      <Switch
                        checked={settings.email.follow}
                        onChange={() => handleToggle('email', 'follow')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{t('like_notification')}</h3>
                        <p className="text-sm text-gray-500">{t('email_like_desc')}</p>
                      </div>
                      <Switch
                        checked={settings.email.like}
                        onChange={() => handleToggle('email', 'like')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{t('comment_notification')}</h3>
                        <p className="text-sm text-gray-500">{t('email_comment_desc')}</p>
                      </div>
                      <Switch
                        checked={settings.email.comment}
                        onChange={() => handleToggle('email', 'comment')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{t('mention_notification')}</h3>
                        <p className="text-sm text-gray-500">{t('email_mention_desc')}</p>
                      </div>
                      <Switch
                        checked={settings.email.mention}
                        onChange={() => handleToggle('email', 'mention')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{t('system_notification')}</h3>
                        <p className="text-sm text-gray-500">{t('email_system_desc')}</p>
                      </div>
                      <Switch
                        checked={settings.email.system}
                        onChange={() => handleToggle('email', 'system')}
                      />
                    </div>
                  </div>
                </div>

                {/* 推送通知 */}
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">{t('push_notifications')}</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{t('new_follower')}</h3>
                        <p className="text-sm text-gray-500">{t('push_new_follower_desc')}</p>
                      </div>
                      <Switch
                        checked={settings.push.follow}
                        onChange={() => handleToggle('push', 'follow')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{t('like_notification')}</h3>
                        <p className="text-sm text-gray-500">{t('push_like_desc')}</p>
                      </div>
                      <Switch
                        checked={settings.push.like}
                        onChange={() => handleToggle('push', 'like')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{t('comment_notification')}</h3>
                        <p className="text-sm text-gray-500">{t('push_comment_desc')}</p>
                      </div>
                      <Switch
                        checked={settings.push.comment}
                        onChange={() => handleToggle('push', 'comment')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">提及通知</h3>
                        <p className="text-sm text-gray-500">当有人在评论中提及你时发送推送通知</p>
                      </div>
                      <Switch
                        checked={settings.push.mention}
                        onChange={() => handleToggle('push', 'mention')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">系统通知</h3>
                        <p className="text-sm text-gray-500">接收系统更新、活动等推送通知</p>
                      </div>
                      <Switch
                        checked={settings.push.system}
                        onChange={() => handleToggle('push', 'system')}
                      />
                    </div>
                  </div>
                </div>

                {/* 应用内通知 */}
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">应用内通知</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">新关注者</h3>
                        <p className="text-sm text-gray-500">当有新用户关注你时显示应用内通知</p>
                      </div>
                      <Switch
                        checked={settings.inApp.follow}
                        onChange={() => handleToggle('inApp', 'follow')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">点赞通知</h3>
                        <p className="text-sm text-gray-500">当有人点赞你的帖子时显示应用内通知</p>
                      </div>
                      <Switch
                        checked={settings.inApp.like}
                        onChange={() => handleToggle('inApp', 'like')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">评论通知</h3>
                        <p className="text-sm text-gray-500">当有人评论你的帖子时显示应用内通知</p>
                      </div>
                      <Switch
                        checked={settings.inApp.comment}
                        onChange={() => handleToggle('inApp', 'comment')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">提及通知</h3>
                        <p className="text-sm text-gray-500">
                          当有人在评论中提及你时显示应用内通知
                        </p>
                      </div>
                      <Switch
                        checked={settings.inApp.mention}
                        onChange={() => handleToggle('inApp', 'mention')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">系统通知</h3>
                        <p className="text-sm text-gray-500">显示系统更新、活动等应用内通知</p>
                      </div>
                      <Switch
                        checked={settings.inApp.system}
                        onChange={() => handleToggle('inApp', 'system')}
                      />
                    </div>
                  </div>
                </div>

                {/* 保存按钮 */}
                <div className="p-6 bg-gray-50">
                  <Button onClick={updateSettings} disabled={saving} className="w-full sm:w-auto">
                    {saving ? '保存中...' : '保存设置'}
                  </Button>
                </div>
              </div>
            )}
          </LoadingOverlay>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotificationSettingsPage;

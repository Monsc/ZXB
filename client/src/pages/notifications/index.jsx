import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '@/services/api';
import { toast } from 'react-hot-toast';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import EmptyState from '@/components/common/EmptyState';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, AtSign, Info, UserPlus, Heart, MessageCircle, Trash2, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Skeleton from '@/components/ui/skeleton';

const { t } = useTranslation();

const tabTypes = [
  { value: 'all', label: t('all'), icon: Bell },
  { value: 'mention', label: t('mention'), icon: AtSign },
  { value: 'system', label: t('system'), icon: Info },
];

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState('all');

  // 获取通知列表
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/notifications', {
        params: {
          type: activeTab === 'all' ? undefined : activeTab,
        },
      });
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
    } catch (err) {
      setError(err.message || t('fetch_notifications_failed'));
      toast.error(t('fetch_notifications_failed_retry'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
    // eslint-disable-next-line
  }, [user, activeTab]);

  // 标记通知为已读
  const markAsRead = async notificationId => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      setNotifications(
        notifications.map(notification =>
          notification._id === notificationId ? { ...notification, read: true } : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      toast.error(t('operation_failed_retry'));
    }
  };

  // 删除通知
  const deleteNotification = async notificationId => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      setNotifications(notifications.filter(n => n._id !== notificationId));
      toast.success(t('notification_deleted'));
    } catch (err) {
      toast.error(t('delete_failed_retry'));
    }
  };

  // 标记所有通知为已读
  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(
        notifications.map(notification => ({
          ...notification,
          read: true,
        }))
      );
      setUnreadCount(0);
      toast.success(t('all_marked_read'));
    } catch (err) {
      toast.error(t('operation_failed_retry'));
    }
  };

  // 处理通知点击
  const handleNotificationClick = notification => {
    if (!notification.read) {
      markAsRead(notification._id);
    }
    // 跳转逻辑
    switch (notification.type) {
      case 'follow':
        navigate(`/user/${notification.sender.username}`);
        break;
      case 'like':
      case 'comment':
        navigate(`/post/${notification.post._id}`);
        break;
      case 'mention':
        navigate(`/post/${notification.post._id}#comment-${notification.comment._id}`);
        break;
      default:
        break;
    }
  };

  // 渲染通知内容和图标
  const renderNotification = notification => {
    let icon = <Bell className="w-5 h-5 text-primary" />;
    let content = null;
    if (notification.type === 'follow') {
      icon = <UserPlus className="w-5 h-5 text-primary" />;
      content = <><span className="font-bold">{notification.sender.username}</span> {t('followed_you')}</>;
    } else if (notification.type === 'like') {
      icon = <Heart className="w-5 h-5 text-rose-500" />;
      content = <><span className="font-bold">{notification.sender.username}</span> {t('liked_your_post')}</>;
    } else if (notification.type === 'comment') {
      icon = <MessageCircle className="w-5 h-5 text-blue-500" />;
      content = <><span className="font-bold">{notification.sender.username}</span> {t('commented_your_post')}:<span className="text-muted-foreground">{notification.comment.content}</span></>;
    } else if (notification.type === 'mention') {
      icon = <AtSign className="w-5 h-5 text-violet-500" />;
      content = <><span className="font-bold">{notification.sender.username}</span> {t('mentioned_you_in_comment')}:<span className="text-muted-foreground">{notification.comment.content}</span></>;
    } else if (notification.type === 'system') {
      icon = <Info className="w-5 h-5 text-gray-500" />;
      content = <span>{notification.content}</span>;
    }
    return { icon, content };
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto py-16">
          <EmptyState
            title={t('please_login_first')}
            description={t('login_to_view_notifications')}
            action={<Button onClick={() => navigate('/login')}>{t('go_login')}</Button>}
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto py-8">
        {/* 顶部 Tabs 和操作栏 */}
        <div className="flex items-center justify-between mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              {tabTypes.map(tab => (
                <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2">
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {tab.value === 'all' && unreadCount > 0 && (
                    <span className="ml-1 px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Button variant="ghost" size="sm" onClick={markAllAsRead} className="ml-4">
            <Check className="w-4 h-4 mr-1" /> {t('mark_all_read')}
          </Button>
        </div>
        <LoadingOverlay isLoading={loading}>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl shadow-sm bg-white dark:bg-accent/30">
                  <Skeleton variant="avatar" className="w-10 h-10 mt-1" />
                  <div className="flex-1 min-w-0 space-y-2">
                    <Skeleton variant="text" className="w-1/3" />
                    <Skeleton variant="rect" className="w-full h-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <EmptyState title={t('no_notifications')} description={t('no_notifications_desc')} />
          ) : (
            <div className="space-y-3">
              {notifications.map(notification => {
                const { icon, content } = renderNotification(notification);
                return (
                  <div
                    key={notification._id}
                    className={`flex items-start gap-3 p-4 rounded-xl shadow-sm bg-white dark:bg-accent/30 transition-colors cursor-pointer hover:bg-accent/50 relative ${!notification.read ? 'border-l-4 border-primary' : 'opacity-70'}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex-shrink-0 mt-1">{icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-base">{content}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: zhCN })}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end ml-2">
                      {!notification.read && (
                        <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); markAsRead(notification._id); }} title="标记为已读">
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); deleteNotification(notification._id); }} title="删除">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </LoadingOverlay>
      </div>
    </MainLayout>
  );
};

export default NotificationsPage;

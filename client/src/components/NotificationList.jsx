'use client';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { useToast } from '../hooks/useToast';
import { cn } from '../lib/utils';
import { Bell, Heart, MessageSquare, UserPlus, Hash } from 'lucide-react';

const NotificationTypes = {
  LIKE: 'like',
  COMMENT: 'comment',
  FOLLOW: 'follow',
  MENTION: 'mention',
  TOPIC: 'topic',
};

const NotificationIcon = ({ type }) => {
  switch (type) {
    case NotificationTypes.LIKE:
      return <Heart className="w-6 h-6 text-red-500" />;
    case NotificationTypes.COMMENT:
      return <MessageSquare className="w-6 h-6 text-twitter-blue" />;
    case NotificationTypes.FOLLOW:
      return <UserPlus className="w-6 h-6 text-green-500" />;
    case NotificationTypes.MENTION:
      return <MessageSquare className="w-6 h-6 text-purple-500" />;
    case NotificationTypes.TOPIC:
      return <Hash className="w-6 h-6 text-orange-500" />;
    default:
      return <Bell className="w-6 h-6 text-gray-500" />;
  }
};

export const NotificationList = ({ type = 'all' }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line
  }, [type]);

  const fetchNotifications = async () => {
    try {
      const data = await apiService.getNotifications();
      // type筛选
      let filtered = data;
      if (type === 'mention') {
        filtered = data.filter(n => n.type === NotificationTypes.MENTION);
      } else if (type === 'interact') {
        filtered = data.filter(n => n.type === NotificationTypes.LIKE || n.type === NotificationTypes.COMMENT || n.type === NotificationTypes.FOLLOW);
      }
      setNotifications(filtered);
    } catch (error) {
      showToast('获取通知失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getNotificationContent = (notification) => {
    switch (notification.type) {
      case NotificationTypes.LIKE:
        return <><span className="font-bold">{notification.sender.username}</span> 赞了你的帖子</>;
      case NotificationTypes.COMMENT:
        return <><span className="font-bold">{notification.sender.username}</span> 评论了你的帖子</>;
      case NotificationTypes.FOLLOW:
        return <><span className="font-bold">{notification.sender.username}</span> 关注了你</>;
      case NotificationTypes.MENTION:
        return <><span className="font-bold">{notification.sender.username}</span> 在帖子中提到了你</>;
      case NotificationTypes.TOPIC:
        return <>你关注的话题 <span className="font-bold text-twitter-blue">#{notification.topic}</span> 有新帖子</>;
      default:
        return notification.content;
    }
  };

  const getNotificationLink = (notification) => {
    switch (notification.type) {
      case NotificationTypes.LIKE:
      case NotificationTypes.COMMENT:
      case NotificationTypes.MENTION:
        return `/post/${notification.postId}`;
      case NotificationTypes.FOLLOW:
        return `/profile/${notification.sender.username}`;
      case NotificationTypes.TOPIC:
        return `/topic/${notification.topic}`;
      default:
        return '#';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-twitter-blue" />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 text-base">暂无通知</div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <Link
          key={notification._id}
          to={getNotificationLink(notification)}
          className={cn(
            'block bg-white dark:bg-black rounded-2xl px-0 py-0 transition-colors duration-150 group border border-gray-100 dark:border-gray-800 hover:bg-twitter-blue/5',
            !notification.read && 'border-l-4 border-twitter-blue shadow-sm'
          )}
        >
          <div className="flex items-start gap-4 px-6 py-5">
            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-twitter-blue/10">
              <NotificationIcon type={notification.type} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] text-gray-900 dark:text-white font-medium leading-tight">
                {getNotificationContent(notification)}
              </p>
              <p className="mt-1 text-xs text-gray-400 group-hover:text-twitter-blue/80 transition-colors">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

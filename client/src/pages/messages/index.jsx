import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';
import { toast } from 'react-hot-toast';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useSocket } from '@/hooks/useSocket';
import { useTranslation } from 'react-i18next';

const MessagesPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { socket } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  // 获取私信会话列表
  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/messages/conversations');
      setConversations(response.data.conversations);
    } catch (err) {
      setError(err.message || t('fetch_messages_failed'));
      toast.error(t('fetch_messages_failed_retry'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  // 监听新消息
  useEffect(() => {
    if (socket) {
      socket.on('new_message', message => {
        // 更新会话列表，将收到新消息的会话移到顶部
        setConversations(prev => {
          const index = prev.findIndex(conv => conv._id === message.conversationId);
          if (index === -1) {
            // 如果是新会话，重新获取会话列表
            fetchConversations();
            return prev;
          }
          const updatedConversations = [...prev];
          const conversation = updatedConversations[index];
          updatedConversations.splice(index, 1);
          updatedConversations.unshift({
            ...conversation,
            lastMessage: message,
            unreadCount: conversation.unreadCount + 1,
          });
          return updatedConversations;
        });
      });
    }

    return () => {
      if (socket) {
        socket.off('new_message');
      }
    };
  }, [socket]);

  // 处理会话点击
  const handleConversationClick = conversation => {
    router.push(`/messages/${conversation._id}`);
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <EmptyState
            title={t('please_login_first')}
            description={t('login_to_view_messages')}
            action={<Button onClick={() => router.push('/login')}>{t('go_login')}</Button>}
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {/* 标题和操作栏 */}
        <div className="mb-6 bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">{t('messages')}</h1>
              <Button variant="primary" onClick={() => router.push('/messages/new')}>
                {t('start_message')}
              </Button>
            </div>
          </div>
        </div>

        <LoadingOverlay isLoading={loading}>
          {error ? (
            <ErrorState
              title={t('fetch_messages_failed')}
              description={error}
              action={<Button onClick={fetchConversations}>{t('retry')}</Button>}
            />
          ) : conversations.length === 0 ? (
            <EmptyState
              title={t('no_messages')}
              description={t('start_chat')}
              action={<Button onClick={() => router.push('/messages/new')}>{t('start_message')}</Button>}
            />
          ) : (
            <div className="space-y-2">
              {conversations.map(conversation => {
                const otherUser = conversation.participants.find(p => p._id !== user._id);
                return (
                  <div
                    key={conversation._id}
                    className="bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleConversationClick(conversation)}
                  >
                    <div className="p-4">
                      <div className="flex items-center space-x-4">
                        {/* 用户头像 */}
                        <img
                          src={otherUser.avatar}
                          alt={otherUser.username}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900 truncate">
                              {otherUser.username}
                            </h3>
                            <span className="text-sm text-gray-500">
                              {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), {
                                addSuffix: true,
                                locale: zhCN,
                              })}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-sm text-gray-600 truncate">
                              {conversation.lastMessage.content}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
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

export default MessagesPage;

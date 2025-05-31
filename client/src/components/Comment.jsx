import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Avatar } from './Avatar';
import { Button } from './ui/button';
import { Heart, MessageCircle, Reply, MoreHorizontal, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { CommentService } from '@/services/CommentService';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import ReportModal from './ReportModal';
import { useTranslation } from 'react-i18next';

export const Comment = ({ comment, onDelete, onReply }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isLiked, setIsLiked] = useState(comment.isLiked);
  const [likes, setLikes] = useState(comment.likes);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const { t } = useTranslation();

  const handleLike = async () => {
    if (!user) {
      showToast(t('please_login_first'), 'warning');
      return;
    }

    try {
      if (isLiked) {
        await CommentService.unlikeComment(comment.id);
        setLikes(prev => prev - 1);
      } else {
        await CommentService.likeComment(comment.id);
        setLikes(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      showToast(t('operation_failed_retry'), 'error');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(t('confirm_delete_comment'))) {
      return;
    }

    try {
      setIsDeleting(true);
      await CommentService.deleteComment(comment.id);
      onDelete?.(comment.id);
      showToast(t('delete_success'), 'success');
    } catch (error) {
      showToast(t('delete_failed_retry'), 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReply = () => {
    if (!user) {
      showToast(t('please_login_first'), 'warning');
      return;
    }
    onReply?.(comment.id, comment.author.username);
  };

  return (
    <div className="flex space-x-3 p-4 hover:bg-accent/50 transition-colors border-b border-border">
      <Avatar
        src={comment.author.avatar}
        alt={comment.author.username}
        size="md"
        className="flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h4 className="font-bold hover:underline cursor-pointer">
              {comment.author.username}
            </h4>
            <span className="text-muted-foreground">@{comment.author.handle}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground hover:underline cursor-pointer">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
                locale: zhCN,
              })}
            </span>
          </div>
          {user?.id === comment.author.id && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('delete')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowReport(true)}
                  className="text-gray-700 dark:text-gray-300"
                >
                  {t('report')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="mt-1 text-[15px]">{comment.content}</div>

        <div className="mt-3 flex items-center justify-between max-w-md">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={cn(
              'flex items-center space-x-1 rounded-full',
              isLiked ? 'text-red-500 hover:text-red-500 hover:bg-red-500/10' : 'text-muted-foreground hover:text-red-500 hover:bg-red-500/10'
            )}
          >
            <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
            <span>{likes}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleReply}
            className="flex items-center space-x-1 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full"
          >
            <Reply className="h-4 w-4" />
            <span>{t('reply')}</span>
          </Button>

          {comment.replies > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{comment.replies} {t('replies')}</span>
            </Button>
          )}
        </div>
      </div>

      {/* 举报弹窗 */}
      {showReport && (
        <ReportModal
          type="content"
          targetId={comment.id}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
};

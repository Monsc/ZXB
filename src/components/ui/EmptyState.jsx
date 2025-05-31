import React from 'react';
import Button from './Button';

export default function EmptyState({ message = '暂无内容', action, actionText, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="text-3xl text-accent-blue mb-2">😶</div>
      <div className="text-muted mb-4">{message}</div>
      {action && (
        <Button onClick={onAction}>{actionText || '去创建'}</Button>
      )}
    </div>
  );
} 
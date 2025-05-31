import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const mockNotifications = [
  { id: 1, content: '小明 评论了你的动态', time: '1小时前', read: false },
  { id: 2, content: '小红 关注了你', time: '2小时前', read: true },
];

export default function Notifications() {
  return (
    <div className="space-y-6 py-6">
      {mockNotifications.map(n => (
        <Card key={n.id} className={`flex items-center justify-between ${n.read ? '' : 'border-accent-blue'}`}>
          <div>
            <div className={`font-medium ${n.read ? 'text-muted' : 'text-accent-blue'}`}>{n.content}</div>
            <div className="text-xs text-muted mt-1">{n.time}</div>
          </div>
          {!n.read && <Button variant="outline">标为已读</Button>}
        </Card>
      ))}
    </div>
  );
} 
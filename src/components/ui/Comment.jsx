import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import Input from './Input';

export default function Comment({ comments = [], onSubmit }) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text) return;
    onSubmit && onSubmit(text);
    setText('');
  };

  return (
    <Card className="space-y-4">
      <div className="space-y-2">
        {comments.map((c, i) => (
          <div key={i} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-muted rounded-full" />
            <div className="flex-1">
              <div className="font-bold text-accent-blue">{c.user}</div>
              <div className="text-white">{c.text}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <Input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="写评论..."
          className="flex-1"
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <Button onClick={handleSend} disabled={!text}>
          评论
        </Button>
      </div>
    </Card>
  );
} 
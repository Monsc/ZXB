import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const mockMessages = [
  { id: 1, from: '小明', content: '你好！', time: '1小时前', self: false },
  { id: 2, from: '你', content: '你好，有什么事吗？', time: '1小时前', self: true },
];

export default function Messages() {
  const [messages, setMessages] = useState(mockMessages);
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text) return;
    setMessages([
      ...messages,
      { id: Date.now(), from: '你', content: text, time: '刚刚', self: true },
    ]);
    setText('');
  };

  return (
    <div className="space-y-6 py-6">
      <Card className="space-y-4">
        <div className="max-h-80 overflow-y-auto space-y-2">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.self ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-4 py-2 rounded-xl ${msg.self ? 'bg-accent-blue text-white' : 'bg-card text-white border border-border'}`}>
                <span>{msg.content}</span>
                <span className="ml-2 text-xs text-muted">{msg.time}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <Input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="输入消息..."
            className="flex-1"
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <Button onClick={handleSend} disabled={!text}>
            发送
          </Button>
        </div>
      </Card>
    </div>
  );
} 
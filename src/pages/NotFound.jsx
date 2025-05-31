import React from 'react';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary">
      <div className="text-6xl font-bold text-accent-blue mb-4">404</div>
      <div className="text-xl text-white mb-6">页面未找到</div>
      <Button onClick={() => navigate('/feed')}>返回首页</Button>
    </div>
  );
} 
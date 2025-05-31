import React, { useState } from 'react';
import { NotificationList } from '../components/NotificationList';
import { Bell } from 'lucide-react';

export default function Notifications() {
  const [activeTab, setActiveTab] = useState('all'); // all, mention, interact
  return (
    <div className="max-w-2xl mx-auto">
      {/* 页面标题+Tab */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-black/90 backdrop-blur border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 px-6 py-4">
          <Bell className="w-7 h-7 text-twitter-blue" />
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">通知</h1>
        </div>
        <div className="flex gap-2 px-4 pb-2">
          <button
            className={`flex-1 py-2 font-bold text-base rounded-full transition-colors ${activeTab === 'all' ? 'bg-twitter-blue/10 text-twitter-blue' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            onClick={() => setActiveTab('all')}
          >全部</button>
          <button
            className={`flex-1 py-2 font-bold text-base rounded-full transition-colors ${activeTab === 'mention' ? 'bg-twitter-blue/10 text-twitter-blue' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            onClick={() => setActiveTab('mention')}
          >提及</button>
          <button
            className={`flex-1 py-2 font-bold text-base rounded-full transition-colors ${activeTab === 'interact' ? 'bg-twitter-blue/10 text-twitter-blue' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            onClick={() => setActiveTab('interact')}
          >互动</button>
        </div>
      </div>
      {/* 通知列表 */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        <NotificationList type={activeTab} />
      </div>
    </div>
  );
} 
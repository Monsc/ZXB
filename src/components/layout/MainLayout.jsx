import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, Bell, User, MessageCircle, Settings } from 'lucide-react';

const navItems = [
  { to: '/feed', icon: Home, label: '首页' },
  { to: '/notifications', icon: Bell, label: '通知' },
  { to: '/messages', icon: MessageCircle, label: '消息' },
  { to: '/profile', icon: User, label: '我的' },
  { to: '/settings', icon: Settings, label: '设置' },
];

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-primary flex flex-col">
      {/* 顶部导航栏 */}
      <header className="w-full flex items-center justify-between px-4 py-3 border-b border-border bg-primary-light sticky top-0 z-20">
        <span className="text-xl font-bold text-accent-blue">走线吧</span>
        <nav className="hidden md:flex space-x-6">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-2 rounded-full transition-colors font-medium text-muted hover:text-accent-blue hover:bg-card ${isActive ? 'text-accent-blue bg-card' : ''}`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </header>
      {/* 主内容区 */}
      <main className="flex-1 flex justify-center px-2">
        <div className="w-full max-w-main">
          <Outlet />
        </div>
      </main>
      {/* 移动端底部导航栏 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-primary-light border-t border-border flex justify-around py-2 z-30">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center text-xs px-2 py-1 rounded-full transition-colors font-medium text-muted hover:text-accent-blue ${isActive ? 'text-accent-blue' : ''}`
            }
          >
            <item.icon className="w-6 h-6 mb-0.5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
} 
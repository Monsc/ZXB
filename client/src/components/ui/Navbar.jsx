import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import Avatar from './Avatar';
import { Button } from './button';
import { Twitter } from 'lucide-react';

const NavItem = ({ to, icon, label, active }) => (
  <Link to={to} className="block">
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center space-x-4 p-3 rounded-full ${
        active ? 'font-bold' : 'text-gray-600 dark:text-gray-300'
      } hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="hidden lg:block">{label}</span>
    </motion.div>
  </Link>
);

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { to: '/', icon: '🏠', label: '首页' },
    { to: '/explore', icon: '🔍', label: '探索' },
    { to: '/notifications', icon: '🔔', label: '通知' },
    { to: '/messages', icon: '✉️', label: '消息' },
    { to: '/bookmarks', icon: '🔖', label: '书签' },
    { to: '/lists', icon: '📋', label: '列表' },
    { to: `/profile/${user?.username}`, icon: '👤', label: '个人资料' },
    { to: '/settings', icon: '⚙️', label: '设置' },
  ];

  return (
    <nav className="fixed left-0 top-0 h-screen w-16 lg:w-72 p-2 flex flex-col justify-between border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-black z-30">
      <div className="flex items-center justify-center h-16 mb-2">
        <Link to="/" className="flex items-center justify-center w-12 h-12 rounded-full bg-twitter-blue hover:bg-twitter-blue/90 transition-colors">
          <Twitter className="w-7 h-7 text-white" />
        </Link>
      </div>
      <div className="flex-1 flex flex-col items-center lg:items-stretch gap-1">
        {navItems.map(item => (
          <Link key={item.to} to={item.to} className="block">
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.96 }}
              className={`flex items-center gap-4 px-4 py-3 rounded-full text-xl lg:text-2xl transition-all duration-150 select-none
                ${location.pathname === item.to ? 'bg-twitter-blue/10 text-twitter-blue font-bold' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}
              `}
            >
              <span className="text-2xl lg:text-3xl">{item.icon}</span>
              <span className="hidden lg:inline text-base font-medium">{item.label}</span>
            </motion.div>
          </Link>
        ))}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          className="mt-4 rounded-full bg-twitter-blue hover:bg-twitter-blue/90 text-white text-lg font-bold py-3 shadow-lg transition-all hidden lg:block"
        >
          发推
        </Button>
      </div>
      <div className="flex items-center gap-3 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-all mb-2">
        <Avatar src={user?.avatar} username={user?.username} size="sm" />
        <div className="hidden lg:block flex-1 min-w-0">
          <div className="font-bold truncate">{user?.username}</div>
          <div className="text-sm text-gray-500 truncate">@{user?.handle}</div>
        </div>
        <button
          onClick={logout}
          className="hidden lg:block text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          ⋮
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

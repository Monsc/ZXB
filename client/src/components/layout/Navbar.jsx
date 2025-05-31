import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { MagnifyingGlassIcon, BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import CreatePostButton from '../CreatePostButton';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const handleSearch = e => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-[#1da1f2]/20">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between h-14 px-4 border-b border-[#1da1f2]/20">
        <Link to="/" className="flex items-center">
          <img src="/logo192.png" alt="logo" className="h-6 w-6 mr-2" />
          <span className="text-lg font-bold text-[#1da1f2]">{t('home')}</span>
        </Link>
        <div className="flex items-center space-x-3">
          <Link to="/notifications" className="text-[#1da1f2] hover:bg-[#1da1f2]/10 rounded-full p-2 transition-colors">
            <BellIcon className="h-6 w-6" />
          </Link>
          <select onChange={e => changeLanguage(e.target.value)} value={i18n.language} className="text-[#1da1f2] bg-transparent border-none outline-none">
            <option value="zh">中文</option>
            <option value="en">English</option>
          </select>
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center text-[#1da1f2] hover:bg-[#1da1f2]/10 rounded-full p-2 transition-colors"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.username} className="h-6 w-6 rounded-full" />
              ) : (
                <UserCircleIcon className="h-6 w-6" />
              )}
            </button>
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-[#1da1f2]/20 py-1">
                <Link
                  to={`/profile/${user?.username}`}
                  className="block px-4 py-2 text-sm text-[#1da1f2] hover:bg-[#1da1f2]/10 rounded-xl"
                >
                  {t('profile')}
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-[#1da1f2] hover:bg-[#1da1f2]/10 rounded-xl"
                >
                  {t('settings')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-xl"
                >
                  {t('logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Desktop Layout */}
      <div className="hidden md:block container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logo192.png" alt="logo" className="h-8 w-8 mr-2" />
            <span className="text-xl font-bold text-[#1da1f2]">{t('home')}</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('search_placeholder')}
                className="w-full px-4 py-2 pl-10 text-sm border border-[#1da1f2]/30 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1da1f2] focus:border-transparent bg-white dark:bg-gray-900 text-[#1da1f2] placeholder:text-[#1da1f2]/60"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-[#1da1f2]/60" />
            </div>
          </form>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <Link to="/notifications" className="text-[#1da1f2] hover:bg-[#1da1f2]/10 rounded-full p-2 transition-colors">
              <BellIcon className="h-6 w-6" />
            </Link>
            <select onChange={e => changeLanguage(e.target.value)} value={i18n.language} className="text-[#1da1f2] bg-transparent border-none outline-none">
              <option value="zh">中文</option>
              <option value="en">English</option>
            </select>
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 text-[#1da1f2] hover:bg-[#1da1f2]/10 rounded-full p-2 transition-colors"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.username} className="h-8 w-8 rounded-full" />
                ) : (
                  <UserCircleIcon className="h-8 w-8" />
                )}
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-[#1da1f2]/20 py-1">
                  <Link
                    to={`/profile/${user?.username}`}
                    className="block px-4 py-2 text-sm text-[#1da1f2] hover:bg-[#1da1f2]/10 rounded-xl"
                  >
                    {t('profile')}
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-[#1da1f2] hover:bg-[#1da1f2]/10 rounded-xl"
                  >
                    {t('settings')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-xl"
                  >
                    {t('logout')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <CreatePostButton />
    </nav>
  );
};

export default Navbar;

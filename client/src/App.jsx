import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import MainLayout from './components/layout/MainLayout';
import Feed from './pages/Feed';
import Notifications from './pages/notifications/index';
import Messages from './pages/Messages';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import LoadingSpinner from './components/LoadingSpinner';

// 懒加载管理页面组件等可按需补充

// 页面切换动画包装
const AnimatedPage = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -24 }}
    transition={{ duration: 0.32, ease: 'easeInOut' }}
    className="min-h-screen"
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/feed" replace />} />
        <Route path="/feed" element={<AnimatedPage><MainLayout><Feed /></MainLayout></AnimatedPage>} />
        <Route path="/explore" element={<AnimatedPage><MainLayout><Feed /></MainLayout></AnimatedPage>} />
        <Route path="/notifications" element={<AnimatedPage><MainLayout><Notifications /></MainLayout></AnimatedPage>} />
        <Route path="/messages" element={<AnimatedPage><MainLayout><Messages /></MainLayout></AnimatedPage>} />
        <Route path="/login" element={<AnimatedPage><MainLayout><Login /></MainLayout></AnimatedPage>} />
        <Route path="/register" element={<AnimatedPage><MainLayout><Register /></MainLayout></AnimatedPage>} />
        <Route path="/profile/:username" element={<AnimatedPage><MainLayout><Profile /></MainLayout></AnimatedPage>} />
        <Route path="/settings" element={<AnimatedPage><MainLayout><Settings /></MainLayout></AnimatedPage>} />
        <Route path="*" element={<AnimatedPage><MainLayout><NotFound /></MainLayout></AnimatedPage>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <AnimatedRoutes />
  </Suspense>
);

export default App;

import React, { useEffect } from 'react';

export default function Toast({ open, message, type = 'info', duration = 2000, onClose }) {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => onClose && onClose(), duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  if (!open) return null;
  const color = type === 'error' ? 'bg-accent-red' : 'bg-accent-blue';
  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl text-white shadow-lg ${color}`}>
      {message}
    </div>
  );
} 
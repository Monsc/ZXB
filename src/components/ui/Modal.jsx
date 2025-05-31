import React from 'react';

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-card rounded-2xl p-6 w-full max-w-md shadow-lg border border-border relative">
        <button
          className="absolute top-3 right-3 text-accent-blue hover:text-accent-purple text-xl font-bold"
          onClick={onClose}
        >
          ×
        </button>
        {title && <div className="text-lg font-bold mb-4 text-accent-blue">{title}</div>}
        <div>{children}</div>
      </div>
    </div>
  );
} 
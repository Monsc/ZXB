import React from 'react';

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
  loading = false,
  ...props
}) {
  const base = 'inline-flex items-center justify-center font-medium rounded-full px-5 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-blue';
  const variants = {
    primary: 'bg-accent-blue text-white hover:bg-accent-purple',
    danger: 'bg-accent-red text-white hover:bg-accent-purple',
    outline: 'bg-transparent border border-border text-white hover:bg-card',
  };
  return (
    <button
      type={type}
      className={`${base} ${variants[variant] || ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="loader mr-2" />}
      {children}
    </button>
  );
} 
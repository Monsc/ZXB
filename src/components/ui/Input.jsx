import React from 'react';

export default function Input({
  className = '',
  error = false,
  ...props
}) {
  return (
    <input
      className={`input ${error ? 'border-accent-red focus:ring-accent-red' : ''} ${className}`}
      {...props}
    />
  );
} 
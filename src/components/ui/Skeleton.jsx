import React from 'react';

export default function Skeleton({ type = 'rect', width = '100%', height = 16, className = '' }) {
  const base = 'animate-pulse bg-primary-light';
  const style = { width, height };
  if (type === 'circle') {
    return <div className={`${base} rounded-full ${className}`} style={{ ...style, aspectRatio: '1/1' }} />;
  }
  if (type === 'text') {
    return <div className={`${base} rounded ${className}`} style={{ ...style, height: 12 }} />;
  }
  return <div className={`${base} rounded-xl ${className}`} style={style} />;
} 
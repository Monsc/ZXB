import React from 'react';
import Button from './Button';

export default function Pagination({ current, total, onChange }) {
  if (total <= 1) return null;
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <nav className="flex justify-center space-x-2 mt-4">
      {pages.map(page => (
        <Button
          key={page}
          variant={page === current ? 'primary' : 'outline'}
          className="min-w-[40px] px-0"
          onClick={() => onChange(page)}
          disabled={page === current}
        >
          {page}
        </Button>
      ))}
    </nav>
  );
} 
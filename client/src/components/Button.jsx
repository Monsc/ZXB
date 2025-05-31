import React from 'react';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
  onClick,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center px-5 py-2 border text-base font-bold rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 shadow-sm';

  const variants = {
    primary: 'border-transparent text-white bg-twitter-blue hover:bg-twitter-blue/90 focus:ring-twitter-blue',
    secondary:
      'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-twitter-blue',
    danger: 'border-transparent text-white bg-red-500 hover:bg-red-600 focus:ring-red-500',
    success: 'border-transparent text-white bg-green-500 hover:bg-green-600 focus:ring-green-500',
    warning:
      'border-transparent text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500',
  };

  const sizeStyles = {
    md: '',
    lg: 'text-lg px-7 py-3',
    sm: 'text-sm px-4 py-1',
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed';

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizeStyles[props.size || 'md'] || ''} ${disabled ? disabledStyles : ''} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

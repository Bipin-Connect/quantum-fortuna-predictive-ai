import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}

export function Button({
  variant = 'default',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variantStyles = {
    default: 'bg-gray-800 text-white hover:bg-gray-700',
    primary: 'bg-purple-600 text-white hover:bg-purple-700',
    secondary: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white',
    ghost: 'text-gray-300 hover:bg-gray-800 hover:text-white',
    link: 'text-purple-500 underline-offset-4 hover:underline',
  };
  
  const sizeStyles = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2 text-sm',
    lg: 'h-12 px-6 py-3 text-base',
  };
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
  children: React.ReactNode;
}

export function Label({ className = '', children, ...props }: LabelProps) {
  return (
    <label
      className={`text-sm font-medium text-gray-300 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}
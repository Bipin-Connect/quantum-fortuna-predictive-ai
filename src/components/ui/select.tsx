import React, { useState, useRef, useEffect } from 'react';

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  children: React.ReactNode;
  className?: string;
}

export function Select({
  value,
  onValueChange,
  disabled = false,
  placeholder = 'Select an option',
  children,
  className = '',
}: SelectProps) {
  return (
    <div className={`relative inline-block w-full ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            value,
            onValueChange,
            disabled,
            placeholder,
          });
        }
        return child;
      })}
    </div>
  );
}

interface SelectTriggerProps {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function SelectTrigger({
  value,
  placeholder = 'Select an option',
  disabled = false,
  className = '',
  children,
}: SelectTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <button
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      disabled={disabled}
      className={`flex items-center justify-between w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      <span className="text-gray-300">{value || placeholder}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
      {children}
    </button>
  );
}

interface SelectValueProps {
  placeholder?: string;
  className?: string;
}

export function SelectValue({ placeholder, className = '' }: SelectValueProps) {
  return <span className={`block truncate ${className}`}>{placeholder}</span>;
}

interface SelectContentProps {
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

export function SelectContent({
  value,
  onValueChange,
  className = '',
  children,
}: SelectContentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg ${isOpen ? 'block' : 'hidden'} ${className}`}
    >
      <ul className="py-1 max-h-60 overflow-auto">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              onSelect: (val: string) => {
                if (onValueChange) {
                  onValueChange(val);
                }
                setIsOpen(false);
              },
              isSelected: value === (child as React.ReactElement<any>).props.value,
            });
          }
          return child;
        })}
      </ul>
    </div>
  );
}

interface SelectItemProps {
  value: string;
  onSelect?: (value: string) => void;
  isSelected?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function SelectItem({
  value,
  onSelect,
  isSelected = false,
  disabled = false,
  className = '',
  children,
}: SelectItemProps) {
  return (
    <li
      onClick={() => {
        if (!disabled && onSelect) {
          onSelect(value);
        }
      }}
      className={`px-3 py-2 text-sm cursor-pointer ${isSelected ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </li>
  );
}
import React, { useState } from 'react';

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  className = '',
  children,
}: TabsProps) {
  const [selectedTab, setSelectedTab] = useState(value || defaultValue);

  const handleTabChange = (tabValue: string) => {
    if (onValueChange) {
      onValueChange(tabValue);
    } else {
      setSelectedTab(tabValue);
    }
  };

  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            selectedTab: value !== undefined ? value : selectedTab,
            onTabChange: handleTabChange,
          });
        }
        return child;
      })}
    </div>
  );
}

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
  selectedTab?: string;
  onTabChange?: (value: string) => void;
}

export function TabsList({
  className = '',
  children,
  selectedTab,
  onTabChange,
}: TabsListProps) {
  return (
    <div className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-800/50 p-1 ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            selectedTab,
            onTabChange,
          });
        }
        return child;
      })}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
  selectedTab?: string;
  onTabChange?: (value: string) => void;
  disabled?: boolean;
}

export function TabsTrigger({
  value,
  className = '',
  children,
  selectedTab,
  onTabChange,
  disabled = false,
}: TabsTriggerProps) {
  const isSelected = selectedTab === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      disabled={disabled}
      onClick={() => onTabChange && onTabChange(value)}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${isSelected ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-gray-300'} ${className}`}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
  selectedTab?: string;
}

export function TabsContent({
  value,
  className = '',
  children,
  selectedTab,
}: TabsContentProps) {
  const isSelected = selectedTab === value;

  if (!isSelected) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
    >
      {children}
    </div>
  );
}
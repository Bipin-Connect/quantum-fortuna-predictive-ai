/**
 * DashboardTableOfContents.tsx
 * Component for displaying a table of contents for the dashboard
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ChevronRight } from 'lucide-react';

interface TableOfContentsItem {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

interface DashboardTableOfContentsProps {
  items: TableOfContentsItem[];
  activeItemId?: string;
  onItemClick?: (itemId: string) => void;
}

export const DashboardTableOfContents: React.FC<DashboardTableOfContentsProps> = ({ 
  items,
  activeItemId,
  onItemClick
}) => {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Dashboard Contents</CardTitle>
        <CardDescription className="text-gray-400">
          Navigate through different sections
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {items.map((item) => (
            <div 
              key={item.id}
              className={`
                flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors
                ${activeItemId === item.id ? 'bg-purple-600/20 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-300'}
              `}
              onClick={() => onItemClick && onItemClick(item.id)}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              <div className="flex-1">
                <div className="font-medium">{item.title}</div>
                {item.description && (
                  <div className="text-xs opacity-70">{item.description}</div>
                )}
              </div>
              <ChevronRight size={16} className="opacity-70" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardTableOfContents;
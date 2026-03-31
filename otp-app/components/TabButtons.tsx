'use client';

import React from 'react';
import { TabButton } from './TabButton';

interface TabButtonsProps {
  tabs: Array<{ id: string; label: string; icon: string; color: string }>;
  activeTab: string | null;
  onTabClick: (tabId: string) => void;
}

export const TabButtons: React.FC<TabButtonsProps> = ({
  tabs,
  activeTab,
  onTabClick
}) => {
  return (
    <div className="relative border-t border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      {/* Mobile Horizontal Scroll Container */}
      <div className="overflow-x-auto scrollbar-hide p-1">
        <div className="flex gap-1.5 min-w-max">
          {tabs.map((tab) => (
            <div key={tab.id} className="w-full">
              <TabButton
                id={tab.id}
                label={tab.label}
                icon={tab.icon}
                isActive={activeTab === tab.id}
                onClick={() => onTabClick(tab.id)}
                color={tab.color}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Add fade effect on edges for mobile */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-gray-800 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-gray-800 to-transparent pointer-events-none" />
      
      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
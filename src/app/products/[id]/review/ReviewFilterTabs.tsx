import React from 'react';

interface TabInfo {
  key: 'all' | 'photos' | 'normal';
  label: string;
  count: number;
}
interface ReviewFilterTabsProps {
  tabInfo: readonly TabInfo[];
  filterTab: 'all' | 'photos' | 'normal';
  setFilterTab: (tab: 'all' | 'photos' | 'normal') => void;
  setCurrentPage: (page: number) => void;
}

export default function ReviewFilterTabs({ tabInfo, filterTab, setFilterTab, setCurrentPage }: ReviewFilterTabsProps) {
  return (
    <div className="flex justify-center my-6">
      <div className="relative flex gap-4 border border-secondary-green rounded-lg px-1 bg-transparent">
        <div
          className="absolute top-0 left-0 rounded-md bg-secondary-green transition-all duration-300"
          style={{
            width: '116px',
            height: '100%',
            transform: `translateX(${tabInfo.findIndex(t => t.key === filterTab) * 112}px)`,
            zIndex: 0,
          }}
        />
        {tabInfo.map(({ key, label, count }) => {
          const isActive = filterTab === key;
          return (
            <button
              key={key}
              onClick={() => {
                setFilterTab(key);
                setCurrentPage(1);
              }}
              className={`relative z-10 w-[100px] py-2 px-2 flex flex-col items-center justify-center text-sm transition-colors duration-300 ${isActive ? 'text-white' : 'text-black'} cursor-pointer`}
            >
              <span className="leading-none text-xs mb-1">{label}</span>
              <span className="text-xs leading-none">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
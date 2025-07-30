'use client';

import { useState, useRef, useEffect } from 'react';

export type ReviewSortOption = 'latest' | 'oldest' | 'ratingHigh' | 'ratingLow';

interface ReviewSortDropdownProps {
  selected: ReviewSortOption;
  onChange: (option: ReviewSortOption) => void;
}

const sortOptions: { value: ReviewSortOption; label: string }[] = [
  { value: 'latest', label: '최신순' },
  { value: 'oldest', label: '오래된순' },
  { value: 'ratingHigh', label: '별점 높은순' },
  { value: 'ratingLow', label: '별점 낮은순' },
];

export default function ReviewSortDropdown({ selected, onChange }: ReviewSortDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    setOpen(prev => !prev);
  };

  const handleSelect = (option: ReviewSortOption) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef} style={{ minWidth: '120px' }}>
      <button type="button" aria-haspopup="listbox" aria-expanded={open} onClick={handleToggle} className="inline-flex items-center justify-between px-4 py-2 border text-xs border-secondary-green rounded bg-transparent min-w-[120px]">
        <span>{sortOptions.find(opt => opt.value === selected)?.label || '정렬 선택'}</span>
        <span className="ml-2 relative -top-0.4 text-secondary-green">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <ul role="listbox" tabIndex={-1} className="absolute mt-1 bg-white border border-secondary-green rounded z-10 text-xs max-h-60 overflow-auto" style={{ minWidth: '120px' }}>
          {sortOptions.map(option => (
            <li
              key={option.value}
              role="option"
              aria-selected={selected === option.value}
              tabIndex={0}
              onClick={() => handleSelect(option.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleSelect(option.value);
                }
              }}
              className={`
                cursor-pointer
                px-4 py-2
                transition-colors duration-200
                ${selected === option.value ? 'bg-white font-semibold' : 'bg-transparent'}
                hover:bg-[rgba(108,140,83,0.2)]
              `}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { CHARACTER_CATEGORIES, STATIONERY_CATEGORIES, LIVING_CATEGORIES, CATEGORY_MAP } from '@/constants/categories';

const CATEGORY_DETAIL_MAP: Record<string, string[]> = {
  PC01: CHARACTER_CATEGORIES,
  PC03: STATIONERY_CATEGORIES,
  PC04: LIVING_CATEGORIES,
};

const MAIN_CATEGORIES = Object.entries(CATEGORY_MAP).filter(([code]) => ['PC01', 'PC02', 'PC03', 'PC04', 'new', 'popular'].includes(code));

interface CategorySelectorProps {
  initialMain?: string;
  initialSub?: string;
  onChange: (main: string, sub: string) => void;
}

export default function CategorySelector({ initialMain, initialSub, onChange }: CategorySelectorProps) {
  const [main, setMain] = useState(initialMain || 'PC01');
  const [sub, setSub] = useState(initialSub || '');

  // main 초기화
  useEffect(() => {
    setMain(initialMain || 'PC01');
  }, [initialMain]);

  // main 변경 시 서브 카테고리 기본값 설정
  useEffect(() => {
    const firstSub = CATEGORY_DETAIL_MAP[main]?.[0] || '';
    setSub(firstSub);
  }, [main]);

  // sub가 바뀐 후에만 onChange 호출
  useEffect(() => {
    if (sub) {
      onChange(main, sub);
    }
  }, [sub]); // <-- sub만 의존성에 넣어야 최신 sub 값 기준으로 호출됨

  return (
    <div className="flex gap-3">
      <select value={main} onChange={e => setMain(e.target.value)} className="flex-1 border-2 border-gray-200 px-4 py-3 rounded-xl bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300">
        {MAIN_CATEGORIES.map(([code, info]) => (
          <option key={code} value={code}>
            {info.label}
          </option>
        ))}
      </select>

      <select value={sub} onChange={e => setSub(e.target.value)} className="flex-1 border-2 border-gray-200 px-4 py-3 rounded-xl bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300">
        {(CATEGORY_DETAIL_MAP[main] || []).map(subCat => (
          <option key={subCat} value={subCat}>
            {subCat}
          </option>
        ))}
      </select>
    </div>
  );
}

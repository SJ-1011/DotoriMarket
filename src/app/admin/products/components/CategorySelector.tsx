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
  useEffect(() => {
    setMain(initialMain || 'PC01');
  }, [initialMain]);

  useEffect(() => {
    if (initialSub) {
      setSub(initialSub);
    } else {
      const firstSub = CATEGORY_DETAIL_MAP[main]?.[0] || '';
      setSub(firstSub);
    }
  }, [initialSub]);

  useEffect(() => {
    const firstSub = CATEGORY_DETAIL_MAP[main]?.[0] || '';
    if (!CATEGORY_DETAIL_MAP[main]?.includes(sub)) {
      setSub(firstSub);
    }
  }, [main]);

  // sub가 변경될 때만 부모에 알림
  useEffect(() => {
    if (sub) {
      onChange(main, sub);
    }
  }, [sub, main]);

  return (
    <div className="flex gap-2 items-center">
      <select value={main} onChange={e => setMain(e.target.value)} className="border px-2 py-1 rounded">
        {MAIN_CATEGORIES.map(([code, info]) => (
          <option key={code} value={code}>
            {info.label}
          </option>
        ))}
      </select>

      <select value={sub} onChange={e => setSub(e.target.value)} className="border px-2 py-1 rounded">
        {(CATEGORY_DETAIL_MAP[main] || []).map(subCat => (
          <option key={subCat} value={subCat}>
            {subCat}
          </option>
        ))}
      </select>
    </div>
  );
}

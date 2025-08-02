'use client';

import { useState, useEffect } from 'react';
import { CHARACTER_CATEGORIES, STATIONERY_CATEGORIES, LIVING_CATEGORIES, CATEGORY_MAP } from '@/constants/categories';

const CATEGORY_DETAIL_MAP: Record<string, string[]> = {
  PC01: CHARACTER_CATEGORIES,
  PC03: STATIONERY_CATEGORIES,
  PC04: LIVING_CATEGORIES,
};

const MAIN_CATEGORIES = Object.entries(CATEGORY_MAP).filter(([code]) => ['PC01', 'PC03', 'PC04', 'new', 'popular'].includes(code));

export default function CategorySelector({ initialMain, initialSub, onChange }: { initialMain?: string; initialSub?: string; onChange: (main: string, sub: string) => void }) {
  const [main, setMain] = useState(initialMain || 'PC01');
  const [sub, setSub] = useState(initialSub || CATEGORY_DETAIL_MAP[initialMain || 'PC01'][0]);

  useEffect(() => {
    const newSub = CATEGORY_DETAIL_MAP[main]?.[0] ?? '';
    setSub(newSub);
  }, [main]);

  useEffect(() => {
    onChange(main, sub);
  }, [main, sub]);

  return (
    <div className="flex gap-2 items-center">
      {/* 대카테고리 선택 */}
      <select
        value={main}
        onChange={e => {
          setMain(e.target.value);
        }}
        className="border px-2 py-1 rounded"
      >
        {MAIN_CATEGORIES.map(([code, info]) => (
          <option key={code} value={code}>
            {info.label}
          </option>
        ))}
      </select>

      {/* 소카테고리 선택 */}
      <select
        value={sub}
        onChange={e => {
          setSub(e.target.value);
        }}
        className="border px-2 py-1 rounded"
      >
        {CATEGORY_DETAIL_MAP[main]?.map(subCat => (
          <option key={subCat} value={subCat}>
            {subCat}
          </option>
        ))}
      </select>
    </div>
  );
}

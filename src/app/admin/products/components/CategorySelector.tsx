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
  const [sub, setSub] = useState(initialSub || '');

  // 초기값에서 sub가 없는 경우, main 카테고리의 첫 번째 소카테고리로 설정
  useEffect(() => {
    if (!initialSub && CATEGORY_DETAIL_MAP[main]?.length > 0) {
      setSub(CATEGORY_DETAIL_MAP[main][0]);
    }
  }, [initialSub, main]);

  // main 변경 시 sub도 해당하는 첫 번째 소카테고리로 변경
  useEffect(() => {
    const defaultSub = CATEGORY_DETAIL_MAP[main]?.[0] || '';
    if (!CATEGORY_DETAIL_MAP[main]?.includes(sub)) {
      setSub(defaultSub);
    }
  }, [main]);

  useEffect(() => {
    if (main && sub) {
      onChange(main, sub);
    }
  }, [main, sub, onChange]);

  return (
    <div className="flex gap-2 items-center">
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

      <select
        value={sub}
        onChange={e => {
          setSub(e.target.value);
        }}
        className="border px-2 py-1 rounded"
      >
        {(CATEGORY_DETAIL_MAP[main] || []).map(subCat => (
          <option key={subCat} value={subCat}>
            {subCat}
          </option>
        ))}
      </select>
    </div>
  );
}

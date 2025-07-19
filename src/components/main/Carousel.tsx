// Carousel.tsx
'use client';
import { useEffect, useRef, useState } from 'react';

const banners = [
  { title: '도토리샵 여름 기획전', bg: 'bg-red-200' },
  { title: '도토리 캐릭터 컬렉션', bg: 'bg-green-200' },
  { title: '이달의 리뷰왕', bg: 'bg-yellow-200' },
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoSlide = () => {
    intervalRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % banners.length);
    }, 3000);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetAutoSlide = () => {
    stopAutoSlide();
    startAutoSlide();
  };

  const goToSlide = (index: number) => {
    setCurrent(index);
    resetAutoSlide(); // 수동 조작 시 자동 슬라이드 리셋
  };

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  return (
    <div className="relative w-full h-48 overflow-hidden rounded-2xl">
      <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${current * 100}%)` }}>
        {banners.map((banner, idx) => (
          <div key={idx} className={`w-full flex-shrink-0 h-48 flex items-center justify-center text-xl font-bold ${banner.bg}`}>
            {banner.title}
          </div>
        ))}
      </div>

      {/* 왼쪽 화살표 */}
      <button onClick={() => goToSlide((current - 1 + banners.length) % banners.length)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow">
        ◀
      </button>

      {/* 오른쪽 화살표 */}
      <button onClick={() => goToSlide((current + 1) % banners.length)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow">
        ▶
      </button>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface Product {
  id: number;
  image: string;
  name: string;
}

const mockProducts: Product[] = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  image: `/images/product${(i % 5) + 1}.jpg`,
  name: `상품 ${i + 1}`,
}));

export default function ProductGrid() {
  const [showAll, setShowAll] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current || showAll || isDragging) return; // isDragging 체크

    let rafId: number;
    const speed = 0.5;

    const step = () => {
      if (!scrollRef.current) return;
      if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth - scrollRef.current.clientWidth) {
        scrollRef.current.scrollLeft = 0;
      } else {
        scrollRef.current.scrollLeft += speed;
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [showAll, isDragging]); // isDragging 의존성 추가

  // 드래그 관련 핸들러
  const isTouching = useRef(false);
  const lastX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    isTouching.current = true;
    lastX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isTouching.current || !scrollRef.current) return;
    const dx = lastX.current - e.touches[0].clientX;
    scrollRef.current.scrollLeft += dx;
    lastX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    isTouching.current = false;
  };

  // 마우스 드래그도 지원 (PC에서 테스트용)
  const isMouseDown = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    isMouseDown.current = true;
    lastX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown.current || !scrollRef.current) return;
    const dx = lastX.current - e.clientX;
    scrollRef.current.scrollLeft += dx;
    lastX.current = e.clientX;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    isMouseDown.current = false;
  };

  return (
    <section className="my-8 px-4">
      {/* 제목 + 전체 보기 버튼 (lg 미만에서만) */}
      <div className="flex justify-between items-center mb-4 lg:mb-4">
        <h2 className="text-xl font-semibold">추천 상품</h2>
        <button onClick={() => setShowAll(!showAll)} className="text-sm text-gray-600 lg:hidden">
          {showAll ? '간략 보기' : '전체 보기'}
        </button>
      </div>

      {/* lg 미만: 자동 스크롤 리스트 + 드래그 */}
      {!showAll && (
        <div ref={scrollRef} className="lg:hidden flex gap-4 overflow-x-hidden whitespace-nowrap select-none" style={{ cursor: isDragging ? 'grabbing' : 'grab' }} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
          {mockProducts.map(product => (
            <div key={product.id} className="inline-block w-[160px] h-[160px] bg-gray-200 rounded-lg relative overflow-hidden flex-shrink-0">
              <Image src={product.image} alt={product.name} fill className="object-cover" sizes="160px" />
            </div>
          ))}
        </div>
      )}

      {/* lg 미만: 전체 보기 상태일 때 그리드 3열 */}
      {showAll && (
        <div className="lg:hidden grid grid-cols-3 gap-4">
          {mockProducts.map(product => (
            <div key={product.id} className="aspect-square bg-gray-200 rounded-lg relative overflow-hidden">
              <Image src={product.image} alt={product.name} fill className="object-cover" sizes="160px" />
            </div>
          ))}
        </div>
      )}

      {/* lg 이상: 데스크탑용 그리드 4열 */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-4">
        {mockProducts.map(product => (
          <div key={product.id} className="aspect-square bg-gray-100 rounded-lg relative overflow-hidden">
            <Image src={product.image} alt={product.name} fill className="object-cover rounded-lg" sizes="(min-width: 1024px) 25vw, 100vw" />
          </div>
        ))}
      </div>
    </section>
  );
}

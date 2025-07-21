'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface Product {
  id: number;
  image: string;
  name: string;
}

const characterImagePaths = [
  { image: '/character/ghibli.png', name: '지브리' },
  { image: '/character/disney-pixar.png', name: '디즈니/픽사' },
  { image: '/character/sanrio.png', name: '산리오' },
  { image: '/character/miffy.png', name: '미피' },
  { image: '/character/pingu.png', name: '핑구' },
  { image: '/character/shinchang.png', name: '짱구' },
  { image: '/character/chiikawa.png', name: '치이카와' },
  { image: '/character/snoopy.png', name: '스누피' },
];

const mockProducts: Product[] = characterImagePaths.map((product, i) => ({
  id: i,
  image: product.image,
  name: product.name,
}));

export default function ProductGrid() {
  const [showAll, setShowAll] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current || showAll || isDragging) return;

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
  }, [showAll, isDragging]);

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
      {/* 640 이하에서만 전체보기 버튼 */}
      <div className="flex justify-end mb-4 sm:hidden">
        <button onClick={() => setShowAll(!showAll)} className="text-sm text-gray-600">
          {showAll ? '간략 보기' : '전체 보기'}
        </button>
      </div>

      {/* 640 이하 자동 스크롤 + 드래그 */}
      {!showAll && (
        <div ref={scrollRef} className="sm:hidden flex gap-4 overflow-x-hidden whitespace-nowrap select-none" style={{ cursor: isDragging ? 'grabbing' : 'grab' }} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
          {mockProducts.map(product => (
            <div key={product.id} className="inline-flex flex-col items-center w-[160px] flex-shrink-0 select-none">
              <div className="relative w-[160px] h-[160px] rounded-lg overflow-hidden bg-gray-200">
                <Image src={product.image} alt={product.name} fill className="object-cover" sizes="160px" />
              </div>
              <p className="mt-2 text-center text-sm font-medium">{product.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* 640 이하: showAll일 때 3열 그리드 */}
      {showAll && (
        <div className="grid sm:hidden grid-cols-3 gap-4">
          {mockProducts.map(product => (
            <div key={product.id} className="flex flex-col items-center w-full select-none">
              <div className="relative w-full pb-[100%] overflow-hidden bg-gray-200">
                <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(max-width: 640px) 33vw" />
              </div>
              <p className="mt-2 text-center text-sm font-bold">{product.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* 640 이상 ~ 1024 미만 */}
      <div className="hidden sm:grid lg:hidden grid-cols-3 gap-4">
        {mockProducts.map(product => (
          <div key={product.id} className="flex flex-col items-center w-full select-none">
            <div className="relative w-full pb-[100%] overflow-hidden bg-gray-200">
              <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(min-width: 640px) and (max-width: 1023px) 33vw" />
            </div>
            <p className="mt-2 text-center text-sm font-bold">{product.name}</p>
          </div>
        ))}
      </div>

      {/* 1024 이상: 4열 그리드 */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-4">
        {mockProducts.map(product => (
          <div key={product.id} className="flex flex-col items-center w-full select-none">
            <div className="relative w-full pb-[100%]  overflow-hidden bg-gray-100">
              <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(min-width: 1024px) 25vw" />
            </div>
            <p className="mt-2 text-center text-sm font-bold">{product.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

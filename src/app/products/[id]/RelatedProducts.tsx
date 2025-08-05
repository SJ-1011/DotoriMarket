'use client';

import { useEffect, useState, useRef } from 'react';
import type { Product } from '@/types/Product';
import ProductCard from '@/components/common/ProductCard';
import { getProductsCategory } from '@/utils/getProducts';

interface RelatedProductsProps {
  currentProductId: number;
  categoryCode: string;
}

const categoryMap: Record<string, string> = {
  PC01: 'character',
  PC02: 'miniature',
  PC03: 'stationery',
  PC04: 'living-accessories',
};

export default function RelatedProducts({ currentProductId, categoryCode }: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    async function fetchRelatedProducts() {
      const mapped = categoryMap[categoryCode];
      if (!mapped) return;

      const res = await getProductsCategory(mapped);
      if (!res.ok || !Array.isArray(res.item)) return;

      const others = res.item.filter(p => Number(p._id) !== currentProductId && p.active === true);
      const shuffled = others.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 8);

      setRelatedProducts(selected);
    }

    fetchRelatedProducts();
  }, [currentProductId, categoryCode]);

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (scrollRef.current) {
      setStartX(e.pageX - scrollRef.current.offsetLeft);
      setScrollLeft(scrollRef.current.scrollLeft);
    }
  };

  const onMouseLeave = () => setIsDragging(false);
  const onMouseUp = () => setIsDragging(false);

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  if (relatedProducts.length === 0) return null;

  return (
    <div className="bg-background pt-8 px-8 pb-12">
      <h2 className="text-lg font-semibold mb-4">이런 상품도 있어요</h2>
      <div ref={scrollRef} className="overflow-x-auto scrollbar-hide -mx-2 px-2 cursor-grab" onMouseDown={onMouseDown} onMouseLeave={onMouseLeave} onMouseUp={onMouseUp} onMouseMove={onMouseMove} style={{ userSelect: isDragging ? 'none' : 'auto' }}>
        <div className="flex gap-3">
          {relatedProducts.map(product => (
            <div key={product._id} className="min-w-[140px] max-w-[160px] w-full sm:min-w-[160px] sm:max-w-[180px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

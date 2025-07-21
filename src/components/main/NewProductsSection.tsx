'use client';

import { useEffect, useState } from 'react';
import ProductGrid from '@/components/common/ProductGrid';
import ProductCard from '@/components/common/ProductCard';
import ProductCardSkeleton from '@/components/common/ProductCardSkeleton';
import { Product } from '@/types/Product';
import { getProducts } from '@/utils/getProducts';

const ROW_COUNT = 3; // 항상 3행씩 보여주기

export default function NewProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [columns, setColumns] = useState(4); // 초기값은 4열 PC 기준
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth < 1024) {
        setColumns(3);
      } else {
        setColumns(4);
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await getProducts();
        if (res.ok === 1 && Array.isArray(res.item)) {
          const newProducts = res.item.filter((product: Product) => product.extra?.isNew);
          setProducts(newProducts);
        } else {
          console.error('상품 데이터 구조가 예상과 다릅니다:', res);
        }
      } catch (error) {
        console.error('신상품 데이터 로드 실패', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    // 열 수가 바뀌면 다시 보이는 개수도 업데이트
    setVisibleCount(columns * ROW_COUNT);
  }, [columns]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + columns * ROW_COUNT);
  };

  const isAllLoaded = visibleCount >= products.length;

  if (loading) {
    return (
      <section className="my-8">
        <ProductGrid>
          {Array.from({ length: columns * ROW_COUNT }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </ProductGrid>
      </section>
    );
  }

  return (
    <section className="my-8">
      <ProductGrid>
        {products.slice(0, visibleCount).map((product: Product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </ProductGrid>

      {!isAllLoaded && (
        <div className="mt-4 flex justify-center">
          <button onClick={handleLoadMore} className="px-16 py-4 my-4 text-sm font-semibold bg-white border border-gray-300 rounded hover:bg-gray-100">
            상품 더 불러오기
          </button>
        </div>
      )}
    </section>
  );
}

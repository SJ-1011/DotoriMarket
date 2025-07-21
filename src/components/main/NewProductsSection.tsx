'use client';

import { useEffect, useState } from 'react';
import ProductGrid from '@/components/common/ProductGrid';
import ProductCard from '@/components/common/ProductCard';
import ProductCardSkeleton from '@/components/common/ProductCardSkeleton';
import { Product } from '@/types/Product';
import { getProducts } from '@/utils/getProducts';

export default function NewProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await getProducts();

        if (res.ok === 1 && Array.isArray(res.item)) {
          const allProducts = res.item;
          const newProducts = allProducts.filter((product: Product) => product.extra?.isNew);

          console.log('전체 상품 수:', allProducts.length);
          console.log('isNew 상품 수:', newProducts.length);

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

  if (loading) {
    return (
      <section className="my-8">
        <ProductGrid>
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </ProductGrid>
      </section>
    );
  }

  return (
    <section className="my-8">
      <ProductGrid>
        {products.map((product: Product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </ProductGrid>
    </section>
  );
}

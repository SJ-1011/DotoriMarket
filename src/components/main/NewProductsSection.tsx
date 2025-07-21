'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductGrid from '@/components/common/ProductGrid';
import ProductCard from '@/components/common/ProductCard';
import { Product } from '@/types/Product';
import ProductCardSkeleton from '@/components/common/ProductCardSkeleton';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;

export default function NewProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get<{ item: Product[] }>(`${API_URL}/products`, {
          headers: { 'Client-Id': CLIENT_ID || '' },
        });

        const allProducts = res.data.item ?? [];
        const newProducts = allProducts.filter(product => product.extra?.isNew);

        console.log('전체 상품 수:', allProducts.length);
        console.log('isNew 상품 수:', newProducts.length);

        setProducts(newProducts);
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
      <section>
        <ProductGrid>
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </ProductGrid>
      </section>
    );
  }

  return (
    <section>
      <ProductGrid>
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </ProductGrid>
    </section>
  );
}

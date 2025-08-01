'use client';

import { useEffect, useState } from 'react';
import ProductItemCard from '@/components/common/ProductItemCard';
import ProductCardSkeleton from '@/components/common/ProductCardSkeleton';
import { Product } from '@/types/Product';
import { getProductsCategory, getLikedProducts } from '@/utils/getProducts';
import { useLoginStore } from '@/stores/loginStore';

const ROW_COUNT = 3;

interface LikedProduct extends Product {
  bookmarkId: number;
}

export default function NewProductsSection() {
  const user = useLoginStore(state => state.user);
  const accessToken = user?.token?.accessToken;

  const [products, setProducts] = useState<Product[]>([]);
  const [likedProducts, setLikedProducts] = useState<LikedProduct[]>([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [columns, setColumns] = useState(4);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth < 1024) setColumns(3);
      else setColumns(4);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        const resProducts = await getProductsCategory('new');
        if (resProducts.ok === 1 && Array.isArray(resProducts.item)) {
          setProducts(resProducts.item);
        } else {
          console.error('상품 데이터 이상:', resProducts);
        }

        if (accessToken) {
          const resLiked = await getLikedProducts(accessToken);
          if (!resLiked.ok) {
            throw resLiked.message;
          }

          const items = resLiked.item as unknown as { _id: number; product: Product }[];

          const liked = items.map(v => ({
            ...v.product,
            bookmarkId: v._id,
          }));

          setLikedProducts(liked);
        } else {
          setLikedProducts([]);
        }
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [accessToken]);

  // 북마크 상태 변경 감지 → likedProducts 다시 불러오기
  useEffect(() => {
    const handleBookmarkChange = async () => {
      if (!accessToken) return;
      try {
        const resLiked = await getLikedProducts(accessToken);
        const liked = Object.values(resLiked)
          .filter((v): v is { _id: number; product: Product } => typeof v === 'object' && v !== null && 'product' in v && '_id' in v)
          .map(v => ({
            ...v.product,
            bookmarkId: v._id,
          }));
        setLikedProducts(liked);
      } catch (error) {
        console.error('liked products 재로드 실패:', error);
      }
    };

    window.addEventListener('bookmarkChanged', handleBookmarkChange);
    return () => window.removeEventListener('bookmarkChanged', handleBookmarkChange);
  }, [accessToken]);

  useEffect(() => {
    setVisibleCount(columns * ROW_COUNT);
  }, [columns]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + columns * ROW_COUNT);
  };

  const isAllLoaded = visibleCount >= products.length;

  if (loading) {
    return (
      <section className="my-8">
        <div className={`grid grid-cols-${columns} gap-4`}>
          {Array.from({ length: columns * ROW_COUNT }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="my-8">
      <div className={`grid grid-cols-${columns} gap-4`}>
        <ProductItemCard products={products.slice(0, visibleCount)} likedProducts={likedProducts} />
      </div>

      {!isAllLoaded && (
        <div className="mt-4 flex justify-center">
          <button onClick={handleLoadMore} className="px-10 py-3 mb-8 mt-4 text-sm font-medium border cursor-pointer border-gray-300 rounded-sm">
            상품 더보기
          </button>
        </div>
      )}
    </section>
  );
}

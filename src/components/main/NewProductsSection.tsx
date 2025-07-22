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
  // 북마크 상태가 변경되었을 때 리렌더링을 강제하기 위한 키
  const [refreshKey, setRefreshKey] = useState(0);

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
    console.log('=== useEffect: accessToken changed ===');
    console.log('accessToken:', accessToken);

    async function fetchData() {
      setLoading(true);

      try {
        const resProducts = await getProductsCategory('new');
        console.log('getProductsCategory("new") 응답:', resProducts);
        if (resProducts.ok === 1 && Array.isArray(resProducts.item)) {
          setProducts(resProducts.item);
        } else {
          console.error('상품 데이터 이상:', resProducts);
        }

        if (accessToken) {
          const resLiked = await getLikedProducts(accessToken);
          console.log('getLikedProducts 응답:', resLiked);

          const liked = Object.values(resLiked)
            .filter((v): v is { _id: number; product: Product } => typeof v === 'object' && v !== null && 'product' in v && '_id' in v)
            .map(v => ({
              ...v.product,
              bookmarkId: v._id,
            }));

          console.log('가공된 likedProducts:', liked);
          setLikedProducts(liked);
        } else {
          console.log('accessToken 없음으로 likedProducts 초기화');
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

  // 북마크 상태 변경을 감지하여 liked products를 다시 불러오는 useEffect
  useEffect(() => {
    if (!accessToken || refreshKey === 0) return;

    console.log('=== 북마크 상태 변경 감지, liked products 재로드 ===');

    const refetchLikedProducts = async () => {
      try {
        const resLiked = await getLikedProducts(accessToken);
        console.log('북마크 변경 후 getLikedProducts 응답:', resLiked);

        const liked = Object.values(resLiked)
          .filter((v): v is { _id: number; product: Product } => typeof v === 'object' && v !== null && 'product' in v && '_id' in v)
          .map(v => ({
            ...v.product,
            bookmarkId: v._id,
          }));

        console.log('북마크 변경 후 가공된 likedProducts:', liked);
        setLikedProducts(liked);
      } catch (error) {
        console.error('liked products 재로드 실패:', error);
      }
    };

    // 약간의 지연을 두어 API 호출이 완료된 후 상태를 업데이트
    const timeoutId = setTimeout(refetchLikedProducts, 300);

    return () => clearTimeout(timeoutId);
  }, [refreshKey, accessToken]);

  useEffect(() => {
    console.log('columns 변경:', columns);
    setVisibleCount(columns * ROW_COUNT);
  }, [columns]);

  // 전역적으로 북마크 상태가 변경되었을 때 호출할 함수
  useEffect(() => {
    const handleBookmarkChange = () => {
      console.log('북마크 변경 이벤트 감지');
      setRefreshKey(prev => prev + 1);
    };

    // 커스텀 이벤트 리스너 등록
    window.addEventListener('bookmarkChanged', handleBookmarkChange);

    return () => {
      window.removeEventListener('bookmarkChanged', handleBookmarkChange);
    };
  }, []);

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

  console.log('렌더링 시 likedProducts 상태:', likedProducts);
  console.log('렌더링 시 products 상태:', products);

  return (
    <section className="my-8">
      <div className={`grid grid-cols-${columns} gap-4`}>
        {/* refreshKey를 key로 사용하여 북마크 상태 변경 시 강제 리렌더링 */}
        <ProductItemCard key={refreshKey} products={products.slice(0, visibleCount)} likedProducts={likedProducts} />
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

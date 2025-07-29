'use client';

import { useEffect, useState } from 'react';
import { useLoginStore } from '@/stores/loginStore';
import { getLikedProducts } from '@/utils/getProducts';
import ProductCard from './ProductCard';
import type { Product } from '@/types/Product';
import Loading from '@/app/loading';

interface LikedProduct extends Product {
  bookmarkId: number;
}

export default function WishList() {
  const user = useLoginStore(state => state.user);
  const [likedProducts, setLikedProducts] = useState<LikedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('date');

  useEffect(() => {
    if (!user?.token?.accessToken) return;

    try {
      setLoading(true);
      const fetchLiked = async () => {
        const res = await getLikedProducts(user.token.accessToken);

        console.log(res);

        if (!res.ok) {
          throw res.message;
        }

        const items = res.item as unknown as { _id: number; product: Product }[];

        const products = items.map(v => ({
          ...v.product,
          bookmarkId: v._id,
        }));

        console.log(products);

        setLikedProducts(products);
      };

      fetchLiked();
    } catch (error) {
      alert(error);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const sortedProducts = [...likedProducts].sort((a, b) => {
    if (sortOption === 'priceLow') return a.price - b.price;
    if (sortOption === 'priceHigh') return b.price - a.price;
    if (sortOption === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return 0;
  });

  return (
    <section className="text-xs sm:text-sm lg:text-base bg-white min-h-[700px] py-12">
      <div className="space-y-4 sm:w-[600px] lg:w-[800px] mx-auto">
        {/* 타이틀 */}
        <div className="mb-2 px-4 sm:mb-4 lg:mb-4 flex flex-row flex-nowrap items-center justify-between">
          <h2 className="font-bold text-base sm:text-lg lg:text-xl text-primary">관심 상품</h2>
          <select className="py-1 rounded text-xs sm:text-sm lg:text-base" value={sortOption} onChange={e => setSortOption(e.target.value)}>
            <option value="priceLow">가격 낮은순</option>
            <option value="priceHigh">가격 높은순</option>
            <option value="date">담은 날짜순</option>
          </select>
        </div>
        {loading && <Loading />}
        {!loading && sortedProducts.length > 0 ? (
          <ul className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {sortedProducts.map(product => (
              <ProductCard key={product._id} product={product} bookmarkId={product.bookmarkId} />
            ))}
          </ul>
        ) : (
          <div className="p-4">관심 상품이 없습니다.</div>
        )}
      </div>
    </section>
  );
}

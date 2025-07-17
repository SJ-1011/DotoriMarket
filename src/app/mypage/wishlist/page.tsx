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

  useEffect(() => {
    if (!user?.token?.accessToken) return;

    const fetchLiked = async () => {
      setLoading(true);
      try {
        const res = await getLikedProducts(user.token.accessToken);
        const products = Object.values(res)
          .filter((v): v is { _id: number; product: Product } => typeof v === 'object' && v !== null && 'product' in v && '_id' in v)
          .map(v => ({
            ...v.product,
            bookmarkId: v._id,
          }));

        setLikedProducts(products);
      } finally {
        setLoading(false);
      }
    };

    fetchLiked();
  }, [user]);

  return (
    <div className="w-full p-2 sm:p-4 mt-4">
      <div className="mb-2 sm:mb-4 lg:mb-8">
        <h2 className="font-bold text-base sm:text-lg lg:text-xl">관심 상품</h2>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <ul className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4">
          {likedProducts.map(product => (
            <ProductCard key={product._id} product={product} bookmarkId={product.bookmarkId} />
          ))}
        </ul>
      )}
    </div>
  );
}

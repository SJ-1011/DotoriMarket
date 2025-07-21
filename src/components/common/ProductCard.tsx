'use client';

import { Product } from '@/types/Product';
import Image from 'next/image';
import Link from 'next/link';
import Favorite from '../icon/FavoriteIcon';
import FavoriteBorder from '../icon/FavoriteBorderIcon';
import { useState } from 'react';
import { useLoginStore } from '@/stores/loginStore';
import { deleteBookmark } from '@/data/actions/deleteBookmark';
import { addBookmark } from '@/data/actions/addBookmark';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProductCard({ product, bookmarkId: initialBookmarkId }: { product: Product; bookmarkId?: number }) {
  const user = useLoginStore(state => state.user);
  const [isLiked, setIsLiked] = useState(!!initialBookmarkId);
  const [bookmarkId, setBookmarkId] = useState(initialBookmarkId);

  const handleLikeToggle = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user?.token?.accessToken) {
      alert('로그인이 필요합니다!');
      return;
    }

    try {
      if (isLiked) {
        setIsLiked(false);
        await deleteBookmark(bookmarkId!, user.token.accessToken);
        setBookmarkId(0);
      } else {
        const res = await addBookmark(Number(product._id), 'product', user.token.accessToken);
        if (res.ok) {
          setBookmarkId(res.item._id);
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }
      }
    } catch (error) {
      console.error('북마크 토글 실패', error);
      setIsLiked(!isLiked);
    }
  };
  return (
    <Link href="/">
      <div className="relative w-full aspect-square">
        <Image src={`${API_URL}/${product.mainImages[0]?.path}`} alt={product.name} width={238} height={238}></Image>
        <button type="button" className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow hover:scale-110 active:scale-95 transition-transform" onClick={handleLikeToggle}>
          {isLiked ? <Favorite svgProps={{ className: 'w-4 h-4 sm:w-3 sm:h-3 text-red' }} /> : <FavoriteBorder svgProps={{ className: 'w-4 h-4 sm:w-3 sm:h-3 text-gray' }} />}
        </button>
      </div>
      <p>{product.name}</p>
      <p>{product.price.toLocaleString()}원</p>
      {/* TODO 상품 수량이 얼마 안남았으면 가격 밑에 쓰기 */}
      {/* TODO 상품이 매진됐으면 가격 밑에 쓰기 */}
      {/* 대충 이런 로직... */}
      {product.quantity === product.buyQuantity && <div>품절</div>}
      <div>SOLD OUT</div>
    </Link>
  );
}

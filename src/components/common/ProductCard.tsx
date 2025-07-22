'use client';

import { Product } from '@/types/Product';
import Image from 'next/image';
import Link from 'next/link';
import Favorite from '../icon/FavoriteIcon';
import FavoriteBorder from '../icon/FavoriteBorderIcon';
import { useLoginStore } from '@/stores/loginStore';
import { useToggleBookmark } from '@/hooks/useToggleBookmark';
import { useRemainingStock } from '@/hooks/useRemainingStock';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProductCard({ product, bookmarkId: initialBookmarkId }: { product: Product; bookmarkId?: number }) {
  const user = useLoginStore(state => state.user);
  const accessToken = user?.token?.accessToken;

  const { isLiked, toggle } = useToggleBookmark(initialBookmarkId, Number(product._id), accessToken);
  const remaining = useRemainingStock(product.quantity, product.buyQuantity);

  return (
    <Link href={`/product/${product._id}`}>
      <div className="relative w-full aspect-square">
        <Image src={`${API_URL}/${product.mainImages[0]?.path}`} alt={product.name} fill className="object-cover rounded-md" sizes="(max-width: 640px) 100vw, 238px" />
        <button
          type="button"
          className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow hover:scale-110 active:scale-95 transition-transform cursor-pointer
              w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            toggle(e);
          }}
          aria-label={isLiked ? '북마크 해제' : '북마크 추가'}
        >
          {isLiked ? <Favorite svgProps={{ className: 'w-4 h-4 sm:w-3 sm:h-3 text-red' }} /> : <FavoriteBorder svgProps={{ className: 'w-4 h-4 sm:w-3 sm:h-3 text-gray' }} />}
        </button>
      </div>

      <div className="p-2">
        {remaining <= 0 ? <span className="bg-black text-white text-[10px] font-bold px-1.5 py-0.5 whitespace-nowrap inline-block mb-1">SOLD OUT</span> : remaining <= 5 ? <span className="bg-orange-500 text-white text-[10px] font-semibold px-1.5 py-0.5 whitespace-nowrap inline-block mb-1">{remaining}개 남음</span> : null}

        <p>{product.name}</p>
        <p className="font-semibold">{product.price.toLocaleString()}원</p>
      </div>
    </Link>
  );
}

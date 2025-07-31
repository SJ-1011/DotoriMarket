'use client';

import { Product } from '@/types/Product';
import Image from 'next/image';
import Link from 'next/link';
import Favorite from '../icon/FavoriteIcon';
import FavoriteBorder from '../icon/FavoriteBorderIcon';
import { useLoginStore } from '@/stores/loginStore';
import { useToggleBookmark } from '@/hooks/useToggleBookmark';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProductCardLarge({ product, bookmarkId: initialBookmarkId, index }: { product: Product; bookmarkId?: number; index?: number; isAdmin?: boolean }) {
  const user = useLoginStore(state => state.user);
  const isAdmin = useLoginStore(state => state.isAdmin);
  const accessToken = user?.token?.accessToken;

  const { isLiked, toggle } = useToggleBookmark(initialBookmarkId, Number(product._id), accessToken);

  const categoryMap: Record<string, string> = {
    PC01: '캐릭터',
    PC02: '미니어처',
    PC03: '문구',
    PC04: '리빙&소품',
  };

  return (
    <Link href={`/products/${product._id}`} className="bg-white p-4 rounded-2xl shadow-[0px_0px_10px_rgba(0,0,0,0.2)] flex flex-col justify-between h-[270px] sm:h-[290px] lg:h-[400px]">
      <div>
        <div className="relative w-full aspect-square">
          <div className="relative w-[140px] lg:w-[230px] aspect-square overflow-hidden rounded-md">
            <Image src={`${API_URL}/${product.mainImages[0]?.path}`} alt={product.name} fill className="object-cover transition-transform duration-300 ease-in-out hover:scale-110" sizes="(max-width: 640px) 100vw, 238px" />
          </div>

          {!isAdmin && (
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
          )}
        </div>

        <div className="relative flex flex-col flex-nowrap pt-4">
          <p className="absolute -top-4 sm:-top-6 lg:-top-13 font-bold text-secondary-green">
            <span className="italic font-bold text-[40px] sm:text-[50px] lg:text-[70px] text-secondary-green">{index} </span>
            {product.extra?.category?.[0] ? categoryMap[product.extra?.category?.[0]] : '기타'}
          </p>
          <p className="pt-4 lg:pt-8 font-bold break-keep whitespace-normal">{product.name}</p>
        </div>
      </div>

      <p className="text-gray mt-2 self-start mb-1">{product.price.toLocaleString()}원</p>
    </Link>
  );
}

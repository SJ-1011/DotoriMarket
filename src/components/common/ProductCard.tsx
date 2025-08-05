'use client';

import { Product } from '@/types/Product';
import Image from 'next/image';
import Link from 'next/link';
import Favorite from '../icon/FavoriteIcon';
import FavoriteBorder from '../icon/FavoriteBorderIcon';
import { useLoginStore } from '@/stores/loginStore';
import { useToggleBookmark } from '@/hooks/useToggleBookmark';
import { useRemainingStock } from '@/hooks/useRemainingStock';
import { getFullImageUrl } from '@/utils/getFullImageUrl';

interface ProductCardProps {
  product: Product;
  bookmarkId?: number;
  showCheckbox?: boolean;
  isSelected?: boolean;
  onSelect?: (id: number) => void;
}

export default function ProductCard({ product, bookmarkId: initialBookmarkId, showCheckbox = false, isSelected = false, onSelect }: ProductCardProps) {
  const user = useLoginStore(state => state.user);
  const isAdmin = useLoginStore(state => state.isAdmin);
  const accessToken = user?.token?.accessToken;

  const { isLiked, toggle } = useToggleBookmark(initialBookmarkId, Number(product._id), accessToken);
  const remaining = useRemainingStock(product.quantity, product.buyQuantity);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onSelect?.(Number(product._id));
  };

  const productLink = `/products/${product._id}`;
  const productImagePath = product.mainImages?.[0]?.path ?? '';
  const productImageSrc = productImagePath.trim() ? getFullImageUrl(productImagePath) : null;
  return (
    <div className="relative">
      {/* 체크박스는 isAdmin이면서 showCheckbox가 true일 때만  */}
      {isAdmin && showCheckbox && <input type="checkbox" checked={isSelected} onChange={handleCheckboxChange} className="absolute top-2 left-2 w-4 h-4 sm:w-5 sm:h-5 accent-primary z-10 cursor-pointer" aria-label="상품 선택" />}

      <Link href={productLink} className="block">
        <div className="relative w-full aspect-square">
          <div className="relative w-full aspect-square max-w-[238px] overflow-hidden rounded-md">{productImageSrc ? <Image src={productImageSrc} alt={product.name || '상품 이미지'} fill className="object-cover transition-transform duration-300 ease-in-out hover:scale-110" sizes="(max-width: 640px) 100vw, 238px" draggable={false} /> : <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-500">이미지 없음</div>} </div>

          {/* 일반 사용자 북마크 버튼 */}
          {!isAdmin && (
            <button
              type="button"
              className="absolute bottom-3 right-3 p-2 bg-white rounded-full shadow hover:scale-110 active:scale-95 transition-transform cursor-pointer w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center"
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

        <div className="p-2">
          {remaining <= 0 ? <span className="bg-black text-white text-[10px] font-bold px-1.5 py-0.5 whitespace-nowrap inline-block mb-1">SOLD OUT</span> : remaining <= 5 ? <span className="bg-orange-500 text-white text-[10px] font-semibold px-1.5 py-0.5 whitespace-nowrap inline-block mb-1">{remaining}개 남음</span> : null}

          <p className="truncate">{product.name}</p>
          <p className="font-semibold">{product.price.toLocaleString()}원</p>
        </div>
      </Link>
    </div>
  );
}

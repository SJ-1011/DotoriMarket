'use client';

import type { Product } from '@/types/Product';
import Image from 'next/image';
import { useState } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import { CATEGORY_MAP, CHARACTER_CATEGORIES, STATIONERY_CATEGORIES, LIVING_CATEGORIES } from '@/constants/categories';
import { useToggleBookmark } from '@/hooks/useToggleBookmark';
import { useRemainingStock } from '@/hooks/useRemainingStock';
import { useLoginStore } from '@/stores/loginStore';
import Favorite from '@/components/icon/FavoriteIcon';
import FavoriteBorder from '@/components/icon/FavoriteBorderIcon';

interface PurchaseSectionProps {
  product: Product;
}

// 카테고리별 서브카테고리 매핑
const CATEGORY_MAPPINGS = {
  PC01: CHARACTER_CATEGORIES,
  PC03: STATIONERY_CATEGORIES,
  PC04: LIVING_CATEGORIES,
} as const;

const CATEGORY_CODE_LENGTH = 4;

// 서브카테고리 정보를 가져오는 헬퍼 함수
function getSubCategoryInfo(categoryCode: string, smallCategoryCode: string, bigCategory: { label: string; href: string }) {
  const categories = CATEGORY_MAPPINGS[categoryCode as keyof typeof CATEGORY_MAPPINGS];

  if (!categories || !smallCategoryCode.startsWith(categoryCode)) {
    return { label: '', href: '' };
  }

  const subCode = smallCategoryCode.slice(CATEGORY_CODE_LENGTH);
  const idx = Number(subCode) - 1;

  if (!Number.isNaN(idx) && idx >= 0 && idx < categories.length) {
    return {
      label: categories[idx],
      href: `${bigCategory.href}/${String(idx + 1).padStart(2, '0')}`,
    };
  }

  return { label: '', href: '' };
}

// Breadcrumb 아이템 생성 함수
function getBreadcrumbItems(product: Product) {
  const categoryCode = product.extra?.category?.[0] ?? '';
  const smallCategoryCode = product.extra?.category?.[1] ?? '';
  const bigCategory = CATEGORY_MAP[categoryCode] ?? { label: '카테고리', href: '#' };

  const subCategory = getSubCategoryInfo(categoryCode, smallCategoryCode, bigCategory);

  return [{ label: '홈', href: '/' }, { label: bigCategory.label, href: bigCategory.href }, ...(subCategory.label ? [{ label: subCategory.label, href: subCategory.href }] : []), { label: product.name, href: `/products/${product._id}` }];
}

// 이미지 URL 생성 함수
const getFullImageUrl = (imagePath: string): string => {
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  return `https://fesp-api.koyeb.app/market/${imagePath}`;
};

// 수량 변경 훅
const useQuantityHandlers = (initialQuantity: number = 1) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return { quantity, increaseQuantity, decreaseQuantity };
};

export default function PurchaseSection({ product }: PurchaseSectionProps) {
  // 로그인 사용자 정보 및 토큰
  const user = useLoginStore(state => state.user);
  const accessToken = user?.token?.accessToken;

  // 초기 북마크 아이디 (예: product.bookmarkId가 있을 경우)
  const initialBookmarkId = product.bookmarkId;

  // 좋아요 토글 훅 사용
  const { isLiked, toggle } = useToggleBookmark(initialBookmarkId, Number(product._id), accessToken);

  // 재고 계산 훅 사용
  const remainingStock = useRemainingStock(product.quantity, product.buyQuantity);

  // 수량 관련 훅
  const { quantity, increaseQuantity, decreaseQuantity } = useQuantityHandlers();

  const isSoldOut = remainingStock <= 0;
  const totalPrice = product.price * quantity;

  // Breadcrumb 아이템 생성
  const breadcrumbItems = getBreadcrumbItems(product);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* 왼쪽 - 상품 이미지 및 Breadcrumb */}
        <div className="lg:w-1/2 relative">
          {/* 1024px 이상에서 왼쪽 위 Breadcrumb */}
          <div className="hidden lg:block absolute top-0 left-0 p-4 z-10 bg-white bg-opacity-70 rounded-br-md">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          {/* 상품 이미지 */}
          {product.mainImages?.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="relative w-full pb-[100%]">
                <Image src={getFullImageUrl(product.mainImages[0].path)} alt={product.name} fill className="object-contain" unoptimized />
                {/* 좋아요 버튼 */}
                <button
                  type="button"
                  className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow hover:scale-110 active:scale-95 transition-transform cursor-pointer
                w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center"
                  onClick={toggle}
                >
                  {isLiked ? <Favorite svgProps={{ className: 'w-4 h-4 sm:w-3 sm:h-3 text-red' }} /> : <FavoriteBorder svgProps={{ className: 'w-4 h-4 sm:w-3 sm:h-3 text-gray' }} />}
                </button>
              </div>
            </div>
          )}

          {/* 1024px 미만에서 이미지 아래 왼쪽에 Breadcrumb */}
          <div className="lg:hidden mt-4">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        {/* 오른쪽 - 상품 정보 */}
        <div className="lg:w-1/2 space-y-6">
          {/* 제품명 */}
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>

          {/* 가격 */}
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-gray-500">판매가</span>
            <span className="text-2xl font-bold text-red-500">{product.price.toLocaleString()}원</span>
          </div>

          {/* 평점 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">사용후기</span>
            <div className="flex items-center">
              <span className="text-red-500">★</span>
              <span className="text-sm ml-1">5.0 리뷰 3개</span>
            </div>
          </div>

          {/* 옵션 선택 */}
          <div className="border-t border-b py-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">옵션 선택</span>
              <button className="text-sm text-gray-400">[필수] 옵션을 선택해주세요 ▼</button>
            </div>

            {/* 수량 선택 */}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">{product.name}</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center border">
                  <button onClick={decreaseQuantity} className="px-3 py-1 text-gray-500 hover:bg-gray-100 disabled:opacity-50" disabled={quantity <= 1}>
                    -
                  </button>
                  <span className="px-3 py-1 min-w-[40px] text-center">{quantity}</span>
                  <button onClick={increaseQuantity} className="px-3 py-1 text-gray-500 hover:bg-gray-100 disabled:opacity-50" disabled={quantity >= remainingStock}>
                    +
                  </button>
                </div>
                <span className="text-sm font-medium ml-4">{totalPrice.toLocaleString()}원</span>
              </div>
            </div>
          </div>

          {/* 총 가격 */}
          <div className="text-right py-2">
            <span className="text-sm text-gray-500 mr-2">total price</span>
            <span className="text-2xl font-bold">{totalPrice.toLocaleString()}원</span>
            <span className="text-sm text-gray-500 ml-1">({quantity}개)</span>
          </div>

          {/* 구매 버튼 */}
          <div className="space-y-3">
            <button className="w-full bg-orange-400 text-white py-4 rounded-md font-medium hover:bg-orange-500 transition disabled:opacity-50" disabled={isSoldOut}>
              {isSoldOut ? '품절' : '바로 구매하기'}
            </button>

            <div className="flex gap-3">
              <button className="flex-1 border border-orange-400 text-orange-400 py-3 rounded-md font-medium hover:bg-orange-50 transition">장바구니</button>
              <button className="w-12 h-12 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 transition">♡</button>
              <button className="w-12 h-12 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 transition">↗</button>
            </div>
          </div>

          {/* 배송 정보 */}
          <div className="text-sm text-gray-500 space-y-1">
            <p>배송비: {product.shippingFees.toLocaleString()}원</p>
            <p>남은 수량: {remainingStock}개</p>
          </div>
        </div>
      </div>
    </div>
  );
}

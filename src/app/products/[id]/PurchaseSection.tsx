'use client';

import type { Product } from '@/types/Product';
import Image from 'next/image';
import { useState } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import { CATEGORY_MAP, CHARACTER_CATEGORIES, STATIONERY_CATEGORIES, LIVING_CATEGORIES } from '@/constants/categories';
import { useToggleBookmark } from '@/hooks/useToggleBookmark';
import { useRemainingStock } from '@/hooks/useRemainingStock';
import useQuantityHandlers from '@/hooks/useQuantityHandlers';
import { useLoginStore } from '@/stores/loginStore';
import Favorite from '@/components/icon/FavoriteIcon';
import FavoriteBorder from '@/components/icon/FavoriteBorderIcon';
import ShareIcon from '@/components/icon/ShareIcon';
import { useRouter, usePathname } from 'next/navigation';
import { addToCart } from '@/data/actions/addToCart';

interface PurchaseSectionProps {
  product: Product & { bookmarkId?: number };
}

// 카테고리별 서브카테고리 매핑
const CATEGORY_MAPPINGS = {
  PC01: CHARACTER_CATEGORIES,
  PC03: STATIONERY_CATEGORIES,
  PC04: LIVING_CATEGORIES,
} as const;

const CATEGORY_CODE_LENGTH = 4;

// 서브카테고리 정보를 가져오는 함수
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

export default function PurchaseSection({ product }: PurchaseSectionProps) {
  // 로그인 사용자 정보 및 토큰
  const user = useLoginStore(state => state.user);
  const accessToken = user?.token?.accessToken;

  // 초기 북마크 아이디
  const initialBookmarkId = product.bookmarkId;

  // 좋아요 토글 훅
  const { isLiked, toggle } = useToggleBookmark(initialBookmarkId, Number(product._id), accessToken);

  // 남은 재고 계산 훅
  const remainingStock = useRemainingStock(product.quantity, product.buyQuantity);

  // 수량 선택 훅
  const { quantity, increaseQuantity, decreaseQuantity } = useQuantityHandlers();

  // 품절 여부
  const isSoldOut = remainingStock <= 0;

  // 총 가격 계산
  const totalPrice = product.price * quantity;

  // Breadcrumb 아이템 생성
  const breadcrumbItems = getBreadcrumbItems(product);

  // 배송비 포함 가격 계산
  const freeShippingThreshold = 30000;
  const shippingFeeToUse = totalPrice >= freeShippingThreshold ? 0 : product.shippingFees;
  const finalPrice = totalPrice + shippingFeeToUse;

  // 공유하기 함수
  const [copied, setCopied] = useState(false);
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `이 상품을 공유합니다: ${product.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('공유 실패:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        alert('주소 복사에 실패했습니다. 수동으로 복사해 주세요.');
      }
    }
  };

  // 구매하기 버튼 이동
  const router = useRouter();
  const pathname = usePathname();
  const handleClick = () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!isSoldOut) {
      alert('구매 페이지로 이동합니다.');
      router.push(`/order?productId=${product._id}&qty=${quantity}`);
    }
  };

  // 장바구니 버튼
const handleAddToCart = async () => {
  if (!user) {
    alert('로그인이 필요합니다.');
    router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    return;
  }

  if (isSoldOut) {
    alert('품절된 상품은 장바구니에 담을 수 없습니다.');
    return;
  }

  try {
    await addToCart(Number(product._id), quantity, accessToken!);
    alert('장바구니에 상품이 추가되었습니다!');
  } catch {
    alert('장바구니 추가에 실패했습니다. 다시 시도해 주세요.');
  }
};
  return (
    <>
      {/* Breadcrumb */}
      <div className="w-full p-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="sm:w-1/2 relative">
            {/* 상품 이미지 */}
            {product.mainImages?.length > 0 && (
              <div className="relative">
                <div className="relative w-full pb-[100%]">
                  <Image src={getFullImageUrl(product.mainImages[0].path)} alt={product.name} fill className="object-contain w-full h-full" unoptimized />
                </div>
              </div>
            )}
            {/* 배송 정보 */}
            <div className="text-sm text-gray-500 mt-2">
              <p>
                배송비: {product.shippingFees.toLocaleString()}원 <span className="text-sm text-gray-500">(3만원 이상 무료)</span>
              </p>
            </div>
          </div>

          {/* 오른쪽 - 상품 정보 */}
          <div className="sm:w-1/2 space-y-2">
            <div className="border-t-2 border-primary" />

            {/* 제품명 */}
            <h1 className="text-lg font-bold p-2">{product.name}</h1>

            <div className="border-t border-primary mb-4" />

            <div className="p-2 mb-4">
              {/* 가격 */}
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-gray-500">판매가</span>
                <span className="text-lg font-bold">{product.price.toLocaleString()}원</span>
              </div>

              {/* TODO 평점 */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">사용후기</span>
                <div className="flex items-center">
                  <span className="text-red-500 mb-2">★</span>
                  <span className="text-sm ml-1">5.0 리뷰 3개</span>
                </div>
              </div>
            </div>

            <div className="border-t border-primary " />

            <div className="flex items-center justify-between py-4 p-2 gap-2">
              <span className="text-sm truncate">{product.name}</span>
              <div className="flex items-center gap-4">
                {/* 수량 조절 버튼 */}
                <div className="flex items-center border overflow-hidden">
                  <button onClick={decreaseQuantity} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-50" disabled={quantity <= 1}>
                    -
                  </button>
                  <span className="w-8 text-center text-sm">{quantity}</span>
                  <button onClick={increaseQuantity} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-50" disabled={quantity >= remainingStock}>
                    +
                  </button>
                </div>
                {/* 총 상품금액 */}
                <span className="text-sm font-semibold min-w-[60px] text-right">{totalPrice.toLocaleString()}원</span>
              </div>
            </div>
            <div className="border-t border-primary mb-4" />

            {/* 총 결제금액 */}
            <div className="text-sm font-medium text-gray-700 my-6 text-right">
              total price <span className="text-lg font-bold">{finalPrice.toLocaleString()}원</span> ({quantity}개)
            </div>

            {/* 구매 버튼 */}
            <div className="space-y-3">
              <button onClick={handleClick} disabled={isSoldOut} className={`w-full py-4 rounded-md font-medium transition disabled:opacity-50 ${isSoldOut ? 'bg-gray-300 cursor-not-allowed pointer-events-none text-black' : 'bg-primary text-white hover:bg-primary-dark cursor-pointer'}`}>
                {isSoldOut ? '품절' : '바로 구매하기'}
              </button>

              <div className="flex gap-3">
                {/* 장바구니 */}
                <button onClick={handleAddToCart} className="cursor-pointer flex-1 border border-primary text-primary py-3 rounded-md font-medium">
                  장바구니
                </button>
                {/* 관심상품 등록 버튼 */}
                <button type="button" onClick={toggle} className="cursor-pointer w-12 h-12 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 transition" aria-label={isLiked ? '북마크 취소' : '북마크 추가'}>
                  {isLiked ? <Favorite svgProps={{ className: 'w-4 h-4 text-red-500' }} /> : <FavoriteBorder svgProps={{ className: 'w-4 h-4 text-gray-400' }} />}
                </button>
                <button className="cursor-pointer w-12 h-12 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 transition relative" aria-label="공유하기" onClick={handleShare}>
                  <ShareIcon className="w-5 h-5 text-gray-500" />
                  {copied && <span className="fixed bottom-16 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-3 py-1 z-50">링크가 복사되었습니다.</span>}{' '}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

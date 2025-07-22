import type { Product } from '@/types/Product';
import Image from 'next/image';
import { useState } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';

interface PurchaseSectionProps {
  product: Product;
}

export default function PurchaseSection({ product }: PurchaseSectionProps) {
  const [quantity, setQuantity] = useState(1);
  const isSoldOut = product.quantity <= product.buyQuantity;

  const getFullImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `https://fesp-api.koyeb.app/market/${imagePath}`;
  };

  const totalPrice = product.price * quantity;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* 왼쪽 - 상품 이미지 및 브레드크럼브 */}
        <div className="lg:w-1/2 relative">
          {/* 1024px 이상일 때 - 이미지 왼쪽 위에 Breadcrumb */}
          <div className="hidden lg:block absolute top-0 left-0 p-4 z-10 bg-white bg-opacity-70 rounded-br-md">
            <Breadcrumb items={[{ label: '홈', href: '/' }, { label: '카테고리', href: '/category' }, { label: product.name }]} />
          </div>

          {/* 상품 이미지 */}
          {product.mainImages?.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="relative w-full pb-[100%]">
                <Image src={getFullImageUrl(product.mainImages[0].path)} alt={product.name} fill className="object-contain" unoptimized />
              </div>
            </div>
          )}

          {/* 1024px 미만일 때 - 이미지 아래 왼쪽에 Breadcrumb */}
          <div className="lg:hidden mt-4">
            <Breadcrumb
              items={[
                { label: '홈', href: '/' },
                { label: product.extra?.category?.[0] ?? '카테고리 없음', href: '/category' },
              ]}
            />
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
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1 text-gray-500 hover:bg-gray-100">
                    -
                  </button>
                  <span className="px-3 py-1 min-w-[40px] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1 text-gray-500 hover:bg-gray-100">
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

          {/* 구매 버튼들 */}
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
            <p>남은 수량: {product.quantity - product.buyQuantity}개</p>
          </div>
        </div>
      </div>
    </div>
  );
}

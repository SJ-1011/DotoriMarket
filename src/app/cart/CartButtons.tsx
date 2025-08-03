'use client';

interface CartButtonsProps {
  handleDeleteSelected: () => void;
}

export default function CartButtons({ handleDeleteSelected }: CartButtonsProps) {
  return (
    <div className="flex justify-between items-center py-2 sm:mt-4 lg:mt-8">
      {/* 선택상품 삭제 버튼 */}
      <button onClick={handleDeleteSelected} className="border border-dark-gray px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-sm lg:text-base hover:bg-dark-gray hover:text-white transition-colors cursor-pointer">
        선택상품 삭제
      </button>

      {/* 안내문 */}
      <span className="hidden sm:block text-xs sm:text-sm text-gray">모든 상품은 합배송되며, 배송비는 가장 높은 금액 한 번만 청구됩니다.</span>
    </div>
  );
}

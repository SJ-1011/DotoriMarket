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
      <span className="hidden sm:block text-xs sm:text-sm text-gray">장바구니는 최대 10개의 상품을 담을 수 있습니다.</span>
    </div>
  );
}

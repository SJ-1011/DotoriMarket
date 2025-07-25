import React from 'react';
import Image from 'next/image';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ totalPages, currentPage, onPageChange }: PaginationProps) {
  const getPageNumbers = () => {
    if (totalPages <= 5) return [...Array(totalPages)].map((_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center gap-2 mb-6 min-h-[60px] sm:gap-3">
      {/* 이전 버튼 */}
      <button disabled={currentPage === 1} onClick={() => onPageChange(Math.max(currentPage - 1, 1))} className="relative disabled:opacity-50 w-10 h-10 sm:w-12 sm:h-12">
        <Image src="/page-dotori.png" alt="이전" fill style={{ objectFit: 'contain' }} />
        <span className="absolute top-1/2 left-2.5 -translate-y-1/2 font-bold text-sm text-white select-none pointer-events-none sm:left-4 sm:text-base">{'◀'}</span>
      </button>

      {/* 페이지 번호 버튼 */}
      {pageNumbers.map(page => {
        const isActive = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-colors cursor-pointer 
            ${isActive ? ' bg-orange-200 font-bold' : ''}
            `}
          >
            <span
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black select-none pointer-events-none 
            ${isActive ? 'font-bold text-base' : 'font-medium text-sm'}`}
            >
              {page}
            </span>
          </button>
        );
      })}

      {/* 다음 버튼 */}
      <button disabled={currentPage === totalPages} onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))} className="relative disabled:opacity-50 w-10 h-10 sm:w-12 sm:h-12">
        <Image src="/page-dotori.png" alt="다음" fill style={{ objectFit: 'contain' }} />
        <span className="absolute top-1/2 right-3 -translate-y-1/2 font-bold text-sm text-white select-none pointer-events-none sm:right-4 sm:text-base">{'▶'}</span>
      </button>
    </div>
  );
}

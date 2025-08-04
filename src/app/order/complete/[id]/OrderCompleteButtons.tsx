'use client';

import { useRouter } from 'next/navigation';

export default function OrderCompleteButtons() {
  const router = useRouter();

  return (
    <div className="flex flex-row justify-center gap-2 sm:gap-4 lg:gap-6">
      <button
        onClick={() => router.push('/mypage')}
        className="w-1/2 py-2 sm:py-3
                   bg-primary text-white rounded-md sm:rounded-lg hover:bg-primary-dark
                   text-sm sm:text-base lg:text-lg transition"
      >
        주문 목록 가기
      </button>

      <button
        onClick={() => router.push('/')}
        className="w-1/2  py-2 sm:py-3 
                   bg-secondary-green text-white rounded-md sm:rounded-lg hover:bg-green-700
                   text-xs sm:text-sm lg:text-base transition"
      >
        쇼핑하러 가기
      </button>
    </div>
  );
}

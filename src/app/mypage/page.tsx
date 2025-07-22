'use client';

import Image from 'next/image';
import ResidentCard from './ResidentCard';

export default function MyPage() {
  return (
    <div className="flex flex-col items-center  p-2 sm:p-4 space-y-10 mt-4">
      <ResidentCard />

      {/* 나의 주문 현황 */}
      <div className="w-full max-w-[20rem]  sm:max-w-[30rem] lg:shadow-md lg:max-w-full lg:border lg:border-gray">
        <div className="text-sm flex flex-row items-center mb-1 px-2 py-1 lg:px-4 lg:py-2 lg:bg-background lg:border-b border-gray">
          <span className="text-dark-gray font-bold text-xs sm:text-sm lg:text-base">나의 주문 현황</span>
          <span className="flex flex-row text-gray text-[0.7rem] mt-1 ml-2 sm:text-xs sm:ml-3 lg:text-sm lg:ml-4">
            최근 <p className="text-dark-gray mx-0.5 sm:mx-0.75 lg:mx-1 font-bold">3개월</p> 기준
          </span>
        </div>
        <div className="grid grid-cols-4 divide-x divide-soft-gray text-center font-bold border-dark-gray border-t border-b sm:py-6 lg:divide-gray lg:border-none lg:py-12 lg:border-gray">
          {['입금전', '배송준비중', '배송중', '배송완료'].map((label, idx) => (
            <div key={idx} className="py-3 sm:4 lg:py-6">
              <p className="text-xs text-dark-gray  mb-1 sm:text-sm sm:mb-3 lg:text-base lg:mb-6">{label}</p>
              <p className="text-base  text-dark-gray sm:text-lg lg:text-3xl">0</p>
            </div>
          ))}
        </div>
      </div>

      {/* 나의 주문 내역 조회 */}
      <div className="w-full max-w-[20rem] sm:max-w-[30rem] lg:max-w-full border-gray mt-4">
        <div className="text-sm flex flex-row items-center mb-1 px-2 py-1 border-gray">
          <span className="text-dark-gray font-bold text-xs sm:text-sm lg:text-base">주문내역 조회</span>
          <span className="flex flex-row text-gray text-[0.7rem] mt-1 ml-2 sm:text-xs sm:ml-3 lg:text-sm lg:ml-4">
            최근 <p className="text-dark-gray mx-0.5 sm:mx-0.75 lg:mx-1 font-bold">3개월</p> 기준
          </span>
        </div>
        <div className="grid grid-cols-5 text-center text-dark-gray border-t border-b">
          {['주문번호', '상품명', '주문일자', '주문상태', '결제금액'].map((header, idx) => (
            <div key={idx} className="py-2 text-[0.7rem] sm:text-sm lg:text-base">
              {header}
            </div>
          ))}
        </div>
        {[
          { no: 1, name: '도토리 머그컵', date: '2025-07-08', status: '배송완료', price: '15,000', img: '/logo.png' },
          { no: 2, name: '도토리 머그컵', date: '2025-07-08', status: '결제완료', price: '15,000', img: '/logo.png' },
          { no: 3, name: '도토리 머그컵', date: '2025-07-08', status: '취소완료', price: '15,000', img: '/logo.png' },
        ].map((order, idx) => (
          <div key={idx} className="grid grid-cols-5 items-center text-center border-b text-[0.5rem] sm:text-[0.75rem] lg:text-base">
            <p className="py-2">{order.no}</p>
            <div className="flex flex-col items-center justify-center py-2">
              <Image src={order.img} alt="상품 이미지" width={40} height={40} className="rounded-md mb-1 lg:w-16 lg:h-16" />
              <p>{order.name}</p>
            </div>
            <p>{order.date}</p>
            <p
              className={`${order.status === '취소완료' ? '' : 'font-bold'} 
              ${order.status === '배송완료' ? 'text-primary' : 'text-dark-gray'}`}
            >
              {order.status}
            </p>
            <p>{order.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

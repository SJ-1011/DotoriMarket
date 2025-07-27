import Image from 'next/image';

export default function OrderCompleteHeader({ createdAt, orderId }: { createdAt: string; orderId: string }) {
  const dateOnly = createdAt.split(' ')[0];

  return (
    <div className="text-center text-sm sm:text-base lg:text-lg space-y-5">
      <Image unoptimized src="/order-shoppingbag.png" alt="주문완료" width={80} height={80} className="mx-auto w-15 h-20 sm:w-20 sm:h-28 lg:w-25 lg:h-36" />
      <h2 className="font-bold">주문이 완료되었습니다. </h2>
      <div className="text-xs sm:text-sm lg:text-base">
        <p>{dateOnly} 주문하신 상품의</p>
        <p>주문번호는 {orderId}번 입니다.</p>
      </div>
    </div>
  );
}

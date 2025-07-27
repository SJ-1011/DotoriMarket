import Image from 'next/image';

export default function OrderCompleteHeader({ createdAt, orderId }: { createdAt: string; orderId: string }) {
  const dateOnly = createdAt.split(' ')[0];

  return (
    <div className="text-center my-2 text-sm sm:text-base lg:text-lg">
      <Image src="/order-shoppingbag.png" alt="주문완료" width={80} height={80} className=" mx-auto" />
      <h1 className="text-base sm:text-lg lg:text-2xl font-bold my-2">주문이 완료되었습니다. </h1>
      <p>{dateOnly} 주문하신 상품의</p>
      <p>주문번호는 {orderId}번 입니다.</p>
    </div>
  );
}

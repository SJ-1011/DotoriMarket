import { OrderCost } from '@/types/Order';

export default function PaymentInfo({ cost }: { cost: OrderCost }) {
  return (
    <div className="space-y-1">
      <h2 className="text-sm sm:text-base lg:text-lg font-bold text-gray-800 mb-2">결제 정보</h2>
      <p className="text-xs sm:text-sm lg:text-base text-gray-700">상품 금액: {cost.products.toLocaleString()}원</p>
      <p className="text-xs sm:text-sm lg:text-base text-gray-700">배송비: {cost.shippingFees.toLocaleString()}원</p>
      {cost.discount.products > 0 && <p className="text-xs sm:text-sm lg:text-base text-gray-700">상품 할인: -{cost.discount.products.toLocaleString()}원</p>}
      {cost.discount.shippingFees > 0 && <p className="text-xs sm:text-sm lg:text-base text-gray-700">배송비 할인: -{cost.discount.shippingFees.toLocaleString()}원</p>}
      <p className="mt-2 font-bold text-primary text-sm sm:text-base lg:text-lg">총 결제 금액: {cost.total.toLocaleString()}원</p>
    </div>
  );
}

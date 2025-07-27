import { OrderCost } from '@/types/Order';
import { Product } from '@/types/Product';

export default function OrderCompleteProducts({ products, cost }: { products: Product[]; cost: OrderCost }) {
  const totalCount = products.length;
  const firstProduct = products[0];

  return (
    <div>
      <h2 className="text-base sm:text-lg font-bold py-2">주문 상품</h2>
      <div className="p-4 sm:p-6 lg:p-8 border-t-2 border-primary text-dark-gray bg-white">
        <p className="text-sm sm:text-base font-bold">총 {totalCount}건</p>
        <p className="text-sm sm:text-base">
          {firstProduct.name}
          {totalCount > 1 && ` 외 ${totalCount - 1}건`}
        </p>

        <hr className="w-full border-t border-primary my-2" />

        <div className="py-2 text-xs sm:text-sm lg:text-base text-gray space-y-2">
          <div className="flex justify-between">
            <p>상품 금액</p>
            <p>{cost.products.toLocaleString()}원</p>
          </div>

          <div className="flex justify-between">
            <p>할인/쿠폰</p>
            <p>- {(cost.discount.products + cost.discount.shippingFees).toLocaleString()}원</p>
          </div>

          <div className="flex justify-between">
            <p>배송비</p>
            <p>{cost.shippingFees === 0 ? '무료' : `${cost.shippingFees.toLocaleString()}원`}</p>
          </div>
        </div>
        <div className="-mx-4 -mb-4 sm:-mx-6 sm:-mb-6 lg:-mb-8 lg:-mx-8 bg-primary text-sm text-white font-bold px-4 sm:text-base sm:px-6 lg:px-8 mt-3 py-1 sm:py-2 lg:py-3 lg:text-lg flex justify-between">
          <p>총 주문금액</p>
          <p>{cost.total.toLocaleString()}원</p>
        </div>
      </div>
    </div>
  );
}

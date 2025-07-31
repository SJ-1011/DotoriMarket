import type { AdminOrderProduct } from '@/types/AdminOrder';
import Image from 'next/image';

const getImageUrl = (path?: string) => (path ? `${process.env.NEXT_PUBLIC_API_URL}/${path}` : '/no-image.png');

export default function OrderedProducts({ products }: { products: AdminOrderProduct[] }) {
  return (
    <div className="space-y-2">
      <h2 className="text-sm sm:text-base lg:text-lg font-bold text-dark-gray mb-2">주문 상품</h2>
      <ul className="divide-y divide-gray-200">
        {products.map((product, idx) => (
          <li key={`${product._id}-${idx}`} className="flex items-start gap-3 py-2">
            <Image src={getImageUrl(product.image?.path)} alt={product.name} width={48} height={48} className="rounded object-cover w-15 h-15 sm:w-20 sm:h-20" unoptimized />
            <div className="flex-1">
              <p className="font-medium text-xs sm:text-sm lg:text-base">{product.name}</p>
              <p className="text-xs sm:text-xs lg:text-sm text-gray">수량: {product.quantity}</p>
            </div>
            <p className="font-bold text-xs sm:text-sm lg:text-base">{(product.price ?? 0).toLocaleString()}원</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

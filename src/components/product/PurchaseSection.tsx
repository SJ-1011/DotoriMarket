import type { Product } from '@/types/Product';

export default function PurchaseSection({ product }: { product: Product }) {
  return (
    <section className="border p-4 rounded mb-8">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p className="text-lg text-gray-600">{product.price.toLocaleString()}원</p>
      <button className="mt-4 px-6 py-2 border rounded">구매하기</button>
    </section>
  );
}

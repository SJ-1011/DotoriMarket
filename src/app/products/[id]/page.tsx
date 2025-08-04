import { getProductById } from '@/utils/getProducts';
import ProductDetailPage from './ProductDetailPage';
import { notFound } from 'next/navigation';
import Image from 'next/image';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await getProductById(Number(id));

  if (!res.ok || !res.item) {
    // 상품 자체가 없으면 404 처리
    notFound();
  }

  if (res.item.active === false) {
    // 상품이 비활성(삭제)된 경우
    return (
      <div className="max-w-md mx-auto p-8 mt-10 text-center">
        <Image src="/sad-dotori.png" alt="슬픈 도토리" width={200} height={200} priority className="mx-auto mt-6" />
        <h1 className="text-xl font-bold mb-4 mt-10">상품이 삭제되었거나 판매가 종료되었습니다.</h1>
        <p className="text-gray-600 mb-10">해당 상품은 더 이상 구매하실 수 없습니다.</p>
      </div>
    );
  }

  return <ProductDetailPage product={res.item} />;
}

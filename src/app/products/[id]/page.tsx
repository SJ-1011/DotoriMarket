import { getProductById } from '@/utils/getProducts';
import ProductDetailPage from '@/app/products/[id]/DetailPage';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await getProductById(Number(id));

  if (!res.ok || !res.item) {
    return <div>상품을 불러올 수 없습니다.</div>;
  }

  return <ProductDetailPage product={res.item} />;
}

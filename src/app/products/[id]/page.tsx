import { getProductById } from '@/utils/getProducts';
import ProductDetailPage from '@/app/products/[id]/DetailPage';

interface Props {
  params: { id: string };
}

export default async function ProductPage({ params }: Props) {
  const res = await getProductById(Number(params.id));

  if (!res.ok || !res.item) {
    return <div>상품을 불러올 수 없습니다.</div>;
  }

  return <ProductDetailPage product={res.item} />;
}

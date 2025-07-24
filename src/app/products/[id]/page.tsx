import { getProductById } from '@/utils/getProducts';
import ProductDetailPage from './DetailPage';
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const awaitedParams = await params;
  const productId = Number(awaitedParams.id);

  const res = await getProductById(productId);

  if (!res.ok || !res.item) {
    notFound();
  }

  return <ProductDetailPage product={res.item} />;
}

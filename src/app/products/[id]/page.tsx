import { getProductById } from '@/utils/getProducts';
import ProductDetailPage from './DetailPage';
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await getProductById(Number(id));

  if (!res.ok || !res.item) {
    notFound();
  }

  return <ProductDetailPage product={res.item} />;
}

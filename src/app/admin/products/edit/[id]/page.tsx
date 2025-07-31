import { getProductById } from '@/utils/getProducts';
import AdminProductEditPage from './AdminProductEditPage';
import { notFound } from 'next/navigation';

export default async function AdminProductEditServer({ params }: { params: { id: string } }) {
  const res = await getProductById(Number(params.id));
  console.log('res:', res);

  if (!res.ok || !res.item || res.item.active === false) {
    notFound();
  }

  return <AdminProductEditPage product={res.item} />;
}

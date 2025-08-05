import { getProductById } from '@/utils/getProducts';
import EditInput from './EditInput';
import ProductEditPage from './ProductEditPage';
import { notFound } from 'next/navigation';

export default async function AdminProductEditServer({ params }: { params: Promise<{ id: string }> }) {
  const awaitedParams = await params;
  const res = await getProductById(Number(awaitedParams.id));

  if (!res.ok || !res.item || res.item.active === false) {
    notFound();
  }

  return (
    <>
      <div className="max-w-[800px] mx-auto px-4 pt-4 bg-white">
        <EditInput product={res.item} />
      </div>
      <div className="w-full max-w-[800px] mx-auto">
        <ProductEditPage product={res.item} />
      </div>
    </>
  );
}

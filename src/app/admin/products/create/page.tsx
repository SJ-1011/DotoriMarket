'use client';

import ProductCreateForm from './ProductCreateForm';
import { useLoginStore } from '@/stores/loginStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminProductPage() {
  const { isLogin, isAdmin } = useLoginStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLogin || !isAdmin) {
      router.push('/');
    }
  }, [isLogin, isAdmin, router]);

  return (
    <div className="max-w-2xl w-full px-4 py-12 mx-auto">
      <h1 className="text-xl font-bold mb-6">상품 등록</h1>
      <ProductCreateForm />
    </div>
  );
}

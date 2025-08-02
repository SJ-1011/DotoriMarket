'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginStore } from '@/stores/loginStore';
import { addProduct } from '@/data/actions/addProduct';
import CategorySelector from '@/app/admin/products/components/CategorySelector';

interface FormData {
  name: string;
  price: number;
  shippingFees: number;
  quantity: number;
  mainImage?: File;
  categoryMain?: string;
  categorySub?: string;
}

export default function ProductCreateForm() {
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<FormData>({
    name: '',
    price: 0,
    shippingFees: 3000,
    quantity: 1,
    mainImage: undefined,
    categoryMain: 'PC01',
    categorySub: '',
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 이미지 선택 시 미리보기 URL 생성
  useEffect(() => {
    if (data.mainImage) {
      const url = URL.createObjectURL(data.mainImage);
      setPreviewUrl(url);

      // 컴포넌트 언마운트 시 URL 객체 해제
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [data.mainImage]);

  const router = useRouter();
  const { user } = useLoginStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'mainImage' && files && files.length > 0) {
      setData(prev => ({ ...prev, mainImage: files[0] }));
      return;
    }

    setData(prev => ({
      ...prev,
      [name]: ['price', 'shippingFees', 'quantity'].includes(name) ? Number(value) : value,
    }));
  };

  const handleCategoryChange = (main: string, sub: string) => {
    setData(prev => ({
      ...prev,
      categoryMain: main,
      categorySub: sub,
    }));
  };

  const handleSave = async () => {
    if (!user?.token.accessToken) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!data.mainImage) {
      alert('대표 이미지를 선택해주세요.');
      return;
    }
    if (!data.categoryMain || !data.categorySub) {
      alert('카테고리를 선택해주세요.');
      return;
    }

    setSaving(true);

    try {
      const res = await addProduct(
        {
          name: data.name,
          price: data.price,
          quantity: data.quantity,
          content: '상품 설명이 없습니다.',
          shippingFees: data.shippingFees,
          extra: {
            category: [data.categoryMain, data.categorySub],
          },
          mainImage: data.mainImage,
        },
        user.token.accessToken,
      );

      if (res.ok) {
        router.push(`/products/${res.item._id}`);
      } else {
        alert(res.message);
      }
    } catch (error) {
      alert('상품 등록 중 오류가 발생했습니다.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold mb-2">상품명</label>
        <input name="name" value={data.name} onChange={handleChange} className="w-full border px-4 py-2 rounded" placeholder="상품명을 입력하세요" />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">판매가 (원)</label>
        <input name="price" type="number" value={data.price} onChange={handleChange} className="w-full border px-4 py-2 rounded" min={0} />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">배송비 (원)</label>
        <input name="shippingFees" type="number" value={data.shippingFees} onChange={handleChange} className="w-full border px-4 py-2 rounded" min={0} />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">카테고리</label>
        <CategorySelector initialMain={data.categoryMain} initialSub={data.categorySub} onChange={handleCategoryChange} />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">수량</label>
        <input name="quantity" type="number" value={data.quantity} onChange={handleChange} className="w-full border px-4 py-2 rounded" min={1} />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">대표 이미지</label>
        <input type="file" name="mainImage" accept="image/*" onChange={handleChange} className="w-full" />
        {previewUrl && <img src={previewUrl} alt="대표 이미지 미리보기" className="mt-2 max-h-48 object-contain border rounded" />}
      </div>

      <button onClick={handleSave} disabled={saving} className="w-full py-3 bg-primary text-white rounded-md font-medium hover:bg-primary-dark disabled:opacity-50">
        {saving ? '저장 중...' : '저장하기'}
      </button>
    </div>
  );
}

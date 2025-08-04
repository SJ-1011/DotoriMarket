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

// 카테고리 이름을 코드로 변환하는 매핑
const CATEGORY_NAME_TO_CODE: Record<string, Record<string, string>> = {
  PC01: {
    '스튜디오 지브리': '01',
    '디즈니/픽사': '02',
    산리오: '03',
    미피: '04',
    핑구: '05',
    '짱구는 못말려': '06',
    치이카와: '07',
    스누피: '08',
  },
  PC03: {
    필기류: '01',
    스티커: '02',
    마스킹테이프: '03',
    '다이어리/달력': '04',
    '포스터/엽서': '05',
    '메모지/노트': '06',
  },
  PC04: {
    키링: '01',
    '미용&악세사리': '02',
  },
};

function convertSubCategoryToCode(bigCategory: string, smallCategory: string): string {
  const categoryMap = CATEGORY_NAME_TO_CODE[bigCategory];
  if (!categoryMap) return smallCategory;

  const code = categoryMap[smallCategory];
  if (code) {
    return `${bigCategory}${code}`;
  }

  return smallCategory;
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

  useEffect(() => {
    if (data.mainImage) {
      const url = URL.createObjectURL(data.mainImage);
      setPreviewUrl(url);
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

    if (!data.name.trim() || !data.price || !data.shippingFees || !data.quantity || !data.mainImage || !data.categoryMain || !data.categorySub) {
      alert('모든 필드를 입력해 주세요.');
      return;
    }

    setSaving(true);

    try {
      const convertedSubCategory = convertSubCategoryToCode(data.categoryMain, data.categorySub);

      const res = await addProduct(
        {
          name: data.name,
          price: data.price,
          quantity: data.quantity,
          content: '상품 설명이 없습니다.',
          shippingFees: data.shippingFees,
          extra: {
            category: [data.categoryMain, convertedSubCategory],
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
        <input name="name" value={data.name} onChange={handleChange} required className="w-full border px-4 py-2 rounded" placeholder="상품명을 입력하세요" />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">판매가 (원)</label>
        <input name="price" type="number" value={data.price} onChange={handleChange} required className="w-full border px-4 py-2 rounded" min={0} />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">배송비 (원)</label>
        <input name="shippingFees" type="number" value={data.shippingFees} onChange={handleChange} required className="w-full border px-4 py-2 rounded" min={0} />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">카테고리</label>
        <CategorySelector initialMain={data.categoryMain} initialSub={data.categorySub} onChange={handleCategoryChange} />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">수량</label>
        <input name="quantity" type="number" value={data.quantity} onChange={handleChange} required className="w-full border px-4 py-2 rounded" min={1} />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">대표 이미지</label>
        <input type="file" name="mainImage" accept="image/*" onChange={handleChange} required className="w-full" />
        {previewUrl && <img src={previewUrl} alt="대표 이미지 미리보기" className="mt-2 max-h-48 object-contain border rounded" />}
      </div>

      <button onClick={handleSave} disabled={saving} className="w-full py-3 bg-primary text-white rounded-md font-medium hover:bg-primary-dark disabled:opacity-50">
        {saving ? '저장 중...' : '저장하기'}
      </button>
    </div>
  );
}

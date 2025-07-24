'use client';

import { createPaymentNotification } from '@/data/actions/addNotification';
import { useLoginStore } from '@/stores/loginStore';
import { Product } from '@/types/Product';
import { getProducts } from '@/utils/getProducts';
import Image from 'next/image';
import { useEffect, useState } from 'react';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function PayTest() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const user = useLoginStore(state => state.user);

  // 상품 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        if (res.ok) {
          setProducts(res.item);
        }
      } catch {
        console.log('실패');
      }
    };

    fetchProducts();
  }, []);

  const payment = async (item: Product) => {
    if (!user) return;

    const image = {
      path: item.mainImages[0].path,
      name: item.mainImages[0].name,
      originalname: item.mainImages[0].originalname,
    };

    const res = await createPaymentNotification(item.name, image, user);

    if (res.ok) console.log('알림 등록 성공!', res);
    else console.log('실패 ㅠㅠ');
  };
  return (
    <>
      <ul>
        {products?.map((item, index) => {
          return (
            <li key={index}>
              <Image src={`${API_URL}/${item.mainImages[0].path}`} alt="상품" width={200} height={200} />
              <p>{item.name}</p>
              <button type="button" onClick={() => payment(item)}>
                결제하기
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}

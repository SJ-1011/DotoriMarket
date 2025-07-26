'use client';

import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useLoginStore } from '@/stores/loginStore';
import { useSearchParams } from 'next/navigation';
import { getCarts } from '@/utils/getCarts';
import { getUserAddress } from '@/utils/getUsers';
import OrderClient from './OrderClient';
import type { CartItem } from '@/types/Cart';
import type { OrderForm } from '@/types/Order';
import { getProductById } from '@/utils/getProducts';

export default function OrderWrapper() {
  const { user } = useLoginStore();
  const token = user?.token?.accessToken;
  const searchParams = useSearchParams();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const methods = useForm<OrderForm>({
    defaultValues: {
      products: [],
      address: { name: '', value: '' },
      memo: '',
    },
  });
  const [userInfo, setUserInfo] = useState({
    name: '',
    recipient: '',
    phone: '',
    address: '',
  });
  const [cartCost, setCartCost] = useState({
    products: 0,
    shippingFees: 0,
    discount: { products: 0, shippingFees: 0 },
    total: 0,
  });

  useEffect(() => {
    if (!token || !user?._id) return;

    const fetchData = async () => {
      try {
        const idsParam = searchParams.get('ids');
        const productId = searchParams.get('productId');
        const qty = Number(searchParams.get('qty') || 1);
        if (idsParam) {
          // 장바구니 주문
          const selectedIds = idsParam.split(',').map(Number);
          const cartRes = await getCarts(token);
          const selectedItems = cartRes.item.filter(item => selectedIds.includes(item._id));

          setCartItems(selectedItems);
          setCartCost(cartRes.cost);
          methods.setValue(
            'products',
            selectedItems.map(item => ({ _id: item._id, quantity: item.quantity })),
          );
        } else if (productId) {
          // 바로 구매
          const productRes = await getProductById(productId);
          if (!productRes.ok) {
            console.error('상품 정보를 불러올 수 없습니다.');
            return;
          }

          const product = productRes.item;

          const tempItem: CartItem = {
            _id: -1,
            quantity: qty,
            product: {
              ...product,
              image: product.mainImages?.[0] ?? { path: '/default.png', name: '', originalname: '' },
            },
          };

          setCartItems([tempItem]);
          setCartCost({
            products: product.price * qty,
            shippingFees: product.shippingFees,
            discount: { products: 0, shippingFees: 0 },
            total: product.price * qty + product.shippingFees,
          });
          methods.setValue('products', [{ _id: product._id, quantity: qty }]);
        }

        // 유저 주소 공통 로드
        const userRes = await getUserAddress(user._id, token);
        if (userRes.ok && userRes.item.length > 0) {
          const defaultAddress = userRes.item.find(a => a.isDefault) ?? userRes.item[0];
          setUserInfo({
            name: defaultAddress.name,
            recipient: defaultAddress.recipient,
            phone: user.phone,
            address: defaultAddress.value,
          });
          methods.setValue('address', {
            name: defaultAddress.name,
            value: defaultAddress.value,
          });
        }
      } catch (err) {
        console.error('주문 데이터 로딩 실패:', err);
      }
    };

    fetchData();
  }, [token, user, searchParams, methods]);

  return (
    <FormProvider {...methods}>
      <OrderClient cartItems={cartItems} cartCost={cartCost} userInfo={userInfo} />
    </FormProvider>
  );
}

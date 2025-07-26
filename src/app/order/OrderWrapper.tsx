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
        if (!idsParam) return;
        const selectedIds = idsParam.split(',').map(Number);

        const cartRes = await getCarts(token);
        const selectedItems = cartRes.item.filter(item => selectedIds.includes(item._id));
        setCartItems(selectedItems);

        setCartCost({
          products: cartRes.cost.products,
          shippingFees: cartRes.cost.shippingFees,
          discount: { products: cartRes.cost.discount.products, shippingFees: cartRes.cost.discount.shippingFees },
          total: cartRes.cost.total,
        });

        methods.setValue('memo', '');
        methods.setValue(
          'products',
          selectedItems.map(item => ({ _id: item._id, quantity: item.quantity })),
        );

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

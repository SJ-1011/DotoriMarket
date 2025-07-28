'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getCarts } from '@/utils/getCarts';
import { patchCartQuantity } from '@/data/actions/patchCartQuantity';
import { deleteCartItem } from '@/data/actions/deleteCartItem';
import { deleteCartItems } from '@/data/actions/deleteCartItems';
import { useCartQuantityStore } from '@/stores/cartQuantityStore';
import { useLoginStore } from '@/stores/loginStore';
import { useRouter } from 'next/navigation';
import Loading from '../loading';
import CartTable from './CartTable';
import CartMobileList from './CartMobileList';
import CartSummary from './CartSummary';
import CartButtons from './CartButtons';
import { CartResponse } from '@/types/Cart';

export default function CartWrapper() {
  const [cartData, setCartData] = useState<CartResponse | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const previousQty = useRef<Record<number, number>>({});
  const debounceTimers = useRef<Record<number, NodeJS.Timeout | null>>({});

  const { user } = useLoginStore();
  const cartStore = useCartQuantityStore();
  const router = useRouter();

  const getImageUrl = (path: string) => `${process.env.NEXT_PUBLIC_API_URL}/${path}`;

  // 선택된 상품 총합 계산
  const selectedPriceInfo = useMemo(() => {
    if (!cartData) return { productOnlyTotal: 0, shippingFee: 0, total: 0 };
    const validItems = cartData.item.filter(i => selectedItems.includes(i._id) && i.product.quantity > 0);
    const productOnlyTotal = validItems.reduce((sum, item) => sum + item.product.price * cartStore.getQuantity(item._id), 0);
    const shippingFee = validItems.length > 0 ? cartStore.shippingFee : 0;
    return { productOnlyTotal, shippingFee, total: productOnlyTotal + shippingFee };
  }, [cartData, selectedItems, cartStore.quantities]);

  // 장바구니 데이터 초기 fetch + Zustand 초기화
  useEffect(() => {
    if (!user?.token?.accessToken) return;
    (async () => {
      const data = await getCarts(user.token.accessToken);
      setCartData(data);
      cartStore.resetQuantities(Object.fromEntries(data.item.map(p => [p._id, p.quantity])));
      cartStore.setShippingFee(data.cost.shippingFees);
    })();
  }, [user?.token?.accessToken]);

  // 디바운싱 수량 변경 API 호출
  useEffect(() => {
    if (!cartData || !user?.token?.accessToken) return;
    cartData.item.forEach(product => {
      const productId = product._id;
      const currentQty = cartStore.getQuantity(productId);
      const prevQty = previousQty.current[productId];
      if (prevQty === currentQty) return;
      if (debounceTimers.current[productId]) clearTimeout(debounceTimers.current[productId]!);

      debounceTimers.current[productId] = setTimeout(async () => {
        try {
          await patchCartQuantity(productId, currentQty, user.token.accessToken);
          previousQty.current[productId] = currentQty;
        } catch {
          cartStore.setQuantity(productId, prevQty);
        }
      }, 300);
    });
  }, [cartStore.quantities]);

  // 핸들러들
  const increaseQty = (id: number, stock: number, buyQty = 0) => {
    const currentQty = cartStore.getQuantity(id);
    const maxQty = stock - buyQty;
    if (currentQty >= maxQty) {
      alert(`최대 ${maxQty}개까지 구매 가능합니다.`);
      return;
    }
    cartStore.setQuantity(id, currentQty + 1);
  };

  const decreaseQty = (id: number) => {
    const currentQty = cartStore.getQuantity(id);
    if (currentQty <= 1) return;
    cartStore.setQuantity(id, currentQty - 1);
  };

  const toggleAll = () => {
    if (!cartData) return;
    const availableItems = cartData.item.filter(i => i.product.quantity > 0);
    const availableIds = availableItems.map(i => i._id);
    const isAllSelected = availableIds.every(id => selectedItems.includes(id));
    setSelectedItems(isAllSelected ? [] : [...new Set([...selectedItems, ...availableIds])]);
  };

  const toggleItem = (id: number) => {
    setSelectedItems(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));
  };

  const handleDeleteItem = async (id: number) => {
    if (!user?.token?.accessToken) return;
    try {
      await deleteCartItem(id, user.token.accessToken);
      setCartData(prev => (prev ? { ...prev, item: prev.item.filter(i => i._id !== id) } : null));
      cartStore.removeQuantity(id);
      setSelectedItems(prev => prev.filter(i => i !== id));
    } catch (err) {
      console.error('상품 삭제 중 오류:', err);
    }
  };

  const handleDeleteSelected = async () => {
    if (!user?.token?.accessToken || selectedItems.length === 0) return;
    try {
      await deleteCartItems(selectedItems, user.token.accessToken);
      setCartData(prev => (prev ? { ...prev, item: prev.item.filter(i => !selectedItems.includes(i._id)) } : null));
      cartStore.removeQuantities(selectedItems);
      setSelectedItems([]);
    } catch (err) {
      console.error('선택된 상품 삭제 중 오류:', err);
    }
  };

  const handlePurchase = () => {
    if (selectedItems.length === 0) {
      alert('구매할 상품을 선택해주세요.');
      return;
    }
    router.push(`/order?ids=${selectedItems.join(',')}`);
  };

  // 로딩 처리
  if (!cartData) return <Loading />;

  // 장바구니가 비어있을 경우
  if (cartData.item.length === 0) {
    return (
      <div className="p-10 max-w-[900px] mx-auto text-center text-gray-500 text-base sm:text-lg">
        <p>장바구니에 등록된 상품이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-[900px] mx-auto">
      <CartTable items={cartData.item} selectedItems={selectedItems} toggleItem={toggleItem} toggleAll={toggleAll} increaseQty={increaseQty} decreaseQty={decreaseQty} handleDeleteItem={handleDeleteItem} getQuantity={cartStore.getQuantity} getImageUrl={getImageUrl} />
      <CartButtons handleDeleteSelected={handleDeleteSelected} />
      <CartMobileList items={cartData.item} selectedItems={selectedItems} toggleItem={toggleItem} increaseQty={increaseQty} decreaseQty={decreaseQty} handleDeleteItem={handleDeleteItem} getQuantity={cartStore.getQuantity} getImageUrl={getImageUrl} />
      <CartSummary productOnlyTotal={selectedPriceInfo.productOnlyTotal} shippingFee={selectedPriceInfo.shippingFee} total={selectedPriceInfo.total} handlePurchase={handlePurchase} />
    </div>
  );
}

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getCarts } from '@/utils/getCarts';
import { patchCartQuantity } from '@/data/actions/patchCartQuantity';
import type { CartResponse } from '@/types/Cart';
import { useCartQuantityStore } from '@/stores/cartQuantityStore';
import { useLoginStore } from '@/stores/loginStore';
import Image from 'next/image';
import Loading from '../loading';
import Breadcrumb from '@/components/common/Breadcrumb';
import { deleteCartItem } from '@/data/actions/deleteCartItem';
import { deleteCartItems } from '@/data/actions/deleteCartItems';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const [cartData, setCartData] = useState<CartResponse | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const debounceTimers = useRef<Record<number, NodeJS.Timeout | null>>({});
  const previousQty = useRef<Record<number, number>>({});
  const { user } = useLoginStore();
  const getImageUrl = (path: string) => `${process.env.NEXT_PUBLIC_API_URL}/${path}`;
  const cartStore = useCartQuantityStore();
  const router = useRouter();
  const priceTable = useMemo(() => {
    if (!cartData?.item?.length) return {};

    return Object.fromEntries(cartData.item.filter(product => product.product.quantity > 0).map(product => [product._id, product.product.price]));
  }, [cartData]);
  const total = cartStore.getTotal(priceTable);
  const shippingFee = cartStore.shippingFee;
  const productOnlyTotal = total - shippingFee;

  const increaseQty = (id: number, stock: number) => {
    const currentQty = cartStore.getQuantity(id);
    if (currentQty >= stock) {
      alert(`최대 ${stock}개까지 구매 가능합니다.`);
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
    if (selectedItems.length === cartData!.item.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartData!.item.map(item => item._id));
    }
  };

  const toggleItem = (id: number) => {
    setSelectedItems(prev => (prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]));
  };

  const handleDeleteItem = async (id: number) => {
    const token = user?.token?.accessToken;
    if (!token) return;

    try {
      await deleteCartItem(id, token);
      setCartData(prev => (prev ? { ...prev, item: prev.item.filter(item => item._id !== id) } : null));
      cartStore.removeQuantity(id);
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    } catch (error) {
      console.error(`상품(id: ${id}) 삭제 중 오류 발생:`, error);
    }
  };

  // 선택 삭제
  const handleDeleteSelected = async () => {
    const token = user?.token?.accessToken;
    if (!token || selectedItems.length === 0) return;

    try {
      await deleteCartItems(selectedItems, token);

      setCartData(prev =>
        prev
          ? {
              ...prev,
              item: prev.item.filter(item => !selectedItems.includes(item._id)),
            }
          : null,
      );

      cartStore.removeQuantities(selectedItems);
      setSelectedItems([]);
    } catch (error) {
      console.error('선택된 상품 삭제 중 오류 발생:', error);
    }
  };

  // 구매하기 버튼 클릭 시 실행
  const handlePurchase = () => {
    if (selectedItems.length === 0) {
      alert('구매할 상품을 선택해주세요.');
      return;
    }

    const query = selectedItems.join(',');
    router.push(`/order?ids=${query}`);
  };

  useEffect(() => {
    if (!user?.token?.accessToken) return;

    const fetchAndSyncCart = async () => {
      const data = await getCarts(user.token.accessToken);
      setCartData(data);

      // 수량 초기화
      const initialQuantities = Object.fromEntries(data.item.map(product => [product._id, product.quantity]));
      cartStore.resetQuantities(initialQuantities);

      // 배송비 저장
      cartStore.setShippingFee(data.cost.shippingFees);
    };

    fetchAndSyncCart();
  }, [user?.token?.accessToken]);

  useEffect(() => {
    if (!cartData || !user?.token?.accessToken) return;

    cartData.item.forEach(product => {
      const currentQty = cartStore.getQuantity(product._id);
      if (previousQty.current[product._id] === currentQty) return;

      if (debounceTimers.current[product._id]) {
        clearTimeout(debounceTimers.current[product._id]!);
      }

      debounceTimers.current[product._id] = setTimeout(async () => {
        try {
          await patchCartQuantity(product._id, currentQty, user.token.accessToken);
          previousQty.current[product._id] = currentQty;
        } catch {
          cartStore.setQuantity(product._id, previousQty.current[product._id]);
        }
      }, 300);
    });
  }, [cartStore.quantities]);

  if (!cartData) return <Loading />;

  return (
    <div className="p-4">
      <div className="max-w-[900px] mx-auto">
        <div className="mb-4">
          <Breadcrumb items={[{ label: '홈', href: '/' }, { label: '장바구니' }]} />
        </div>
        {cartData.item.length === 0 ? (
          <div className="text-center text-gray-500 py-24 text-base sm:text-lg">장바구니에 담은 상품이 없습니다.</div>
        ) : (
          <>
            {/* 헤더 (데스크탑 전용 테이블) */}
            <table className="hidden sm:table w-full text-sm border-y">
              <thead className="text-sm lg:text-base text-dark-gray">
                <tr className=" border-b border-gray-200">
                  <th className="text-center py-2 px-2 lg:py-4">
                    <input type="checkbox" checked={selectedItems.length === cartData.item.length} onChange={toggleAll} />
                  </th>
                  <th className="text-center py-2 px-2 lg:py-4">상품 정보</th>
                  <th className="text-center py-2 px-2 lg:py-4">수량</th>
                  <th className="text-center py-2 px-2 lg:py-4">주문 금액</th>
                  <th className="text-center py-2 px-2 lg:py-4">배송비</th>
                  <th className="text-center py-2 px-2 lg:py-4">삭제</th>
                </tr>
              </thead>
              <tbody>
                {cartData.item.map(product => (
                  <tr key={product._id} className="text-center text-sm lg:text-base border-b py-4 border-gray-200">
                    <td>
                      <input type="checkbox" checked={selectedItems.includes(product._id)} onChange={() => toggleItem(product._id)} />
                    </td>
                    <td className="text-left border-r border-gray-200">
                      <div className="flex items-center gap-4 py-4 lg:py-6 cursor-pointer" onClick={() => router.push(`/products/${product.product._id}`)}>
                        <Image src={getImageUrl(product.product.image.path)} alt={product.product.name} width={80} height={80} className="rounded-md" />
                        <div>
                          <div className="font-semibold">{product.product.name}</div>
                          <div className="text-gray-500 text-sm">{product.product.price.toLocaleString()}원</div>
                        </div>
                      </div>
                    </td>
                    <td className="border-r border-gray-200">
                      {product.product.quantity === 0 ? (
                        <div className="text-red-500 font-semibold text-center">품절</div>
                      ) : (
                        <div className="flex items-center border divide-x border-gray justify-center w-fit mx-auto">
                          <button onClick={() => decreaseQty(product._id)} className="px-3 py-1 text-base cursor-pointer">
                            -
                          </button>
                          <span className="px-3 py-1 text-base">{cartStore.getQuantity(product._id)}</span>
                          <button onClick={() => increaseQty(product._id, product.product.quantity)} className="px-3 py-1 text-base cursor-pointer">
                            +
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="border-r border-gray-200">{(product.product.price * cartStore.getQuantity(product._id)).toLocaleString()}원</td>
                    <td className="border-r border-gray-200">{shippingFee.toLocaleString()}원</td>
                    <td>
                      <button onClick={() => handleDeleteItem(product._id)} className="text-sm text-gray hover:text-red cursor-pointer">
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* 선택상품 삭제 버튼 */}
            <div className="flex justify-between items-center py-2 sm:mt-4 lg:mt-8 ">
              <button onClick={handleDeleteSelected} className="border border-black px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base hover:bg-black hover:text-white transition-colors cursor-pointer">
                선택상품 삭제
              </button>

              <span className="hidden sm:block text-xs sm:text-sm text-gray-600">장바구니는 최대 10개의 상품을 담을 수 있습니다.</span>
            </div>

            {/* 모바일 카드형 */}
            <div className="flex flex-col sm:hidden">
              {cartData.item.map(product => (
                <div key={product._id} className="py-4 border-t border-dark-gray first:border-t-0 last:border-b last:border-dark-gray">
                  <div className="mb-2">
                    <input type="checkbox" checked={selectedItems.includes(product._id)} onChange={() => toggleItem(product._id)} className="accent-black" />
                  </div>

                  {product.product.quantity === 0 ? (
                    <div className="flex items-start gap-4">
                      <Image src={getImageUrl(product.product.image.path)} alt={product.product.name} width={80} height={80} className="rounded-sm cursor-pointer" onClick={() => router.push(`/products/${product.product._id}`)} />
                      <div className="flex flex-col flex-1 justify-between">
                        <div className="flex justify-between items-start">
                          <div className="font-semibold text-sm cursor-pointer" onClick={() => router.push(`/products/${product.product._id}`)}>
                            {product.product.name}
                          </div>
                          <button onClick={() => handleDeleteItem(product._id)} className="text-xs border border-gray px-2 py-1 text-gray hover:text-red hover:border-red cursor-pointer">
                            삭제
                          </button>
                        </div>
                        <div className="text-red text-xs mt-1">품절된 상품입니다</div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex items-start">
                          <button className="cursor-pointer" onClick={() => router.push(`/products/${product.product._id}`)}>
                            <Image src={getImageUrl(product.product.image.path)} alt={product.product.name} width={80} height={80} className="rounded-sm" />
                          </button>
                        </div>
                        <div className="flex flex-col flex-1 justify-between">
                          <div className="flex justify-between items-center">
                            <button className="cursor-pointer" onClick={() => router.push(`/products/${product.product._id}`)}>
                              <div className="font-semibold text-sm">{product.product.name}</div>
                            </button>
                            <button onClick={() => handleDeleteItem(product._id)} className="text-xs border border-gray px-2 py-1 text-gray hover:text-red hover:border-red cursor-pointer">
                              삭제
                            </button>
                          </div>
                          <div className="text-gray text-xs mt-1">{product.product.price.toLocaleString()}원</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <div className="flex border divide-x border-gray overflow-hidden text-sm">
                          <button onClick={() => decreaseQty(product._id)} className="px-3 py-1 cursor-pointer">
                            -
                          </button>
                          <span className="px-4 py-1">{cartStore.getQuantity(product._id)}</span>
                          <button onClick={() => increaseQty(product._id, product.product.quantity)} className="px-3 py-1 cursor-pointer">
                            +
                          </button>
                        </div>
                        <div className="font-bold text-base">총 {(product.product.price * cartStore.getQuantity(product._id)).toLocaleString()}원</div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* 총 결제 정보 */}
            <div className="my-10 sm:my-15 lg:my-20 font-bold text-dark-gray text-base lg:text-lg">
              <table className="w-full text-center sm:border-t-2 sm:border-b-1">
                <thead className="sm:border-b border-gray-200 sm:text-sm lg:text-base">
                  <tr>
                    <th className="sm:py-2 lg:py-4">총 주문금액</th>
                    <th className="sm:py-2 lg:py-4">총 배송비</th>
                    <th className="sm:py-2 lg:py-4">총 결제금액</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="sm:py-6 lg:py-8">{productOnlyTotal.toLocaleString()}원</td>
                    <td className="sm:py-6 lg:py-8">{shippingFee.toLocaleString()}원</td>
                    <td className="text-red sm:py-6 lg:py-8">{total.toLocaleString()}원</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 구매 버튼 */}
            <div className="mt-8 sm:static fixed bottom-0 left-0 right-0 p-4 z-2 sm:border-none sm:p-0">
              <button onClick={handlePurchase} className="w-full bg-primary text-white py-4 rounded-md text-center">
                <span className="font-bold text-base">{total.toLocaleString()}원 구매하기</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

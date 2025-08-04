import { create } from 'zustand';

interface QuantityState {
  quantities: Record<number, number>; // -> 상품 Id + 상품 수량  -> { id:number , quantity: number}
  shippingFee: number; // 배송비
  setShippingFee: (fee: number) => void; // 배송비 설정
  setQuantity: (id: number, qty: number) => void; // -> 상품 수량 변경
  getQuantity: (id: number) => number; // -> 상품 Id로 수량 조회 하기
  getTotal: (priceMap: Record<number, number>) => number; // -> 상품 Id로 가격 조회 및 총 금액 계산
  resetQuantities: (initial: Record<number, number>) => void; // -> 장바구니 초기 설정 및 초기화
  removeQuantity: (id: number) => void;
  removeQuantities: (ids: number[]) => void;
}

export const useCartQuantityStore = create<QuantityState>((set, get) => ({
  quantities: {},
  shippingFee: 0, // 기본 배송비

  setShippingFee: (fee: number) => set({ shippingFee: fee }),

  setQuantity: (id, qty) =>
    set(state => ({
      quantities: {
        ...state.quantities,
        [id]: qty,
      },
    })),

  getQuantity: id => get().quantities[id] ?? 1,

  getTotal: priceMap => {
    const quantities = get().quantities;
    const shippingFee = get().shippingFee;
    const subtotal = Object.entries(quantities).reduce((sum, [id, qty]) => {
      return sum + (priceMap[Number(id)] ?? 0) * qty;
    }, 0);
    return subtotal + shippingFee;
  },

  resetQuantities: initial => set({ quantities: initial }),

  removeQuantity: id =>
    set(state => {
      const newQuantities = { ...state.quantities };
      delete newQuantities[id];
      return { quantities: newQuantities };
    }),

  removeQuantities: ids =>
    set(state => {
      const newQuantities = { ...state.quantities };
      ids.forEach(id => delete newQuantities[id]);
      return { quantities: newQuantities };
    }),
}));

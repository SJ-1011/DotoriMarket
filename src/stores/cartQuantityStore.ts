import { create } from 'zustand';

interface QuantityState {
  quantities: Record<number, number>; // -> 상품 Id + 상품 수량  -> { id:number , quantity: number}
  setQuantity: (id: number, qty: number) => void; // -> 상품 수량 변경
  getQuantity: (id: number) => number; // -> 상품 Id로 수량 조회 하기
  getTotal: (priceMap: Record<number, number>) => number; // -> 상품 Id로 가격 조회 및 총 금액 계산
  resetQuantities: (initial: Record<number, number>) => void; // -> 장바구니 초기 설정 및 초기화
  removeQuantity: (id: number) => void;
  removeQuantities: (ids: number[]) => void;
}

export const useCartQuantityStore = create<QuantityState>((set, get) => ({
  quantities: {},

  setQuantity: (id, qty) =>
    set(state => ({
      quantities: {
        ...state.quantities,
        [id]: qty,
      },
    })),

  getQuantity: id => get().quantities[id] ?? 1, // -> 상품 수량 없으면 1로 초기값 설정

  getTotal: priceMap => {
    const q = get().quantities;
    return Object.entries(q).reduce((sum, [id, qty]) => {
      return sum + (priceMap[Number(id)] ?? 0) * qty;
    }, 0);
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

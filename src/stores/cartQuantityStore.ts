import { create } from 'zustand';

interface QuantityState {
  quantities: Record<number, number>; // key: cartItem._id
  setQuantity: (id: number, qty: number) => void;
  getQuantity: (id: number) => number;
  getTotal: (priceMap: Record<number, number>) => number;
  resetQuantities: (initial: Record<number, number>) => void;
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

  getQuantity: id => get().quantities[id] ?? 1,

  getTotal: priceMap => {
    const q = get().quantities;
    return Object.entries(q).reduce((sum, [id, qty]) => {
      return sum + (priceMap[Number(id)] ?? 0) * qty;
    }, 0);
  },

  resetQuantities: initial => set({ quantities: initial }),
}));

import { create } from 'zustand';

interface CartBadgeState {
  count: number;
  increase: () => void;
  decrease: (qty: number) => void;
  reset: () => void;
}

export const useCartBadgeStore = create<CartBadgeState>(set => ({
  count: 0,
  increase: () => set(state => ({ count: state.count + 1 })),
  decrease: qty => set(state => ({ count: Math.max(state.count - qty, 0) })),
  reset: () => set({ count: 0 }),
}));

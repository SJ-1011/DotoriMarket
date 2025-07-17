import { LoginUser } from '@/types';
import { create } from 'zustand';

interface LoginStore {
  user: LoginUser | null;
  isLogin: boolean;
  login: (user: LoginUser) => void;
  logout: () => void;
}

export const useLoginStore = create<LoginStore>(set => ({
  user: null,
  isLogin: false,
  login: (user: LoginUser) => set({ user, isLogin: true }),
  logout: () => set({ user: null, isLogin: false }),
}));

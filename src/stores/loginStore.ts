import { LoginUser } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LoginStore {
  user: LoginUser | null;
  isLogin: boolean;
  login: (user: LoginUser) => void;
  logout: () => void;
  isAdmin: boolean;
}

export const useLoginStore = create<LoginStore>()(
  persist(
    set => ({
      user: null,
      isLogin: false,
      isAdmin: false,
      login: (user: LoginUser) =>
        set({
          user,
          isLogin: true,
          isAdmin: user.type === 'admin',
        }),
      logout: () => set({ user: null, isLogin: false, isAdmin: false }),
    }),
    {
      name: 'login-storage',
      partialize: state => ({ user: state.user, isLogin: state.isLogin, isAdmin: state.isAdmin }),
    },
  ),
);

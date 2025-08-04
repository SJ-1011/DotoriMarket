import { LoginUser } from '@/types';
import { getUserById } from '@/utils/getUsers';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LoginStore {
  user: LoginUser | null;
  isLogin: boolean;
  login: (user: LoginUser) => void;
  logout: () => void;
  fetchUser: () => void;
  isAdmin: boolean;
}

export const useLoginStore = create<LoginStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLogin: false,
      fetchUser: async () => {
        const prevUser = get().user;
        if (prevUser) {
          const res = await getUserById(prevUser._id);

          if (res.ok && res.item.image) {
            const newUser = {
              ...prevUser,
              image: res.item.image,
            };
            console.log('새로운 이미지:', newUser);

            set({ user: newUser });
            console.log('새로운 진짜 이미지:', get().user);
          } else if (!res.ok) {
            console.log('안뜬 이유:', res.message);
          } else {
            console.log('사진문제');
          }
        }
      },
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

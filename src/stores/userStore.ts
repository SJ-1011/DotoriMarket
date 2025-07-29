import { User } from '@/types';
import { getUserById } from '@/utils/getUsers';
import { create } from 'zustand';

interface UserState {
  id: number;
  user: User | null;
  setId: (id: number) => void;
  fetchUser: () => Promise<void>;
}

/**
 * 회원 정보를 전역 상태로 관리합니다.
 */
export const useUserStore = create<UserState>((set, get) => ({
  id: 0,
  setId: (id: number) => set({ id }),

  user: null,
  fetchUser: async () => {
    const res = await getUserById(get().id);
    if (res.ok) set({ user: res.item });
  },
}));

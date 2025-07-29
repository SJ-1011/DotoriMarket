'use client';

import { create } from 'zustand';
import { Notification } from '@/types/notification';
import { getUserNotifications } from '@/utils/getNotifications';
import { LoginUser } from '@/types';

interface NotificationState {
  user: LoginUser | null;
  setUser: (user: LoginUser) => void;

  notification: Notification[];
  fetchNotification: () => Promise<void>;

  deleteNotification: () => void;
}

/**
 * 알림 정보를 전역 상태로 가져옵니다.
 */
export const useNotificationStore = create<NotificationState>((set, get) => ({
  user: null,
  setUser: (user: LoginUser) => set({ user }),

  notification: [],

  fetchNotification: async () => {
    const currentUser = get().user;
    if (!currentUser) return;

    const res = await getUserNotifications(currentUser.token.accessToken);
    if (res.ok) {
      set({ notification: res.item });
    }
  },

  deleteNotification: () => {
    set({ notification: [] });
  },
}));

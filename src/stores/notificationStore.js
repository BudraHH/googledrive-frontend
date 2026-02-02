import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
    unreadCount: 0,
    fetchUnreadCount: () => { },
    connect: () => { },
    disconnect: () => { },
}));

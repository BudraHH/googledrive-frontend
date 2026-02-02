import { create } from 'zustand';

export const useActionStore = create((set) => ({
    isLoading: false,
    message: 'Working...',
    actionId: null,

    startAction: (msg = 'Working...') => set({
        isLoading: true,
        message: msg,
        actionId: Date.now()
    }),

    endAction: () => set({ isLoading: false }),
}));

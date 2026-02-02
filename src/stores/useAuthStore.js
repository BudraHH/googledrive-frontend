import { create } from 'zustand';
import authService from '../services/authService';

const useAuthStore = create((set) => ({
    user: null,
    loading: true,
    isSidebarCollapsed: false,

    // Actions
    setLoading: (status) => set({ loading: status }),
    toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
    updateUser: (userData) => set((state) => ({ user: { ...state.user, ...userData } })),

    checkAuth: async () => {
        set({ loading: true });
        try {
            const user = await authService.getProfile();
            set({ user, loading: false });
        } catch (error) {
            set({ user: null, loading: false });
        }
    },

    register: async (userData) => {
        const user = await authService.register(userData);
        set({ user });
        return user;
    },

    login: async (userData) => {
        const user = await authService.login(userData);
        set({ user });
        return user;
    },

    logout: async () => {
        try {
            await authService.logout();
            set({ user: null });
        } catch (error) {
            console.error('Logout error:', error);
            // Even if logout fails on server (e.g. network), we clear local state
            set({ user: null });
        }
    },
}));

export default useAuthStore;

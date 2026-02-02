import { create } from 'zustand';

export const useUploadStore = create((set, get) => ({
    // List of all upload items
    // Structure: { id, name, progress: 0-100, status: 'pending'|'uploading'|'success'|'error', type: 'file', parentName: string }
    uploads: [],

    // UI State
    isExpanded: true,
    isVisible: false, // Widget shows only when there are items

    // Actions
    addUploads: (newItems) => set((state) => ({
        uploads: [...state.uploads, ...newItems],
        isVisible: true,
        isExpanded: true
    })),

    updateUpload: (id, updates) => set((state) => ({
        uploads: state.uploads.map((item) =>
            item.id === id ? { ...item, ...updates } : item
        )
    })),

    updateProgress: (id, progress) => set((state) => ({
        uploads: state.uploads.map((item) =>
            item.id === id ? { ...item, progress, status: progress === 100 ? 'success' : 'uploading' } : item
        )
    })),

    markAsError: (id, error) => set((state) => ({
        uploads: state.uploads.map((item) =>
            item.id === id ? { ...item, status: 'error', error } : item
        )
    })),

    // Remove specific upload (e.g. valid 'x' click)
    removeUpload: (id) => set((state) => {
        const newUploads = state.uploads.filter(item => item.id !== id);
        return {
            uploads: newUploads,
            isVisible: newUploads.length > 0
        };
    }),

    // Clear all completed/errors
    clearCompleted: () => set((state) => {
        const activeUploads = state.uploads.filter(item => item.status === 'pending' || item.status === 'uploading');
        return {
            uploads: activeUploads,
            isVisible: activeUploads.length > 0
        };
    }),

    toggleExpanded: () => set((state) => ({ isExpanded: !state.isExpanded })),
    closeWidget: () => set({ isVisible: false, uploads: [] })
}));

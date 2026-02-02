import { create } from 'zustand';

export const usePreviewStore = create((set) => ({
    previewFile: null,
    setPreviewFile: (file) => set({ previewFile: file }),
    closePreview: () => set({ previewFile: null }),
}));

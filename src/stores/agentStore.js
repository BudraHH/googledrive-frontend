import { create } from 'zustand';

export const useAgentStore = create((set) => ({
    startPolling: () => { },
    stopPolling: () => { },
    getState: () => ({
        startPolling: () => { },
        stopPolling: () => { },
    }),
}));

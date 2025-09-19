import { create } from 'zustand';

export const useActivityStatusStore = create((set) => ({
    activityStatus: null,
    setActivityStatus: (status) => set({ activityStatus: status }),
}));
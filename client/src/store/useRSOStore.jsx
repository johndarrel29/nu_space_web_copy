import { create } from "zustand";

export const selectedRSOStore = create((set) => ({
    selectedRSO: null,
    setSelectedRSO: (rsoId) => set({ selectedRSO: rsoId }),
    clearSelectedRSO: () => set({ selectedRSO: null }),
}));

export const selectedRSOStatusStore = create((set) => ({
    selectedRSOStatus: null,
    setSelectedRSOStatus: (status) => set({ selectedRSOStatus: status }),
    clearSelectedRSOStatus: () => set({ selectedRSOStatus: null }),
}));


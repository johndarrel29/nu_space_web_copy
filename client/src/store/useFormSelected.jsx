import { create } from 'zustand';

const useSelectedFormStore = create((set) => ({
    selectedForm: null,
    setSelectedForm: (form) => set({ selectedForm: form }),
    clearSelectedForm: () => set({ selectedForm: null }),
}));


export default useSelectedFormStore;

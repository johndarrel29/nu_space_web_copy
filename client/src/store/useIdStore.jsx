import { create } from "zustand";

const useDocumentIdStore = create((set) => ({
    documentId: null,
    setId: (id) => set({ documentId: id }),
}));

export default useDocumentIdStore;
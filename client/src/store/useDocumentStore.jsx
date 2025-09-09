import { create } from "zustand";

export const useDocumentStore = create((set) => ({
    documentId: null,
    setDocumentId: (id) => set({ documentId: id }),
}));



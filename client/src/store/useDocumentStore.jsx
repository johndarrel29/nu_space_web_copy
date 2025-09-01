import { create } from "zustand";

const useDocumentStore = create((set) => ({
    documentId: null,
    setDocumentId: (id) => set({ documentId: id }),
}));

export default useDocumentStore
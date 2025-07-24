import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useTokenStore = create(
    persist(
        (set) => ({
            token: null,
            setToken: (token) => set({ token }),
            clearToken: () => set({ token: null }),
        }),
        {
            name: 'auth-token',
            getStorage: () => localStorage,
        }
    )
);

export default useTokenStore;
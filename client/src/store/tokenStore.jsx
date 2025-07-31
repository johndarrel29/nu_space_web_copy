import { create } from 'zustand';
import { persist } from 'zustand/middleware';
const useTokenStore = create(
    persist(
        (set) => ({
            token: localStorage.getItem("token") || null,
            setToken: (token) => {
                localStorage.setItem("token", token);
                set({ token });
            },
            getToken: () => {
                return localStorage.getItem("token");
            }
        }),
        {
            name: 'auth-token',
            getStorage: () => localStorage,
        }
    )
);


export default useTokenStore;
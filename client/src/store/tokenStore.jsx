import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useTokenStore = create(
    persist(
        (set, get) => ({
            token: null,
            setToken: (token) => {
                if (!token) {
                    localStorage.removeItem("token");
                    set({ token: null });
                    return;
                }
                localStorage.setItem("token", token);
                set({ token });
            },
            getToken: () => get().token,
        }),
        {
            name: 'auth-token',
            getStorage: () => localStorage,
            onRehydrateStorage: () => () => {
                const stored = localStorage.getItem('token');
                if (stored) {
                    useTokenStore.setState({ token: stored });
                }
            }
        }
    )
);


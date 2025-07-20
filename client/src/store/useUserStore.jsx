import { create } from 'zustand';
import { useAuth } from '../context/AuthContext';
import { useMemo } from 'react';

// Create a Zustand store for user-related state
const useUserStore = create((set, get) => ({
    additionalUserData: null,
    setAdditionalUserData: (data) => set({ additionalUserData: data }),
}));

// Custom hook that combines AuthContext with derived role states
export default function useUserStoreWithAuth() {
    const { user, isAuthenticated, loading, token, login, logout } = useAuth();
    const { additionalUserData, setAdditionalUserData } = useUserStore();

    // Derive role states from the current user
    const roleStates = useMemo(() => ({
        isUserRSORepresentative: user?.role === "rso_representative",
        isUserAdmin: user?.role === "admin",
        isSuperAdmin: user?.role === "super_admin"
    }), [user?.role]);

    console.log("User role:", user?.role);

    return {
        user,
        isAuthenticated,
        loading,
        token,
        login,
        logout,
        additionalUserData,
        setAdditionalUserData,
        ...roleStates
    };
}

export { useUserStore };
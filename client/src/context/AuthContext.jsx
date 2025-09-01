import { createContext, useContext, useState, useEffect } from "react";
import { QueryClient, useQueryClient } from "@tanstack/react-query";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const queryClient = useQueryClient();



    // Check if user is already authenticated from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);

                if (userData && userData.token) {
                    const tokenPart = userData.token.replace('Bearer ', '');
                    const payload = JSON.parse(atob(tokenPart.split('.')[1]));
                    const expiresIn = payload.exp * 1000 - Date.now();

                    // Check if token is still valid
                    if (payload.exp * 1000 > Date.now()) {
                        // Token still valid
                        setUser(userData);
                        setIsAuthenticated(true);
                    } else {
                        // Token expired
                        console.warn(
                            `Token expired at: ${new Date(payload.exp * 1000).toLocaleString()}`
                        );
                        // Token expired, clear storage
                        localStorage.removeItem("user");
                    }

                    if (expiresIn > 0) {
                        setTimeout(() => {

                            console.log(`Token expires in: ${expiresIn} ms`);
                            logout();
                        }, expiresIn);
                    }
                }
            } catch (error) {
                console.error("Error parsing user data from localStorage:", error);
                localStorage.removeItem("user");
            }
        }
        setLoading(false);
    }, []);




    const login = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
        // localStorage.setItem("token", userData.token);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        queryClient.clear(); // Clear all queries on logout
    };



    console.log("AuthContext user:", user);

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            loading,
            token: user?.token || null,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
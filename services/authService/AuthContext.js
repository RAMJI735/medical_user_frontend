"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { AuthService } from "./authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const data = await AuthService.getMe();
                if (data && data.user) {
                    setUser(data.user);
                }
            } catch (error) {
                console.log("No active session or failed to fetch user info.");
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const logout = async () => {
        try {
            await AuthService.logout();
        } catch (error) {
            console.error("Failed to logout from backend:", error);
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                setLoading,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

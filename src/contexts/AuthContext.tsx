// src/contexts/AuthContext.tsx
import { createContext, useContext, type ReactNode } from "react";
import { useAuth as useAuthHook, type AuthUser } from "../features/auth/hooks/useAuth";

interface AuthContextValue {
    user: AuthUser | null;
    loading: boolean;
    error: string | null;
    register: (email: string, password: string) => Promise<AuthUser | null>;
    login: (email: string, password: string) => Promise<AuthUser | null>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    updatePassword: (password: string) => Promise<AuthUser | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const auth = useAuthHook();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
};

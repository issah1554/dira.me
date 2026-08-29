// src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from "react";
import * as authService from "../services/authService";
import type { AuthUser } from "../services/authService";

export type { AuthUser };

export const useAuth = () => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = authService.subscribeAuth(
            (authUser) => {
                setUser(authUser);
                setLoading(false);
            },
            (error) => {
                setError(error.message);
                setLoading(false);
            }
        );
        return () => unsubscribe();
    }, []);

    const register = useCallback(async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const user = await authService.register(email, password);
            setUser(user);
            return user;
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            setError(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const user = await authService.login(email, password);
            setUser(user);
            return user;
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            setError(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await authService.logout();
            setUser(null);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            setError(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const resetPassword = useCallback(async (email: string) => {
        setLoading(true);
        setError(null);
        try {
            await authService.resetPassword(email);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            setError(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updatePassword = useCallback(async (password: string) => {
        setLoading(true);
        setError(null);
        try {
            const user = await authService.updatePassword(password);
            setUser(user);
            return user;
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            setError(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { user, loading, error, register, login, logout, resetPassword, updatePassword };
};

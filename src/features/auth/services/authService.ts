// src/features/auth/services/authService.ts
import { supabase } from "../../../supabase";
import type { User, Session, AuthChangeEvent } from "@supabase/supabase-js";

export type AuthUser = User & { uid: string };

export const normalizeUser = (user: User | null): AuthUser | null => {
    if (!user) return null;
    return {
        ...user,
        get uid() {
            return user.id;
        },
    };
};

export const register = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });
    if (error) throw error;
    return normalizeUser(data.user);
};

export const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) throw error;
    return normalizeUser(data.user);
};

export const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

export const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) throw error;
};

export const updatePassword = async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    return normalizeUser(data.user);
};

export const getInitialSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
};

export const subscribeAuth = (
    callback: (user: AuthUser | null) => void,
    onError?: (error: Error) => void
) => {
    supabase.auth.getSession().then(({ data: { session }, error }) => {
        if (error) {
            onError?.(error);
        } else {
            callback(normalizeUser(session?.user ?? null));
        }
    }).catch((err) => {
        onError?.(err);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event: AuthChangeEvent, session: Session | null) => {
            callback(normalizeUser(session?.user ?? null));
        }
    );

    return () => {
        subscription.unsubscribe();
    };
};

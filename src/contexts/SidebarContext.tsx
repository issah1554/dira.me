import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

const STORAGE_KEY = "sidebar-state";

type SidebarState = {
    isCollapsed: boolean;
    isPinned: boolean;
};

type SidebarContextType = {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
    isPinned: boolean;
    setIsPinned: (value: boolean) => void;
    togglePin: () => void;
    effectiveCollapsed: boolean;
    mobileOpen: boolean;
    setMobileOpen: (value: boolean) => void;
    closeMobileSidebar: () => void;
    toggleMobileSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

// Helper to get initial state from localStorage
function getInitialState(): SidebarState {
    if (typeof window === "undefined") {
        return { isCollapsed: false, isPinned: true };
    }
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error("Failed to parse sidebar state from localStorage", e);
    }
    // Default: expanded and pinned
    return { isCollapsed: false, isPinned: true };
}

export function SidebarProvider({ children }: { children: ReactNode }) {
    const initialState = getInitialState();

    const [isCollapsed, setIsCollapsed] = useState(initialState.isCollapsed);
    const [isPinned, setIsPinned] = useState(initialState.isPinned);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Persist state to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ isCollapsed, isPinned }));
        } catch (e) {
            console.error("Failed to save sidebar state to localStorage", e);
        }
    }, [isCollapsed, isPinned]);

    const togglePin = () => {
        setIsPinned(prev => {
            const newPinned = !prev;
            if (newPinned) {
                setIsCollapsed(false); // Expand when pinning
            }
            return newPinned;
        });
    };

    const closeMobileSidebar = useCallback(() => {
        setMobileOpen(false);
    }, []);

    const toggleMobileSidebar = useCallback(() => {
        setMobileOpen(prev => !prev);
    }, []);

    // When pinned, always show as expanded
    const effectiveCollapsed = isPinned ? false : isCollapsed;

    return (
        <SidebarContext.Provider
            value={{
                isCollapsed,
                setIsCollapsed,
                isPinned,
                setIsPinned,
                togglePin,
                effectiveCollapsed,
                mobileOpen,
                setMobileOpen,
                closeMobileSidebar,
                toggleMobileSidebar,
            }}
        >
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const ctx = useContext(SidebarContext);
    if (!ctx) throw new Error("useSidebar must be used inside SidebarProvider");
    return ctx;
}

export function useSidebarCollapsed() {
    const ctx = useContext(SidebarContext);
    return ctx?.effectiveCollapsed ?? false;
}

export function useSidebarPin() {
    const ctx = useContext(SidebarContext);
    return {
        isPinned: ctx?.isPinned ?? false,
        togglePin: ctx?.togglePin ?? (() => { }),
    };
}
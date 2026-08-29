// src/contexts/NetworkContext.tsx
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { syncManager } from "../lib/offline/syncManager";
import { useAuth } from "./AuthContext";

interface NetworkContextType {
    isOnline: boolean;
    isSyncing: boolean;
    pendingCount: number;
    lastSyncedAt: Date | null;
    syncNow: () => Promise<void>;
}

const NetworkContext = createContext<NetworkContextType | null>(null);

export function NetworkProvider({ children }: { children: ReactNode }) {
    const [isOnline, setIsOnline] = useState<boolean>(syncManager.isOnline());
    const [isSyncing, setIsSyncing] = useState<boolean>(false);
    const [pendingCount, setPendingCount] = useState<number>(0);
    const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

    const { user } = useAuth();

    const refreshStatus = useCallback(async () => {
        setIsOnline(syncManager.isOnline());
        const count = await syncManager.getPendingQueueCount();
        setPendingCount(count);
        const lastSync = await syncManager.getLastSyncedAt();
        setLastSyncedAt(lastSync);
    }, []);

    const syncNow = useCallback(async () => {
        if (!syncManager.isOnline()) return;
        setIsSyncing(true);
        try {
            await syncManager.syncAll();
        } finally {
            await refreshStatus();
            setIsSyncing(false);
        }
    }, [refreshStatus]);

    useEffect(() => {
        refreshStatus();

        // Initial sync if online and authenticated
        if (user?.uid && syncManager.isOnline()) {
            syncManager.syncAll().then(() => refreshStatus());
        }

        const unsubscribe = syncManager.subscribe((event) => {
            if (event.type === "sync-start") {
                setIsSyncing(true);
            } else if (event.type === "sync-complete") {
                setIsSyncing(false);
                refreshStatus();
            } else if (event.type === "sync-error") {
                setIsSyncing(false);
                refreshStatus();
            } else if (event.type === "queue-changed") {
                refreshStatus();
            } else if (event.type === "online-status-changed") {
                setIsOnline(event.data.online);
                refreshStatus();
            }
        });

        return () => {
            unsubscribe();
        };
    }, [user?.uid, refreshStatus]);

    return (
        <NetworkContext.Provider
            value={{
                isOnline,
                isSyncing,
                pendingCount,
                lastSyncedAt,
                syncNow,
            }}
        >
            {children}
        </NetworkContext.Provider>
    );
}

export function useNetwork() {
    const ctx = useContext(NetworkContext);
    if (!ctx) {
        throw new Error("useNetwork must be used within a NetworkProvider");
    }
    return ctx;
}

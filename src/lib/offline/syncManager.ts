// src/lib/offline/syncManager.ts
import { supabase } from "../../supabase";
import { offlineDb, type SyncQueueItem } from "./offlineDb";

type SyncEventListener = (event: {
    type: "sync-start" | "sync-complete" | "sync-error" | "queue-changed" | "online-status-changed";
    data?: any;
}) => void;

class SyncManager {
    private isSyncing = false;
    private listeners: Set<SyncEventListener> = new Set();
    private checkInterval: any = null;

    constructor() {
        if (typeof window !== "undefined") {
            window.addEventListener("online", () => {
                this.notify({ type: "online-status-changed", data: { online: true } });
                this.syncAll();
            });

            window.addEventListener("offline", () => {
                this.notify({ type: "online-status-changed", data: { online: false } });
            });

            window.addEventListener("focus", () => {
                if (this.isOnline()) {
                    this.syncAll();
                }
            });

            // Periodic sync check every 60 seconds when online
            this.checkInterval = setInterval(() => {
                if (this.isOnline()) {
                    this.syncAll();
                }
            }, 60000);
        }
    }

    public destroy() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }

    public isOnline(): boolean {
        return typeof navigator !== "undefined" ? navigator.onLine : true;
    }

    public subscribe(listener: SyncEventListener): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private notify(event: Parameters<SyncEventListener>[0]) {
        this.listeners.forEach((l) => {
            try {
                l(event);
            } catch (err) {
                console.error("Sync listener error:", err);
            }
        });
    }

    public async getPendingQueueCount(): Promise<number> {
        try {
            return await offlineDb.getQueueCount();
        } catch {
            return 0;
        }
    }

    public async getLastSyncedAt(): Promise<Date | null> {
        try {
            const val = await offlineDb.getMeta("last_synced_at");
            return val ? new Date(val) : null;
        } catch {
            return null;
        }
    }

    /**
     * Main sync routine: processes queue, drains it to Supabase, then refreshes local cache
     */
    public async syncAll(): Promise<{ success: boolean; processed: number; errors: number }> {
        if (this.isSyncing) {
            return { success: true, processed: 0, errors: 0 };
        }

        if (!this.isOnline()) {
            return { success: false, processed: 0, errors: 0 };
        }

        const user = (await supabase.auth.getUser()).data.user;
        if (!user) {
            return { success: false, processed: 0, errors: 0 };
        }

        this.isSyncing = true;
        this.notify({ type: "sync-start" });

        let processed = 0;
        let errors = 0;

        try {
            const queue = await offlineDb.getSyncQueue();

            for (const item of queue) {
                try {
                    await this.processQueueItem(item);
                    await offlineDb.removeSyncQueueItem(item.id);
                    processed++;
                    this.notify({ type: "queue-changed", data: { remaining: queue.length - processed } });
                } catch (itemError: any) {
                    console.error("Failed to sync queue item:", item, itemError);
                    errors++;

                    // If it's a network error, stop the batch and retry when connection recovers
                    if (!this.isOnline() || itemError?.message?.includes("Failed to fetch") || itemError?.status === 0) {
                        break;
                    }
                }
            }

            // If we successfully processed queue items (or had empty queue), pull fresh data to refresh local cache
            if (this.isOnline()) {
                await this.refreshLocalCache(user.id);
                await offlineDb.setMeta("last_synced_at", new Date().toISOString());
            }

            this.notify({
                type: "sync-complete",
                data: { processed, errors, lastSyncedAt: new Date() },
            });

            return { success: errors === 0, processed, errors };
        } catch (globalError) {
            console.error("Global sync failed:", globalError);
            this.notify({ type: "sync-error", data: globalError });
            return { success: false, processed, errors };
        } finally {
            this.isSyncing = false;
        }
    }

    /**
     * Process a single queued mutation item against Supabase
     */
    private async processQueueItem(item: SyncQueueItem): Promise<void> {
        const { table, action, recordId, payload, userId } = item;

        if (action === "insert") {
            const insertPayload = {
                ...payload,
                id: recordId,
                user_id: userId,
            };

            const { error } = await supabase
                .from(table)
                .upsert([insertPayload], { onConflict: "id" });

            if (error) throw error;
        } else if (action === "update") {
            const updatePayload = {
                ...payload,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase
                .from(table)
                .update(updatePayload)
                .eq("id", recordId);

            if (error) throw error;
        } else if (action === "delete") {
            const { error } = await supabase
                .from(table)
                .delete()
                .eq("id", recordId);

            if (error) throw error;
        }
    }

    /**
     * Refreshes all local IndexedDB stores with latest records from Supabase
     */
    public async refreshLocalCache(userId: string): Promise<void> {
        try {
            // 1. Refresh Accounts
            const { data: accountsData, error: accountsErr } = await supabase
                .from("accounts")
                .select("*")
                .eq("user_id", userId);

            if (!accountsErr && accountsData) {
                await offlineDb.clearStore("accounts");
                await offlineDb.putMany("accounts", accountsData);
            }

            // 2. Refresh Parties
            const { data: partiesData, error: partiesErr } = await supabase
                .from("parties")
                .select("*")
                .eq("user_id", userId);

            if (!partiesErr && partiesData) {
                await offlineDb.clearStore("parties");
                await offlineDb.putMany("parties", partiesData);
            }

            // 3. Refresh Transactions
            const { data: txData, error: txErr } = await supabase
                .from("transactions")
                .select("*")
                .order("date", { ascending: false });

            if (!txErr && txData) {
                await offlineDb.clearStore("transactions");
                await offlineDb.putMany("transactions", txData);
            }
        } catch (err) {
            console.error("Error refreshing local cache from Supabase:", err);
        }
    }
}

export const syncManager = new SyncManager();

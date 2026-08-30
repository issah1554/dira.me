// src/lib/offline/syncManager.ts
import { supabase } from "../../supabase";
import { offlineDb, type SyncQueueItem } from "./offlineDb";
import type { RealtimeChannel } from "@supabase/supabase-js";

type SyncEventListener = (event: {
    type: "sync-start" | "sync-complete" | "sync-error" | "queue-changed" | "online-status-changed";
    data?: any;
}) => void;

class SyncManager {
    private isSyncing = false;
    private listeners: Set<SyncEventListener> = new Set();
    private realtimeChannel: RealtimeChannel | null = null;

    constructor() {
        if (typeof window !== "undefined") {
            // Event 1: Browser comes back online
            window.addEventListener("online", () => {
                this.notify({ type: "online-status-changed", data: { online: true } });
                this.syncAll();
            });

            // Event 2: Browser goes offline
            window.addEventListener("offline", () => {
                this.notify({ type: "online-status-changed", data: { online: false } });
            });

            // Event 3: Tab or window visibility state changes to visible / active
            document.addEventListener("visibilitychange", () => {
                if (document.visibilityState === "visible" && this.isOnline()) {
                    this.syncAll();
                }
            });

            // Event 4: Window receives focus
            window.addEventListener("focus", () => {
                if (this.isOnline()) {
                    this.syncAll();
                }
            });

            // Event 5: Auth state changes (user signs in / signs out)
            supabase.auth.onAuthStateChange((event, session) => {
                if (event === "SIGNED_IN" && session?.user) {
                    this.setupRealtimeSubscription(session.user.id);
                    this.syncAll();
                } else if (event === "SIGNED_OUT") {
                    this.teardownRealtimeSubscription();
                }
            });

            // Initial check on load
            supabase.auth.getUser().then(({ data: { user } }) => {
                if (user) {
                    this.setupRealtimeSubscription(user.id);
                }
            });
        }
    }

    /**
     * Set up event-driven Supabase Realtime WebSocket subscription.
     * Triggers sync/cache refresh when changes happen on the database in real time.
     */
    private setupRealtimeSubscription(userId: string) {
        if (this.realtimeChannel) {
            this.teardownRealtimeSubscription();
        }

        this.realtimeChannel = supabase
            .channel(`user-sync-${userId}`)
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "transactions" },
                () => {
                    if (this.isOnline() && !this.isSyncing) {
                        this.refreshLocalCache(userId).then(() => {
                            this.notify({ type: "sync-complete", data: { lastSyncedAt: new Date() } });
                        });
                    }
                }
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "accounts" },
                () => {
                    if (this.isOnline() && !this.isSyncing) {
                        this.refreshLocalCache(userId).then(() => {
                            this.notify({ type: "sync-complete", data: { lastSyncedAt: new Date() } });
                        });
                    }
                }
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "parties" },
                () => {
                    if (this.isOnline() && !this.isSyncing) {
                        this.refreshLocalCache(userId).then(() => {
                            this.notify({ type: "sync-complete", data: { lastSyncedAt: new Date() } });
                        });
                    }
                }
            )
            .subscribe();
    }

    private teardownRealtimeSubscription() {
        if (this.realtimeChannel) {
            supabase.removeChannel(this.realtimeChannel);
            this.realtimeChannel = null;
        }
    }

    public destroy() {
        this.teardownRealtimeSubscription();
        this.listeners.clear();
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
     * Executes when the user performs any mutation (create, edit, delete).
     * If online, displays the syncing indicator, runs the mutation, drains any pending queue,
     * updates last_synced_at, and notifies UI components.
     */
    public async onUserMutation<T>(mutationFn: () => Promise<T>): Promise<T> {
        if (this.isOnline()) {
            this.notify({ type: "sync-start" });
            try {
                const result = await mutationFn();
                const pending = await this.getPendingQueueCount();
                if (pending > 0) {
                    await this.syncAll();
                } else {
                    await offlineDb.setMeta("last_synced_at", new Date().toISOString());
                    this.notify({ type: "sync-complete", data: { lastSyncedAt: new Date() } });
                }
                return result;
            } catch (err) {
                this.notify({ type: "sync-error", data: err });
                throw err;
            }
        } else {
            return await mutationFn();
        }
    }

    /**
     * Main event-driven sync routine: processes queued items, drains them to Supabase, then refreshes local cache
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

            // Refresh local cache with latest data from Supabase
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
        const supabaseTable = table === "categories" ? "transaction_categories" : table;

        if (action === "insert") {
            const insertPayload = {
                ...payload,
                id: recordId,
                user_id: userId,
            };

            const { error } = await supabase
                .from(supabaseTable)
                .upsert([insertPayload], { onConflict: "id" });

            if (error) throw error;
        } else if (action === "update") {
            const updatePayload = {
                ...payload,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase
                .from(supabaseTable)
                .update(updatePayload)
                .eq("id", recordId);

            if (error) throw error;
        } else if (action === "delete") {
            const { error } = await supabase
                .from(supabaseTable)
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

            // 3. Refresh Categories
            const { data: categoriesData, error: categoriesErr } = await supabase
                .from("transaction_categories")
                .select("*")
                .eq("user_id", userId);

            if (!categoriesErr && categoriesData) {
                await offlineDb.clearStore("categories");
                await offlineDb.putMany("categories", categoriesData);
            }

            // 4. Refresh Transaction Types
            const { data: typesData, error: typesErr } = await supabase
                .from("transaction_types")
                .select("*")
                .eq("user_id", userId);

            if (!typesErr && typesData) {
                await offlineDb.clearStore("transaction_types");
                await offlineDb.putMany("transaction_types", typesData);
            }

            // 5. Refresh Transactions
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

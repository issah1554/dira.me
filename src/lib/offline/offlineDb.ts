// src/lib/offline/offlineDb.ts

export type SyncAction = "insert" | "update" | "delete";
export type SyncTable = "accounts" | "transactions" | "parties" | "categories" | "transaction_types";

export interface SyncQueueItem {
    id: string; // unique queue item ID (UUID)
    table: SyncTable;
    action: SyncAction;
    recordId: string;
    payload: any;
    userId: string;
    createdAt: string;
    attempts: number;
    lastError?: string;
}

const DB_NAME = "dira_me_offline_db";
const DB_VERSION = 2;

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve, reject) => {
        if (typeof window === "undefined" || !window.indexedDB) {
            reject(new Error("IndexedDB is not supported in this environment"));
            return;
        }

        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;

            if (!db.objectStoreNames.contains("accounts")) {
                db.createObjectStore("accounts", { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains("transactions")) {
                db.createObjectStore("transactions", { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains("parties")) {
                db.createObjectStore("parties", { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains("categories")) {
                db.createObjectStore("categories", { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains("transaction_types")) {
                db.createObjectStore("transaction_types", { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains("sync_queue")) {
                const queueStore = db.createObjectStore("sync_queue", { keyPath: "id" });
                queueStore.createIndex("createdAt", "createdAt", { unique: false });
                queueStore.createIndex("table", "table", { unique: false });
            }
            if (!db.objectStoreNames.contains("metadata")) {
                db.createObjectStore("metadata", { keyPath: "key" });
            }
        };

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });

    return dbPromise;
}

export const offlineDb = {
    async getAll<T>(storeName: string): Promise<T[]> {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, "readonly");
            const store = tx.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve((request.result || []) as T[]);
            request.onerror = () => reject(request.error);
        });
    },

    async getById<T>(storeName: string, id: string): Promise<T | null> {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, "readonly");
            const store = tx.objectStore(storeName);
            const request = store.get(id);

            request.onsuccess = () => resolve((request.result as T) || null);
            request.onerror = () => reject(request.error);
        });
    },

    async put<T>(storeName: string, value: T): Promise<void> {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, "readwrite");
            const store = tx.objectStore(storeName);
            const request = store.put(value);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    },

    async putMany<T>(storeName: string, values: T[]): Promise<void> {
        if (!values.length) return;
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, "readwrite");
            const store = tx.objectStore(storeName);

            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);

            for (const item of values) {
                store.put(item);
            }
        });
    },

    async deleteItem(storeName: string, id: string): Promise<void> {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, "readwrite");
            const store = tx.objectStore(storeName);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    },

    async clearStore(storeName: string): Promise<void> {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, "readwrite");
            const store = tx.objectStore(storeName);
            const request = store.clear();

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    },

    /* ============================================================
       Sync Queue Operations
       ============================================================ */

    async addToSyncQueue(item: Omit<SyncQueueItem, "id" | "createdAt" | "attempts">): Promise<SyncQueueItem> {
        const queueItem: SyncQueueItem = {
            ...item,
            id: crypto.randomUUID ? crypto.randomUUID() : `queue_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            createdAt: new Date().toISOString(),
            attempts: 0,
        };

        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction("sync_queue", "readwrite");
            const store = tx.objectStore("sync_queue");
            const request = store.put(queueItem);

            request.onsuccess = () => resolve(queueItem);
            request.onerror = () => reject(request.error);
        });
    },

    async getSyncQueue(): Promise<SyncQueueItem[]> {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction("sync_queue", "readonly");
            const store = tx.objectStore("sync_queue");
            const request = store.getAll();

            request.onsuccess = () => {
                const results = (request.result || []) as SyncQueueItem[];
                results.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                resolve(results);
            };
            request.onerror = () => reject(request.error);
        });
    },

    async removeSyncQueueItem(id: string): Promise<void> {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction("sync_queue", "readwrite");
            const store = tx.objectStore("sync_queue");
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    },

    async getQueueCount(): Promise<number> {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction("sync_queue", "readonly");
            const store = tx.objectStore("sync_queue");
            const request = store.count();

            request.onsuccess = () => resolve(request.result || 0);
            request.onerror = () => reject(request.error);
        });
    },

    /* ============================================================
       Metadata Operations
       ============================================================ */

    async setMeta(key: string, value: any): Promise<void> {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction("metadata", "readwrite");
            const store = tx.objectStore("metadata");
            const request = store.put({ key, value, updatedAt: new Date().toISOString() });

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    },

    async getMeta(key: string): Promise<any> {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction("metadata", "readonly");
            const store = tx.objectStore("metadata");
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result ? request.result.value : null);
            request.onerror = () => reject(request.error);
        });
    },
};

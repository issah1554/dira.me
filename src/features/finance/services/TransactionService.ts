// src/features/finance/services/TransactionService.ts
import { supabase } from "../../../supabase";
import type { CurrencyCode } from "../../../types/account";
import type { Database, TransactionType } from "../../../types/database";
import { offlineDb } from "../../../lib/offline/offlineDb";
import { syncManager } from "../../../lib/offline/syncManager";

type TransactionRow = Database["public"]["Tables"]["transactions"]["Row"];
type TransactionUpdate = Database["public"]["Tables"]["transactions"]["Update"];

/* =======================
   Types & Config
======================= */

export const transactionTypeConfig: Record<TransactionType, {
    label: string;
    dc: "dr" | "cr";
    icon: string;
    badge: string;
    color: string;
    description: string;
}> = {
    income: {
        label: "Income",
        dc: "cr",
        icon: "bi-arrow-down-left-circle-fill",
        badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800",
        color: "text-emerald-600 dark:text-emerald-400",
        description: "Money received (Salary, Sales, Grants, Gifts)",
    },
    expense: {
        label: "Expense",
        dc: "dr",
        icon: "bi-arrow-up-right-circle-fill",
        badge: "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-300 dark:border-rose-800",
        color: "text-rose-600 dark:text-rose-400",
        description: "Money spent (Rent, Groceries, Utilities, Supplies)",
    },
    transfer: {
        label: "Transfer",
        dc: "dr",
        icon: "bi-arrow-left-right",
        badge: "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-300 dark:border-blue-800",
        color: "text-blue-600 dark:text-blue-400",
        description: "Moving money between accounts or digital wallets",
    },
    borrow: {
        label: "Borrow",
        dc: "cr",
        icon: "bi-box-arrow-in-down-right",
        badge: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-300 dark:border-amber-800",
        color: "text-amber-600 dark:text-amber-400",
        description: "Money received or borrowed from a party (payable/liability)",
    },
    repayment: {
        label: "Repayment",
        dc: "dr",
        icon: "bi-box-arrow-up-right",
        badge: "bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-300 dark:border-purple-800",
        color: "text-purple-600 dark:text-purple-400",
        description: "Paying back a borrowed amount or debt",
    },
    lend: {
        label: "Lend",
        dc: "dr",
        icon: "bi-box-arrow-up-left",
        badge: "bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300 border border-orange-300 dark:border-orange-800",
        color: "text-orange-600 dark:text-orange-400",
        description: "Money lent out to a person or entity (receivable created)",
    },
    collection: {
        label: "Collection",
        dc: "cr",
        icon: "bi-box-arrow-in-down-left",
        badge: "bg-teal-100 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300 border border-teal-300 dark:border-teal-800",
        color: "text-teal-600 dark:text-teal-400",
        description: "Collecting money that was lent out (receivable recovered)",
    },
};

export type TransactionDTO = {
    date: string;
    amount: number;
    type: TransactionType;
    dc?: "dr" | "cr";
    accountId: string;
    party_id?: string | null;
    currency?: CurrencyCode;
    notes: string;
    category: string;
    status: "completed" | "pending" | "failed";
};

export type TransferDTO = Omit<TransactionDTO, "type" | "dc" | "accountId" | "party_id"> & {
    fromAccount: string;
    toAccount: string;
};

export type Transaction = TransactionDTO & {
    id: string;
    dc: "dr" | "cr";
    userId?: string;
    transferId?: string | null;
};

const rowToTransaction = (row: TransactionRow): Transaction => {
    let dateStr = row.date;
    if (row.date) {
        try {
            dateStr = new Date(row.date).toISOString();
        } catch {
            dateStr = String(row.date);
        }
    }

    const type = (row.type as TransactionType) || (row.dc === "cr" ? "income" : "expense");
    const isCashIn = type === "income" || type === "borrow" || type === "collection";
    const dc = (row.dc as "dr" | "cr") || (isCashIn ? "cr" : "dr");

    return {
        id: String(row.id),
        date: dateStr,
        amount: typeof row.amount === "number" ? row.amount : parseFloat(String(row.amount)) || 0,
        type,
        dc,
        accountId: row.account_id,
        party_id: row.party_id || null,
        transferId: row.transfer_id || null,
        currency: (row.currency as CurrencyCode) || "TZS",
        notes: row.notes || "",
        category: row.category || "",
        status: (row.status as "completed" | "pending" | "failed") || "completed",
        userId: row.user_id,
    };
};

/* =======================
   Service
======================= */

export const TransactionService = {
    async list(): Promise<Transaction[]> {
        // First check IndexedDB cache
        const cached = await offlineDb.getAll<TransactionRow>("transactions");

        if (typeof navigator !== "undefined" && navigator.onLine) {
            try {
                const { data, error } = await supabase
                    .from("transactions")
                    .select("*")
                    .order("date", { ascending: false });

                if (!error && data) {
                    await offlineDb.clearStore("transactions");
                    await offlineDb.putMany("transactions", data);
                    return data.map((row) => rowToTransaction(row as TransactionRow));
                }
            } catch (err) {
                console.warn("Failed to fetch transactions online, using local cache:", err);
            }
        }

        cached.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return cached.map(rowToTransaction);
    },

    async create(payload: TransactionDTO): Promise<Transaction> {
        return await syncManager.onUserMutation(async () => {
            const user = (await supabase.auth.getUser()).data.user;
            const now = new Date().toISOString();
            const txId = crypto.randomUUID ? crypto.randomUUID() : `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

            const type = payload.type || (payload.dc === "cr" ? "income" : "expense");
            const isCashIn = type === "income" || type === "borrow" || type === "collection";
            const dc = payload.dc || (isCashIn ? "cr" : "dr");

            const newRow: TransactionRow = {
                id: txId,
                user_id: user?.id,
                date: payload.date ? new Date(payload.date).toISOString() : now,
                amount: payload.amount,
                type,
                dc,
                account_id: payload.accountId,
                party_id: payload.party_id || null,
                currency: payload.currency || "TZS",
                notes: payload.notes || "",
                category: payload.category || "",
                status: payload.status || "completed",
                created_at: now,
                updated_at: now,
            };

            // 1. Write immediately to local IndexedDB
            await offlineDb.put("transactions", newRow);

            // 2. Sync to Supabase or queue
            if (typeof navigator !== "undefined" && navigator.onLine) {
                try {
                    const { data, error } = await supabase
                        .from("transactions")
                        .insert([newRow])
                        .select()
                        .single();

                    if (error) throw error;
                    if (data) {
                        await offlineDb.put("transactions", data);
                        return rowToTransaction(data as TransactionRow);
                    }
                } catch (err) {
                    console.warn("Online transaction creation failed, queueing:", err);
                    await offlineDb.addToSyncQueue({
                        table: "transactions",
                        action: "insert",
                        recordId: txId,
                        payload: newRow,
                        userId: user?.id || "",
                    });
                }
            } else {
                await offlineDb.addToSyncQueue({
                    table: "transactions",
                    action: "insert",
                    recordId: txId,
                    payload: newRow,
                    userId: user?.id || "",
                });
            }

            return rowToTransaction(newRow);
        });
    },

    async createTransfer(payload: TransferDTO): Promise<Transaction[]> {
        return await syncManager.onUserMutation(async () => {
            const user = (await supabase.auth.getUser()).data.user;
            if (!user) throw new Error("User not authenticated");
            if (payload.fromAccount === payload.toAccount) throw new Error("Transfer accounts must be different");

            const now = new Date().toISOString();
            const transferId = crypto.randomUUID();
            const date = payload.date ? new Date(payload.date).toISOString() : now;
            const base = {
                user_id: user.id,
                date,
                amount: payload.amount,
                type: "transfer" as const,
                party_id: null,
                transfer_id: transferId,
                currency: payload.currency || "TZS",
                notes: payload.notes || "",
                category: payload.category || "Transfer",
                status: payload.status || "completed",
                created_at: now,
                updated_at: now,
            };
            const rows: TransactionRow[] = [
                { ...base, id: crypto.randomUUID(), dc: "dr", account_id: payload.fromAccount },
                { ...base, id: crypto.randomUUID(), dc: "cr", account_id: payload.toAccount },
            ];

            await offlineDb.putMany("transactions", rows);

            if (typeof navigator !== "undefined" && navigator.onLine) {
                try {
                    const { data, error } = await supabase.from("transactions").insert(rows).select();
                    if (error) throw error;
                    if (data) await offlineDb.putMany("transactions", data);
                    return (data || rows).map(row => rowToTransaction(row as TransactionRow));
                } catch (err) {
                    console.warn("Online transfer creation failed, queueing:", err);
                }
            }

            for (const row of rows) {
                await offlineDb.addToSyncQueue({
                    table: "transactions",
                    action: "insert",
                    recordId: row.id,
                    payload: row,
                    userId: user.id,
                });
            }
            return rows.map(rowToTransaction);
        });
    },

    async updateTransfer(transferId: string, payload: TransferDTO): Promise<void> {
        return await syncManager.onUserMutation(async () => {
            if (payload.fromAccount === payload.toAccount) throw new Error("Transfer accounts must be different");

            let rows = (await offlineDb.getAll<TransactionRow>("transactions"))
                .filter(row => row.transfer_id === transferId);

            if (rows.length !== 2 && typeof navigator !== "undefined" && navigator.onLine) {
                const { data, error } = await supabase.from("transactions").select("*").eq("transfer_id", transferId);
                if (error) throw error;
                rows = (data || []) as TransactionRow[];
            }
            if (rows.length !== 2) throw new Error("Linked transfer pair not found");

            const now = new Date().toISOString();
            const date = new Date(payload.date).toISOString();
            const updatedRows = rows.map(row => ({
                ...row,
                date,
                amount: payload.amount,
                type: "transfer" as const,
                dc: row.dc,
                account_id: row.dc === "dr" ? payload.fromAccount : payload.toAccount,
                currency: payload.currency || "TZS",
                notes: payload.notes || "",
                category: payload.category || "Transfer",
                status: payload.status,
                updated_at: now,
            }));

            await offlineDb.putMany("transactions", updatedRows);
            if (typeof navigator !== "undefined" && navigator.onLine) {
                try {
                    const { error } = await supabase.from("transactions").upsert(updatedRows, { onConflict: "id" });
                    if (error) throw error;
                    return;
                } catch (err) {
                    console.warn("Online transfer update failed, queueing:", err);
                }
            }

            for (const row of updatedRows) {
                await offlineDb.addToSyncQueue({
                    table: "transactions",
                    action: "update",
                    recordId: row.id,
                    payload: row,
                    userId: row.user_id || "",
                });
            }
        });
    },

    async removeTransfer(transferId: string): Promise<void> {
        return await syncManager.onUserMutation(async () => {
            const rows = (await offlineDb.getAll<TransactionRow>("transactions"))
                .filter(row => row.transfer_id === transferId);
            for (const row of rows) await offlineDb.deleteItem("transactions", row.id);

            if (typeof navigator !== "undefined" && navigator.onLine) {
                try {
                    const { error } = await supabase.from("transactions").delete().eq("transfer_id", transferId);
                    if (error) throw error;
                    return;
                } catch (err) {
                    console.warn("Online transfer delete failed, queueing:", err);
                }
            }

            for (const row of rows) {
                await offlineDb.addToSyncQueue({
                    table: "transactions",
                    action: "delete",
                    recordId: row.id,
                    payload: {},
                    userId: row.user_id || "",
                });
            }
        });
    },

    async update(id: string, payload: Partial<TransactionDTO>): Promise<void> {
        return await syncManager.onUserMutation(async () => {
            const cached = await offlineDb.getById<TransactionRow>("transactions", id);
            const updateData: TransactionUpdate = {
                updated_at: new Date().toISOString(),
            };

            if (payload.date !== undefined) updateData.date = new Date(payload.date).toISOString();
            if (payload.amount !== undefined) updateData.amount = payload.amount;
            if (payload.type !== undefined) {
                updateData.type = payload.type;
                const isCashIn = payload.type === "income" || payload.type === "borrow" || payload.type === "collection";
                updateData.dc = payload.dc || (isCashIn ? "cr" : "dr");
            } else if (payload.dc !== undefined) {
                updateData.dc = payload.dc;
            }
            if (payload.accountId !== undefined) updateData.account_id = payload.accountId;
            if (payload.party_id !== undefined) updateData.party_id = payload.party_id;
            if (payload.currency !== undefined) updateData.currency = payload.currency;
            if (payload.notes !== undefined) updateData.notes = payload.notes;
            if (payload.category !== undefined) updateData.category = payload.category;
            if (payload.status !== undefined) updateData.status = payload.status;

            // 1. Update IndexedDB immediately
            if (cached) {
                await offlineDb.put("transactions", { ...cached, ...updateData });
            }

            // 2. Sync to Supabase or queue
            if (typeof navigator !== "undefined" && navigator.onLine) {
                try {
                    const { error } = await supabase
                        .from("transactions")
                        .update(updateData)
                        .eq("id", id);

                    if (error) throw error;
                } catch (err) {
                    console.warn("Online transaction update failed, queueing:", err);
                    await offlineDb.addToSyncQueue({
                        table: "transactions",
                        action: "update",
                        recordId: id,
                        payload: updateData,
                        userId: cached?.user_id || "",
                    });
                }
            } else {
                await offlineDb.addToSyncQueue({
                    table: "transactions",
                    action: "update",
                    recordId: id,
                    payload: updateData,
                    userId: cached?.user_id || "",
                });
            }
        });
    },

    async remove(id: string): Promise<void> {
        return await syncManager.onUserMutation(async () => {
            const cached = await offlineDb.getById<TransactionRow>("transactions", id);

            // 1. Remove from IndexedDB immediately
            await offlineDb.deleteItem("transactions", id);

            // 2. Sync to Supabase or queue
            if (typeof navigator !== "undefined" && navigator.onLine) {
                try {
                    const { error } = await supabase
                        .from("transactions")
                        .delete()
                        .eq("id", id);

                    if (error) throw error;
                } catch (err) {
                    console.warn("Online transaction remove failed, queueing:", err);
                    await offlineDb.addToSyncQueue({
                        table: "transactions",
                        action: "delete",
                        recordId: id,
                        payload: {},
                        userId: cached?.user_id || "",
                    });
                }
            } else {
                await offlineDb.addToSyncQueue({
                    table: "transactions",
                    action: "delete",
                    recordId: id,
                    payload: {},
                    userId: cached?.user_id || "",
                });
            }
        });
    },
};

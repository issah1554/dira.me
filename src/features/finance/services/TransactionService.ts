// src/features/finance/services/TransactionService.ts
import { supabase } from "../../../supabase";
import type { CurrencyCode } from "../../../types/account";
import type { Database, TransactionType } from "../../../types/database";
import { offlineDb } from "../../../lib/offline/offlineDb";

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
        description: "Money received or borrowed from a party",
    },
    repayment: {
        label: "Repayment",
        dc: "dr",
        icon: "bi-box-arrow-up-right",
        badge: "bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-300 dark:border-purple-800",
        color: "text-purple-600 dark:text-purple-400",
        description: "Paying back a borrowed amount or debt",
    },
};

export type TransactionDTO = {
    date: string;
    amount: number;
    type: TransactionType;
    dc?: "dr" | "cr";
    account: string;
    party_id?: string | null;
    currency?: CurrencyCode;
    notes: string;
    category: string;
    status: "completed" | "pending" | "failed";
};

export type Transaction = TransactionDTO & {
    id: string;
    dc: "dr" | "cr";
    userId?: string;
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
    const dc = (row.dc as "dr" | "cr") || (type === "income" || type === "borrow" ? "cr" : "dr");

    return {
        id: String(row.id),
        date: dateStr,
        amount: typeof row.amount === "number" ? row.amount : parseFloat(String(row.amount)) || 0,
        type,
        dc,
        account: row.account || "",
        party_id: row.party_id || null,
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
        const user = (await supabase.auth.getUser()).data.user;
        const now = new Date().toISOString();
        const txId = crypto.randomUUID ? crypto.randomUUID() : `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        const type = payload.type || (payload.dc === "cr" ? "income" : "expense");
        const dc = payload.dc || (type === "income" || type === "borrow" ? "cr" : "dr");

        const newRow: TransactionRow = {
            id: txId,
            user_id: user?.id,
            date: payload.date ? new Date(payload.date).toISOString() : now,
            amount: payload.amount,
            type,
            dc,
            account: payload.account,
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
    },

    async update(id: string, payload: Partial<TransactionDTO>): Promise<void> {
        const cached = await offlineDb.getById<TransactionRow>("transactions", id);
        const updateData: TransactionUpdate = {
            updated_at: new Date().toISOString(),
        };

        if (payload.date !== undefined) updateData.date = new Date(payload.date).toISOString();
        if (payload.amount !== undefined) updateData.amount = payload.amount;
        if (payload.type !== undefined) {
            updateData.type = payload.type;
            updateData.dc = payload.dc || (payload.type === "income" || payload.type === "borrow" ? "cr" : "dr");
        } else if (payload.dc !== undefined) {
            updateData.dc = payload.dc;
        }
        if (payload.account !== undefined) updateData.account = payload.account;
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
    },

    async remove(id: string): Promise<void> {
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
    },
};

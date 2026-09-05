// src/features/finance/services/TransactionService.ts
import { supabase } from "../../../supabase";
import type { CurrencyCode } from "../../../types/account";
import type { Database, TransactionType } from "../../../types/database";
import { offlineDb } from "../../../lib/offline/offlineDb";
import { syncManager } from "../../../lib/offline/syncManager";
import { generateUUID } from "../../../lib/uuid";

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
        badge: "bg-success-100 text-success-800 border border-success-300",
        color: "text-success-600",
        description: "Money received (Salary, Sales, Grants, Gifts)",
    },
    expense: {
        label: "Expense",
        dc: "dr",
        icon: "bi-arrow-up-right-circle-fill",
        badge: "bg-danger-100 text-danger-800 border border-danger-300",
        color: "text-danger-600",
        description: "Money spent (Rent, Groceries, Utilities, Supplies)",
    },
    transfer: {
        label: "Transfer",
        dc: "dr",
        icon: "bi-arrow-left-right",
        badge: "bg-primary-100 text-primary-800 border border-primary-300",
        color: "text-primary-600",
        description: "Moving money between accounts or digital wallets",
    },
    borrow: {
        label: "Borrow",
        dc: "cr",
        icon: "bi-box-arrow-in-down-right",
        badge: "bg-accent-100 text-accent-800 border border-accent-300",
        color: "text-accent-600",
        description: "Money received or borrowed from a party (payable/liability)",
    },
    repayment: {
        label: "Repayment",
        dc: "dr",
        icon: "bi-box-arrow-up-right",
        badge: "bg-secondary-100 text-secondary-800 border border-secondary-300",
        color: "text-secondary-600",
        description: "Paying back a borrowed amount or debt",
    },
    lend: {
        label: "Lend",
        dc: "dr",
        icon: "bi-box-arrow-up-left",
        badge: "bg-warning-100 text-warning-800 border border-warning-300",
        color: "text-warning-600",
        description: "Money lent out to a person or entity (receivable created)",
    },
    collection: {
        label: "Collection",
        dc: "cr",
        icon: "bi-box-arrow-in-down-left",
        badge: "bg-info-100 text-info-800 border border-info-300",
        color: "text-info-600",
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
    categoryId?: string | null;
    category_id?: string | null;
    currency?: CurrencyCode;
    notes: string;
    category: string;
    status: "completed" | "pending" | "failed";
};

export type TransferDTO = Omit<TransactionDTO, "type" | "dc" | "accountId" | "party_id"> & {
    fromAccount: string;
    toAccount: string;
    fee?: number;
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
        categoryId: row.category_id || null,
        category_id: row.category_id || null,
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
                    await offlineDb.syncStore("transactions", data);
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
            const txId = generateUUID();

            const type = payload.type || (payload.dc === "cr" ? "income" : "expense");
            const isCashIn = type === "income" || type === "borrow" || type === "collection";
            const dc = payload.dc || (isCashIn ? "cr" : "dr");

            // Resolve category_id: use provided ID or resolve from category name in local DB
            let categoryId = payload.categoryId || payload.category_id || null;
            if (!categoryId && payload.category) {
                const cachedCats = await offlineDb.getAll<{ id: string; name: string }>("categories");
                const matched = cachedCats.find(c => c.name.toLowerCase() === payload.category.trim().toLowerCase());
                if (matched) categoryId = matched.id;
            }

            const newRow: TransactionRow = {
                id: txId,
                user_id: user?.id,
                date: payload.date ? new Date(payload.date).toISOString() : now,
                amount: payload.amount,
                type,
                dc,
                account_id: payload.accountId,
                party_id: payload.party_id || null,
                category_id: categoryId,
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
            const transferId = generateUUID();
            const date = payload.date ? new Date(payload.date).toISOString() : now;

            // Resolve category IDs for Transfer and Fees
            const cachedCats = await offlineDb.getAll<{ id: string; name: string }>("categories");
            const transferCatId = cachedCats.find(c => c.name.toLowerCase() === "transfer")?.id || null;
            const feeCatId = cachedCats.find(c => c.name.toLowerCase() === "fees")?.id || null;

            const base = {
                user_id: user.id,
                date,
                amount: payload.amount,
                type: "transfer" as const,
                party_id: null,
                category_id: transferCatId,
                transfer_id: transferId,
                currency: payload.currency || "TZS",
                notes: payload.notes || "",
                category: payload.category || "Transfer",
                status: payload.status || "completed",
                created_at: now,
                updated_at: now,
            };
            const rows: TransactionRow[] = [
                { ...base, id: generateUUID(), dc: "dr", account_id: payload.fromAccount },
                { ...base, id: generateUUID(), dc: "cr", account_id: payload.toAccount },
            ];

            if (payload.fee && payload.fee > 0) {
                const feeNotes = payload.notes
                    ? `Transfer fee • ${payload.notes}`
                    : "Transfer fee";
                rows.push({
                    id: generateUUID(),
                    user_id: user.id,
                    date,
                    amount: payload.fee,
                    type: "expense",
                    dc: "dr",
                    account_id: payload.fromAccount,
                    party_id: null,
                    category_id: feeCatId,
                    transfer_id: transferId,
                    currency: payload.currency || "TZS",
                    notes: feeNotes,
                    category: "Fees",
                    status: payload.status || "completed",
                    created_at: now,
                    updated_at: now,
                });
            }


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

            if (rows.length < 2 && typeof navigator !== "undefined" && navigator.onLine) {
                const { data, error } = await supabase.from("transactions").select("*").eq("transfer_id", transferId);
                if (error) throw error;
                rows = (data || []) as TransactionRow[];
            }
            if (rows.length < 2) throw new Error("Linked transfer pair not found");

            const fromRow = rows.find(r => r.type === "transfer" && r.dc === "dr")
                || rows.find(r => r.dc === "dr" && r.category !== "Fees");
            const toRow = rows.find(r => r.type === "transfer" && r.dc === "cr")
                || rows.find(r => r.dc === "cr");

            if (!fromRow || !toRow) throw new Error("Linked transfer pair not found");

            const existingFeeRow = rows.find(r => r.id !== fromRow.id && r.id !== toRow.id);

            const now = new Date().toISOString();
            const date = new Date(payload.date).toISOString();

            // Resolve category IDs for Transfer and Fees
            const cachedCats = await offlineDb.getAll<{ id: string; name: string }>("categories");
            const transferCatId = cachedCats.find(c => c.name.toLowerCase() === "transfer")?.id || null;
            const feeCatId = cachedCats.find(c => c.name.toLowerCase() === "fees")?.id || null;

            const updatedFromRow: TransactionRow = {
                ...fromRow,
                date,
                amount: payload.amount,
                type: "transfer",
                dc: "dr",
                account_id: payload.fromAccount,
                category_id: transferCatId,
                currency: payload.currency || "TZS",
                notes: payload.notes || "",
                category: payload.category || "Transfer",
                status: payload.status,
                updated_at: now,
            };

            const updatedToRow: TransactionRow = {
                ...toRow,
                date,
                amount: payload.amount,
                type: "transfer",
                dc: "cr",
                account_id: payload.toAccount,
                category_id: transferCatId,
                currency: payload.currency || "TZS",
                notes: payload.notes || "",
                category: payload.category || "Transfer",
                status: payload.status,
                updated_at: now,
            };

            const rowsToSave: TransactionRow[] = [updatedFromRow, updatedToRow];
            const rowsToDelete: TransactionRow[] = [];

            if (payload.fee && payload.fee > 0) {
                const feeNotes = payload.notes
                    ? `Transfer fee • ${payload.notes}`
                    : "Transfer fee";

                if (existingFeeRow) {
                    rowsToSave.push({
                        ...existingFeeRow,
                        date,
                        amount: payload.fee,
                        type: "expense",
                        dc: "dr",
                        account_id: payload.fromAccount,
                        category_id: feeCatId,
                        currency: payload.currency || "TZS",
                        notes: feeNotes,
                        category: "Fees",
                        status: payload.status,
                        updated_at: now,
                    });
                } else {
                    rowsToSave.push({
                        id: generateUUID(),
                        user_id: fromRow.user_id,
                        date,
                        amount: payload.fee,
                        type: "expense",
                        dc: "dr",
                        account_id: payload.fromAccount,
                        party_id: null,
                        category_id: feeCatId,
                        transfer_id: transferId,
                        currency: payload.currency || "TZS",
                        notes: feeNotes,
                        category: "Fees",
                        status: payload.status,
                        created_at: now,
                        updated_at: now,
                    });
                }
            } else if (existingFeeRow) {
                rowsToDelete.push(existingFeeRow);
            }

            await offlineDb.putMany("transactions", rowsToSave);
            for (const del of rowsToDelete) {
                await offlineDb.deleteItem("transactions", del.id);
            }

            if (typeof navigator !== "undefined" && navigator.onLine) {
                try {
                    const { error } = await supabase.from("transactions").upsert(rowsToSave, { onConflict: "id" });
                    if (error) throw error;
                    if (rowsToDelete.length > 0) {
                        const deleteIds = rowsToDelete.map(r => r.id);
                        const { error: delError } = await supabase.from("transactions").delete().in("id", deleteIds);
                        if (delError) throw delError;
                    }
                    return;
                } catch (err) {
                    console.warn("Online transfer update failed, queueing:", err);
                }
            }

            for (const row of rowsToSave) {
                const isNew = !rows.some(r => r.id === row.id);
                await offlineDb.addToSyncQueue({
                    table: "transactions",
                    action: isNew ? "insert" : "update",
                    recordId: row.id,
                    payload: row,
                    userId: row.user_id || "",
                });
            }
            for (const del of rowsToDelete) {
                await offlineDb.addToSyncQueue({
                    table: "transactions",
                    action: "delete",
                    recordId: del.id,
                    payload: {},
                    userId: del.user_id || "",
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
            if (payload.categoryId !== undefined || payload.category_id !== undefined) {
                updateData.category_id = payload.categoryId ?? payload.category_id ?? null;
            } else if (payload.category !== undefined) {
                const cachedCats = await offlineDb.getAll<{ id: string; name: string }>("categories");
                const matched = cachedCats.find(c => c.name.toLowerCase() === (payload.category || "").trim().toLowerCase());
                updateData.category_id = matched ? matched.id : null;
            }
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

// src/features/finance/services/TransactionService.ts
import { supabase } from "../../../supabase";
import type { CurrencyCode } from "../../../types/account";
import type { Database } from "../../../types/database";

type TransactionRow = Database["public"]["Tables"]["transactions"]["Row"];
type TransactionInsert = Database["public"]["Tables"]["transactions"]["Insert"];
type TransactionUpdate = Database["public"]["Tables"]["transactions"]["Update"];

/* =======================
   Types
======================= */

export type TransactionDTO = {
    date: string;
    amount: number;
    dc: "dr" | "cr";
    account: string;
    currency?: CurrencyCode;
    notes: string;
    category: string;
    status: "completed" | "pending" | "failed";
};

export type Transaction = TransactionDTO & {
    id: string;
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

    return {
        id: String(row.id),
        date: dateStr,
        amount: typeof row.amount === "number" ? row.amount : parseFloat(String(row.amount)) || 0,
        dc: (row.dc as "dr" | "cr") || "dr",
        account: row.account || "",
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
        const { data, error } = await supabase
            .from("transactions")
            .select("*")
            .order("date", { ascending: false });

        if (error) throw error;
        return (data || []).map((row) => rowToTransaction(row as TransactionRow));
    },

    async create(payload: TransactionDTO) {
        const user = (await supabase.auth.getUser()).data.user;
        const now = new Date().toISOString();

        const insertData: TransactionInsert = {
            date: payload.date ? new Date(payload.date).toISOString() : now,
            amount: payload.amount,
            dc: payload.dc,
            account: payload.account,
            currency: payload.currency || "TZS",
            notes: payload.notes || "",
            category: payload.category || "",
            status: payload.status || "completed",
            created_at: now,
            updated_at: now,
        };

        if (user?.id) {
            insertData.user_id = user.id;
        }

        const { data, error } = await supabase
            .from("transactions")
            .insert([insertData])
            .select()
            .single();

        if (error) throw error;
        return rowToTransaction(data as TransactionRow);
    },

    async update(id: string, payload: Partial<TransactionDTO>) {
        const updateData: TransactionUpdate = {
            updated_at: new Date().toISOString(),
        };

        if (payload.date !== undefined) updateData.date = new Date(payload.date).toISOString();
        if (payload.amount !== undefined) updateData.amount = payload.amount;
        if (payload.dc !== undefined) updateData.dc = payload.dc;
        if (payload.account !== undefined) updateData.account = payload.account;
        if (payload.currency !== undefined) updateData.currency = payload.currency;
        if (payload.notes !== undefined) updateData.notes = payload.notes;
        if (payload.category !== undefined) updateData.category = payload.category;
        if (payload.status !== undefined) updateData.status = payload.status;

        const { error } = await supabase
            .from("transactions")
            .update(updateData)
            .eq("id", id);

        if (error) throw error;
    },

    async remove(id: string) {
        const { error } = await supabase
            .from("transactions")
            .delete()
            .eq("id", id);

        if (error) throw error;
    },
};

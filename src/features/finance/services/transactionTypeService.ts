// src/features/finance/services/transactionTypeService.ts
import { supabase } from "../../../supabase";
import type { Database, TransactionType } from "../../../types/database";
import type { TransactionTypeItem, TransactionTypeCreateDTO, TransactionTypeUpdateDTO } from "../../../types/transactionType";
import { offlineDb } from "../../../lib/offline/offlineDb";
import { syncManager } from "../../../lib/offline/syncManager";
import { categoryColorStyles } from "./categoryService";

type TransactionTypeRow = Database["public"]["Tables"]["transaction_types"]["Row"];

export const defaultTransactionTypes: Omit<TransactionTypeItem, "id" | "createdAt" | "updatedAt">[] = [
    {
        code: "income",
        label: "Income",
        dc: "cr",
        icon: "bi-arrow-down-left-circle-fill",
        badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800",
        color: "text-emerald-600 dark:text-emerald-400",
        description: "Money received (Salary, Sales, Grants, Gifts)",
        isSystem: true,
    },
    {
        code: "expense",
        label: "Expense",
        dc: "dr",
        icon: "bi-arrow-up-right-circle-fill",
        badge: "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-300 dark:border-rose-800",
        color: "text-rose-600 dark:text-rose-400",
        description: "Money spent (Rent, Groceries, Utilities, Supplies)",
        isSystem: true,
    },
    {
        code: "transfer",
        label: "Transfer",
        dc: "dr",
        icon: "bi-arrow-left-right",
        badge: "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-300 dark:border-blue-800",
        color: "text-blue-600 dark:text-blue-400",
        description: "Moving money between accounts or digital wallets",
        isSystem: true,
    },
    {
        code: "borrow",
        label: "Borrow",
        dc: "cr",
        icon: "bi-box-arrow-in-down-right",
        badge: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-300 dark:border-amber-800",
        color: "text-amber-600 dark:text-amber-400",
        description: "Money received or borrowed from a party (payable/liability)",
        isSystem: true,
    },
    {
        code: "repayment",
        label: "Repayment",
        dc: "dr",
        icon: "bi-box-arrow-up-right",
        badge: "bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-300 dark:border-purple-800",
        color: "text-purple-600 dark:text-purple-400",
        description: "Paying back a borrowed amount or debt",
        isSystem: true,
    },
    {
        code: "lend",
        label: "Lend",
        dc: "dr",
        icon: "bi-box-arrow-up-left",
        badge: "bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300 border border-orange-300 dark:border-orange-800",
        color: "text-orange-600 dark:text-orange-400",
        description: "Money lent out to a person or entity (receivable created)",
        isSystem: true,
    },
    {
        code: "collection",
        label: "Collection",
        dc: "cr",
        icon: "bi-box-arrow-in-down-left",
        badge: "bg-teal-100 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300 border border-teal-300 dark:border-teal-800",
        color: "text-teal-600 dark:text-teal-400",
        description: "Collecting money that was lent out (receivable recovered)",
        isSystem: true,
    },
];

const rowToTransactionType = (row: TransactionTypeRow): TransactionTypeItem => {
    return {
        id: String(row.id),
        userId: row.user_id,
        code: row.code as TransactionType,
        label: row.label,
        dc: row.dc as "dr" | "cr",
        icon: row.icon || "bi-arrow-left-right",
        badge: row.badge || (categoryColorStyles[row.color]?.badge || "bg-main-300 text-main-700"),
        color: row.color ? (categoryColorStyles[row.color]?.text || row.color) : "text-main-700",
        description: row.description || "",
        isSystem: row.is_system,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
};

export const transactionTypeService = {
    async list(): Promise<TransactionTypeItem[]> {
        let cached = await offlineDb.getAll<TransactionTypeRow>("transaction_types");

        if (typeof navigator !== "undefined" && navigator.onLine) {
            try {
                const user = (await supabase.auth.getUser()).data.user;
                if (user) {
                    const { data, error } = await supabase
                        .from("transaction_types")
                        .select("*")
                        .eq("user_id", user.id)
                        .order("created_at", { ascending: true });

                    if (!error && data) {
                        if (data.length === 0) {
                            return await this.seedDefaultTypes(user.id);
                        }

                        await offlineDb.clearStore("transaction_types");
                        await offlineDb.putMany("transaction_types", data);
                        return data.map(rowToTransactionType);
                    }
                }
            } catch (err) {
                console.warn("Failed to fetch transaction types online, using local cache:", err);
            }
        }

        if (cached.length === 0) {
            const user = (await supabase.auth.getUser()).data.user;
            return await this.seedDefaultTypes(user?.id || "local-user");
        }

        return cached.map(rowToTransactionType);
    },

    async seedDefaultTypes(userId: string): Promise<TransactionTypeItem[]> {
        const now = new Date().toISOString();
        const rows: TransactionTypeRow[] = defaultTransactionTypes.map((t, i) => ({
            id: `type_def_${i}_${t.code}`,
            user_id: userId,
            code: t.code,
            label: t.label,
            dc: t.dc,
            icon: t.icon,
            badge: t.badge,
            color: t.color,
            description: t.description,
            is_system: true,
            created_at: now,
            updated_at: now,
        }));

        await offlineDb.putMany("transaction_types", rows);

        if (typeof navigator !== "undefined" && navigator.onLine && userId !== "local-user") {
            try {
                const { data, error } = await supabase
                    .from("transaction_types")
                    .upsert(rows, { onConflict: "user_id,code" })
                    .select();

                if (!error && data) {
                    await offlineDb.putMany("transaction_types", data);
                    return data.map(rowToTransactionType);
                }
            } catch (err) {
                console.warn("Could not sync default types to Supabase:", err);
            }
        }

        return rows.map(rowToTransactionType);
    },

    async create(payload: TransactionTypeCreateDTO): Promise<TransactionTypeItem> {
        return await syncManager.onUserMutation(async () => {
            const user = (await supabase.auth.getUser()).data.user;
            const now = new Date().toISOString();
            const typeId = crypto.randomUUID ? crypto.randomUUID() : `type_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

            const colorKey = payload.color || (payload.dc === "cr" ? "emerald" : "rose");
            const colorStyles = categoryColorStyles[colorKey] || categoryColorStyles.primary;

            const codeSlug = payload.code.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");

            const newRow: TransactionTypeRow = {
                id: typeId,
                user_id: user?.id || "local-user",
                code: codeSlug,
                label: payload.label.trim(),
                dc: payload.dc,
                icon: payload.icon || "bi-tag",
                color: colorKey,
                badge: colorStyles.badge,
                description: payload.description?.trim() || "",
                is_system: false,
                created_at: now,
                updated_at: now,
            };

            await offlineDb.put("transaction_types", newRow);

            if (typeof navigator !== "undefined" && navigator.onLine && user?.id) {
                try {
                    const { data, error } = await supabase
                        .from("transaction_types")
                        .insert([newRow])
                        .select()
                        .single();

                    if (error) throw error;
                    if (data) {
                        await offlineDb.put("transaction_types", data);
                        return rowToTransactionType(data as TransactionTypeRow);
                    }
                } catch (err) {
                    console.warn("Online transaction type creation failed, queueing:", err);
                    await offlineDb.addToSyncQueue({
                        table: "transaction_types",
                        action: "insert",
                        recordId: typeId,
                        payload: newRow,
                        userId: user?.id || "",
                    });
                }
            } else if (user?.id) {
                await offlineDb.addToSyncQueue({
                    table: "transaction_types",
                    action: "insert",
                    recordId: typeId,
                    payload: newRow,
                    userId: user.id,
                });
            }

            return rowToTransactionType(newRow);
        });
    },

    async update(id: string, payload: TransactionTypeUpdateDTO): Promise<void> {
        return await syncManager.onUserMutation(async () => {
            const cached = await offlineDb.getById<TransactionTypeRow>("transaction_types", id);
            const now = new Date().toISOString();
            const updateData: Partial<TransactionTypeRow> = {
                updated_at: now,
            };

            if (payload.label !== undefined) updateData.label = payload.label.trim();
            if (payload.dc !== undefined) updateData.dc = payload.dc;
            if (payload.icon !== undefined) updateData.icon = payload.icon;
            if (payload.description !== undefined) updateData.description = payload.description.trim();
            if (payload.color !== undefined) {
                updateData.color = payload.color;
                const style = categoryColorStyles[payload.color];
                if (style) {
                    updateData.badge = style.badge;
                }
            }

            if (cached) {
                await offlineDb.put("transaction_types", { ...cached, ...updateData });
            }

            if (typeof navigator !== "undefined" && navigator.onLine) {
                try {
                    const { error } = await supabase
                        .from("transaction_types")
                        .update(updateData)
                        .eq("id", id);

                    if (error) throw error;
                } catch (err) {
                    console.warn("Online transaction type update failed, queueing:", err);
                    await offlineDb.addToSyncQueue({
                        table: "transaction_types",
                        action: "update",
                        recordId: id,
                        payload: updateData,
                        userId: cached?.user_id || "",
                    });
                }
            } else {
                await offlineDb.addToSyncQueue({
                    table: "transaction_types",
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
            const cached = await offlineDb.getById<TransactionTypeRow>("transaction_types", id);
            await offlineDb.deleteItem("transaction_types", id);

            if (typeof navigator !== "undefined" && navigator.onLine) {
                try {
                    const { error } = await supabase
                        .from("transaction_types")
                        .delete()
                        .eq("id", id);

                    if (error) throw error;
                } catch (err) {
                    console.warn("Online transaction type remove failed, queueing:", err);
                    await offlineDb.addToSyncQueue({
                        table: "transaction_types",
                        action: "delete",
                        recordId: id,
                        payload: {},
                        userId: cached?.user_id || "",
                    });
                }
            } else {
                await offlineDb.addToSyncQueue({
                    table: "transaction_types",
                    action: "delete",
                    recordId: id,
                    payload: {},
                    userId: cached?.user_id || "",
                });
            }
        });
    },
};

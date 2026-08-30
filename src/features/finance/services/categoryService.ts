// src/features/finance/services/categoryService.ts
import { supabase } from "../../../supabase";
import type { Database } from "../../../types/database";
import type { TransactionCategory, CategoryCreateDTO, CategoryUpdateDTO } from "../../../types/category";
import { offlineDb } from "../../../lib/offline/offlineDb";
import { syncManager } from "../../../lib/offline/syncManager";

type CategoryRow = Database["public"]["Tables"]["transaction_categories"]["Row"];

export const defaultTransactionCategories: Omit<TransactionCategory, "id" | "createdAt" | "updatedAt">[] = [
    {
        name: "Salary",
        description: "Job salary, wages",
        icon: "bi-cash-stack",
        color: "emerald",
        isSystem: true,
    },
    {
        name: "Business",
        description: "Business revenue",
        icon: "bi-briefcase",
        color: "blue",
        isSystem: true,
    },
    {
        name: "Freelance",
        description: "Contract/project income",
        icon: "bi-laptop",
        color: "teal",
        isSystem: true,
    },
    {
        name: "Food",
        description: "Groceries, restaurants",
        icon: "bi-egg-fried",
        color: "amber",
        isSystem: true,
    },
    {
        name: "Transport",
        description: "Fuel, bus, taxi",
        icon: "bi-car-front",
        color: "orange",
        isSystem: true,
    },
    {
        name: "Housing",
        description: "Rent, repairs",
        icon: "bi-house-door",
        color: "indigo",
        isSystem: true,
    },
    {
        name: "Utilities",
        description: "Electricity, water, internet",
        icon: "bi-lightning-charge",
        color: "yellow",
        isSystem: true,
    },
    {
        name: "Shopping",
        description: "Clothes, electronics",
        icon: "bi-bag",
        color: "pink",
        isSystem: true,
    },
    {
        name: "Entertainment",
        description: "Movies, games",
        icon: "bi-controller",
        color: "purple",
        isSystem: true,
    },
    {
        name: "Education",
        description: "Courses, books, fees",
        icon: "bi-mortarboard",
        color: "sky",
        isSystem: true,
    },
    {
        name: "Family",
        description: "Family support",
        icon: "bi-people",
        color: "rose",
        isSystem: true,
    },
    {
        name: "Gifts",
        description: "Gifts given/received",
        icon: "bi-gift",
        color: "red",
        isSystem: true,
    },
    {
        name: "Fees",
        description: "Bank/mobile-money charges",
        icon: "bi-credit-card",
        color: "gray",
        isSystem: true,
    },
    {
        name: "Other",
        description: "Anything uncategorized",
        icon: "bi-question-circle",
        color: "neutral",
        isSystem: true,
    },
];

export const categoryColorStyles: Record<string, { bg: string; text: string; badge: string; border: string }> = {
    emerald: {
        bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        text: "text-emerald-600 dark:text-emerald-400",
        badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800",
        border: "border-emerald-300 dark:border-emerald-800",
    },
    blue: {
        bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        text: "text-blue-600 dark:text-blue-400",
        badge: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-800",
        border: "border-blue-300 dark:border-blue-800",
    },
    teal: {
        bg: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
        text: "text-teal-600 dark:text-teal-400",
        badge: "bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border-teal-300 dark:border-teal-800",
        border: "border-teal-300 dark:border-teal-800",
    },
    amber: {
        bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        text: "text-amber-600 dark:text-amber-400",
        badge: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800",
        border: "border-amber-300 dark:border-amber-800",
    },
    orange: {
        bg: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
        text: "text-orange-600 dark:text-orange-400",
        badge: "bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border-orange-300 dark:border-orange-800",
        border: "border-orange-300 dark:border-orange-800",
    },
    indigo: {
        bg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
        text: "text-indigo-600 dark:text-indigo-400",
        badge: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800",
        border: "border-indigo-300 dark:border-indigo-800",
    },
    yellow: {
        bg: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
        text: "text-yellow-600 dark:text-yellow-400",
        badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-300 border-yellow-300 dark:border-yellow-800",
        border: "border-yellow-300 dark:border-yellow-800",
    },
    pink: {
        bg: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
        text: "text-pink-600 dark:text-pink-400",
        badge: "bg-pink-100 text-pink-800 dark:bg-pink-950/60 dark:text-pink-300 border-pink-300 dark:border-pink-800",
        border: "border-pink-300 dark:border-pink-800",
    },
    purple: {
        bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
        text: "text-purple-600 dark:text-purple-400",
        badge: "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300 dark:border-purple-800",
        border: "border-purple-300 dark:border-purple-800",
    },
    sky: {
        bg: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
        text: "text-sky-600 dark:text-sky-400",
        badge: "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border-sky-300 dark:border-sky-800",
        border: "border-sky-300 dark:border-sky-800",
    },
    rose: {
        bg: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
        text: "text-rose-600 dark:text-rose-400",
        badge: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800",
        border: "border-rose-300 dark:border-rose-800",
    },
    red: {
        bg: "bg-red-500/10 text-red-600 dark:text-red-400",
        text: "text-red-600 dark:text-red-400",
        badge: "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-300 dark:border-red-800",
        border: "border-red-300 dark:border-red-800",
    },
    gray: {
        bg: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
        text: "text-gray-600 dark:text-gray-400",
        badge: "bg-gray-100 text-gray-800 dark:bg-gray-950/60 dark:text-gray-300 border-gray-300 dark:border-gray-800",
        border: "border-gray-300 dark:border-gray-800",
    },
    neutral: {
        bg: "bg-main-300 text-main-700",
        text: "text-main-700",
        badge: "bg-main-300 text-main-700 border-main-400",
        border: "border-main-300",
    },
    primary: {
        bg: "bg-primary/10 text-primary",
        text: "text-primary",
        badge: "bg-primary/15 text-primary border-primary/30",
        border: "border-primary/30",
    },
};

const rowToCategory = (row: CategoryRow): TransactionCategory => {
    return {
        id: String(row.id),
        userId: row.user_id,
        name: row.name,
        description: row.description || "",
        icon: row.icon || "bi-tag",
        color: row.color || "primary",
        isSystem: row.is_system,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
};

export const categoryService = {
    async list(): Promise<TransactionCategory[]> {
        // 1. Fetch from local IndexedDB
        let cached = await offlineDb.getAll<CategoryRow>("categories");

        // 2. If online, fetch from Supabase
        if (typeof navigator !== "undefined" && navigator.onLine) {
            try {
                const user = (await supabase.auth.getUser()).data.user;
                if (user) {
                    const { data, error } = await supabase
                        .from("transaction_categories")
                        .select("*")
                        .eq("user_id", user.id)
                        .order("name", { ascending: true });

                    if (!error && data) {
                        // If user has zero categories online, seed defaults automatically
                        if (data.length === 0) {
                            const seeded = await this.seedDefaultCategories(user.id);
                            return seeded;
                        }

                        await offlineDb.clearStore("categories");
                        await offlineDb.putMany("categories", data);
                        return data.map(rowToCategory);
                    }
                }
            } catch (err) {
                console.warn("Failed to fetch categories online, using local cache:", err);
            }
        }

        // 3. If local cache is empty, seed defaults locally
        if (cached.length === 0) {
            const user = (await supabase.auth.getUser()).data.user;
            return await this.seedDefaultCategories(user?.id || "local-user");
        }

        cached.sort((a, b) => a.name.localeCompare(b.name));
        return cached.map(rowToCategory);
    },

    async seedDefaultCategories(userId: string): Promise<TransactionCategory[]> {
        const now = new Date().toISOString();
        const rows: CategoryRow[] = defaultTransactionCategories.map((cat, i) => ({
            id: `cat_def_${i}_${cat.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
            user_id: userId,
            name: cat.name,
            description: cat.description || "",
            icon: cat.icon || "bi-tag",
            color: cat.color || "primary",
            is_system: true,
            created_at: now,
            updated_at: now,
        }));

        await offlineDb.putMany("categories", rows);

        if (typeof navigator !== "undefined" && navigator.onLine && userId !== "local-user") {
            try {
                const { data, error } = await supabase
                    .from("transaction_categories")
                    .upsert(rows, { onConflict: "user_id,name" })
                    .select();

                if (!error && data) {
                    await offlineDb.putMany("categories", data);
                    return data.map(rowToCategory);
                }
            } catch (err) {
                console.warn("Could not sync seeded categories to Supabase:", err);
            }
        }

        return rows.map(rowToCategory);
    },

    async create(payload: CategoryCreateDTO): Promise<TransactionCategory> {
        return await syncManager.onUserMutation(async () => {
            const user = (await supabase.auth.getUser()).data.user;
            const now = new Date().toISOString();
            const catId = crypto.randomUUID ? crypto.randomUUID() : `cat_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

            const newRow: CategoryRow = {
                id: catId,
                user_id: user?.id || "local-user",
                name: payload.name.trim(),
                description: payload.description?.trim() || "",
                icon: payload.icon || "bi-tag",
                color: payload.color || "primary",
                is_system: false,
                created_at: now,
                updated_at: now,
            };

            await offlineDb.put("categories", newRow);

            if (typeof navigator !== "undefined" && navigator.onLine && user?.id) {
                try {
                    const { data, error } = await supabase
                        .from("transaction_categories")
                        .insert([newRow])
                        .select()
                        .single();

                    if (error) throw error;
                    if (data) {
                        await offlineDb.put("categories", data);
                        return rowToCategory(data as CategoryRow);
                    }
                } catch (err) {
                    console.warn("Online category creation failed, queueing:", err);
                    await offlineDb.addToSyncQueue({
                        table: "categories",
                        action: "insert",
                        recordId: catId,
                        payload: newRow,
                        userId: user?.id || "",
                    });
                }
            } else if (user?.id) {
                await offlineDb.addToSyncQueue({
                    table: "categories",
                    action: "insert",
                    recordId: catId,
                    payload: newRow,
                    userId: user.id,
                });
            }

            return rowToCategory(newRow);
        });
    },

    async update(id: string, payload: CategoryUpdateDTO): Promise<void> {
        return await syncManager.onUserMutation(async () => {
            const cached = await offlineDb.getById<CategoryRow>("categories", id);
            const now = new Date().toISOString();
            const updateData: Partial<CategoryRow> = {
                updated_at: now,
            };

            if (payload.name !== undefined) updateData.name = payload.name.trim();
            if (payload.description !== undefined) updateData.description = payload.description.trim();
            if (payload.icon !== undefined) updateData.icon = payload.icon;
            if (payload.color !== undefined) updateData.color = payload.color;

            if (cached) {
                await offlineDb.put("categories", { ...cached, ...updateData });
            }

            if (typeof navigator !== "undefined" && navigator.onLine) {
                try {
                    const { error } = await supabase
                        .from("transaction_categories")
                        .update(updateData)
                        .eq("id", id);

                    if (error) throw error;
                } catch (err) {
                    console.warn("Online category update failed, queueing:", err);
                    await offlineDb.addToSyncQueue({
                        table: "categories",
                        action: "update",
                        recordId: id,
                        payload: updateData,
                        userId: cached?.user_id || "",
                    });
                }
            } else {
                await offlineDb.addToSyncQueue({
                    table: "categories",
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
            const cached = await offlineDb.getById<CategoryRow>("categories", id);
            await offlineDb.deleteItem("categories", id);

            if (typeof navigator !== "undefined" && navigator.onLine) {
                try {
                    const { error } = await supabase
                        .from("transaction_categories")
                        .delete()
                        .eq("id", id);

                    if (error) throw error;
                } catch (err) {
                    console.warn("Online category remove failed, queueing:", err);
                    await offlineDb.addToSyncQueue({
                        table: "categories",
                        action: "delete",
                        recordId: id,
                        payload: {},
                        userId: cached?.user_id || "",
                    });
                }
            } else {
                await offlineDb.addToSyncQueue({
                    table: "categories",
                    action: "delete",
                    recordId: id,
                    payload: {},
                    userId: cached?.user_id || "",
                });
            }
        });
    },
};

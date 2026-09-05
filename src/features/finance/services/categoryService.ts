// src/features/finance/services/categoryService.ts
import { supabase } from "../../../supabase";
import type { Database } from "../../../types/database";
import type { TransactionCategory, CategoryCreateDTO, CategoryUpdateDTO } from "../../../types/category";
import { offlineDb } from "../../../lib/offline/offlineDb";
import { syncManager } from "../../../lib/offline/syncManager";
import { generateUUID, isValidUUID } from "../../../lib/uuid";

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
        bg: "bg-success-500/10 text-success-600",
        text: "text-success-600",
        badge: "bg-success-100 text-success-800 border-success-300",
        border: "border-success-300",
    },
    blue: {
        bg: "bg-primary-500/10 text-primary-600",
        text: "text-primary-600",
        badge: "bg-primary-100 text-primary-800 border-primary-300",
        border: "border-primary-300",
    },
    teal: {
        bg: "bg-info-500/10 text-info-600",
        text: "text-info-600",
        badge: "bg-info-100 text-info-800 border-info-300",
        border: "border-info-300",
    },
    amber: {
        bg: "bg-accent-500/10 text-accent-600",
        text: "text-accent-600",
        badge: "bg-accent-100 text-accent-800 border-accent-300",
        border: "border-accent-300",
    },
    orange: {
        bg: "bg-warning-500/10 text-warning-600",
        text: "text-warning-600",
        badge: "bg-warning-100 text-warning-800 border-warning-300",
        border: "border-warning-300",
    },
    indigo: {
        bg: "bg-secondary-500/10 text-secondary-600",
        text: "text-secondary-600",
        badge: "bg-secondary-100 text-secondary-800 border-secondary-300",
        border: "border-secondary-300",
    },
    yellow: {
        bg: "bg-warning-500/10 text-warning-600",
        text: "text-warning-600",
        badge: "bg-warning-100 text-warning-800 border-warning-300",
        border: "border-warning-300",
    },
    pink: {
        bg: "bg-secondary-500/10 text-secondary-600",
        text: "text-secondary-600",
        badge: "bg-secondary-100 text-secondary-800 border-secondary-300",
        border: "border-secondary-300",
    },
    purple: {
        bg: "bg-secondary-500/10 text-secondary-600",
        text: "text-secondary-600",
        badge: "bg-secondary-100 text-secondary-800 border-secondary-300",
        border: "border-secondary-300",
    },
    sky: {
        bg: "bg-primary-500/10 text-primary-600",
        text: "text-primary-600",
        badge: "bg-primary-100 text-primary-800 border-primary-300",
        border: "border-primary-300",
    },
    rose: {
        bg: "bg-danger-500/10 text-danger-600",
        text: "text-danger-600",
        badge: "bg-danger-100 text-danger-800 border-danger-300",
        border: "border-danger-300",
    },
    red: {
        bg: "bg-danger-500/10 text-danger-600",
        text: "text-danger-600",
        badge: "bg-danger-100 text-danger-800 border-danger-300",
        border: "border-danger-300",
    },
    gray: {
        bg: "bg-main-500/10 text-main-600",
        text: "text-main-600",
        badge: "bg-main-100 text-main-800 border-main-300",
        border: "border-main-300",
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
                            return await this.seedDefaultCategories(user.id);
                        }

                        // Safely reconcile local cache with Supabase without deleting un-synced items!
                        await offlineDb.syncStore("categories", data);

                        // Clean up legacy cat_def_... entries if any remain
                        const updatedLocal = await offlineDb.getAll<CategoryRow>("categories");
                        for (const item of updatedLocal) {
                            if (item.id.startsWith("cat_def_")) {
                                await offlineDb.deleteItem("categories", item.id);
                            }
                        }

                        const finalLocal = await offlineDb.getAll<CategoryRow>("categories");
                        finalLocal.sort((a, b) => a.name.localeCompare(b.name));
                        return finalLocal.map(rowToCategory);
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
        const rows: CategoryRow[] = defaultTransactionCategories.map((cat) => ({
            id: generateUUID(),
            user_id: userId,
            name: cat.name,
            description: cat.description || "",
            icon: cat.icon || "bi-tag",
            color: cat.color || "primary",
            is_system: true,
            created_at: now,
            updated_at: now,
        }));

        // Clean up any legacy cat_def_... items in IndexedDB
        const cached = await offlineDb.getAll<CategoryRow>("categories");
        for (const item of cached) {
            if (item.id.startsWith("cat_def_") || !isValidUUID(item.id)) {
                await offlineDb.deleteItem("categories", item.id);
            }
        }

        await offlineDb.putMany("categories", rows);

        if (typeof navigator !== "undefined" && navigator.onLine && userId !== "local-user") {
            try {
                const { data, error } = await supabase
                    .from("transaction_categories")
                    .upsert(rows, { onConflict: "user_id,name" })
                    .select();

                if (!error && data && data.length > 0) {
                    await offlineDb.putMany("categories", data);
                    const allLocal = await offlineDb.getAll<CategoryRow>("categories");
                    allLocal.sort((a, b) => a.name.localeCompare(b.name));
                    return allLocal.map(rowToCategory);
                }
            } catch (err) {
                console.warn("Could not sync seeded categories to Supabase:", err);
            }
        }

        const allLocal = await offlineDb.getAll<CategoryRow>("categories");
        allLocal.sort((a, b) => a.name.localeCompare(b.name));
        return allLocal.map(rowToCategory);
    },

    async create(payload: CategoryCreateDTO): Promise<TransactionCategory> {
        return await syncManager.onUserMutation(async () => {
            const user = (await supabase.auth.getUser()).data.user;
            const now = new Date().toISOString();
            const catId = generateUUID();

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
                        userId: user.id,
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

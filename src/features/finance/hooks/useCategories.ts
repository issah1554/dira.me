// src/features/finance/hooks/useCategories.ts
import { useState, useEffect, useCallback } from "react";
import { categoryService } from "../services/categoryService";
import type { TransactionCategory, CategoryCreateDTO, CategoryUpdateDTO } from "../../../types/category";
import { syncManager } from "../../../lib/offline/syncManager";

export function useCategories() {
    const [categories, setCategories] = useState<TransactionCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadCategories = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await categoryService.list();
            setCategories(data);
        } catch (err: any) {
            setError(err?.message || "Failed to load categories");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCategories();

        const unsubscribe = syncManager.subscribe(event => {
            if (event.type === "sync-complete") {
                loadCategories();
            }
        });

        return () => unsubscribe();
    }, [loadCategories]);

    const createCategory = async (payload: CategoryCreateDTO) => {
        const newCat = await categoryService.create(payload);
        setCategories(prev => [...prev, newCat].sort((a, b) => a.name.localeCompare(b.name)));
        return newCat;
    };

    const updateCategory = async (id: string, payload: CategoryUpdateDTO) => {
        await categoryService.update(id, payload);
        setCategories(prev =>
            prev.map(c => (c.id === id ? { ...c, ...payload } : c)).sort((a, b) => a.name.localeCompare(b.name))
        );
    };

    const deleteCategory = async (id: string) => {
        await categoryService.remove(id);
        setCategories(prev => prev.filter(c => c.id !== id));
    };

    return {
        categories,
        loading,
        error,
        loadCategories,
        createCategory,
        updateCategory,
        deleteCategory,
    };
}

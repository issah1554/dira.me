// src/features/finance/hooks/useTransactionTypes.ts
import { useState, useEffect, useCallback, useMemo } from "react";
import { transactionTypeService, defaultTransactionTypes } from "../services/transactionTypeService";
import type { TransactionTypeItem, TransactionTypeCreateDTO, TransactionTypeUpdateDTO } from "../../../types/transactionType";
import { syncManager } from "../../../lib/offline/syncManager";

export function useTransactionTypes() {
    const [types, setTypes] = useState<TransactionTypeItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadTypes = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await transactionTypeService.list();
            setTypes(data);
        } catch (err: any) {
            setError(err?.message || "Failed to load transaction types");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTypes();

        const unsubscribe = syncManager.subscribe(event => {
            if (event.type === "sync-complete") {
                loadTypes();
            }
        });

        return () => unsubscribe();
    }, [loadTypes]);

    const createType = async (payload: TransactionTypeCreateDTO) => {
        const newType = await transactionTypeService.create(payload);
        setTypes(prev => [...prev, newType]);
        return newType;
    };

    const updateType = async (id: string, payload: TransactionTypeUpdateDTO) => {
        await transactionTypeService.update(id, payload);
        setTypes(prev => prev.map(t => (t.id === id ? { ...t, ...payload } : t)));
    };

    const deleteType = async (id: string) => {
        await transactionTypeService.remove(id);
        setTypes(prev => prev.filter(t => t.id !== id));
    };

    const typeConfigMap = useMemo(() => {
        const map: Record<string, { label: string; dc: "dr" | "cr"; icon: string; badge: string; color: string; description: string }> = {};
        
        // Seed default map first so standard keys are always available
        defaultTransactionTypes.forEach(t => {
            map[t.code] = {
                label: t.label,
                dc: t.dc,
                icon: t.icon,
                badge: t.badge,
                color: t.color,
                description: t.description,
            };
        });

        // Overlay with custom or updated types from DB
        types.forEach(t => {
            map[t.code] = {
                label: t.label,
                dc: t.dc,
                icon: t.icon,
                badge: t.badge,
                color: t.color,
                description: t.description,
            };
        });

        return map;
    }, [types]);

    return {
        types,
        loading,
        error,
        typeConfigMap,
        loadTypes,
        createType,
        updateType,
        deleteType,
    };
}

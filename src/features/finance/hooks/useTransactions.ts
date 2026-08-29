import { useEffect, useState, useCallback } from "react";
import { TransactionService } from "../services/TransactionService";
import type { Transaction, TransactionDTO } from "../services/TransactionService";
import { Toast } from "../../../components/ui/Toast";
import { syncManager } from "../../../lib/offline/syncManager";

export function useTransactions() {
    const [data, setData] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        try {
            setLoading(true);
            const list = await TransactionService.list();
            setData(list);
        } catch {
            setError("Failed to load transactions");
        } finally {
            setLoading(false);
        }
    }, []);

    const create = async (payload: TransactionDTO) => {
        try {
            await TransactionService.create(payload);
            Toast.fire({ icon: "success", title: "Transaction recorded" });
            load();
        } catch {
            Toast.fire({ icon: "error", title: "Failed to record transaction" });
        }
    };

    const update = async (id: string, payload: Partial<TransactionDTO>) => {
        try {
            await TransactionService.update(id, payload);
            Toast.fire({ icon: "success", title: "Transaction updated" });
            load();
        } catch {
            Toast.fire({ icon: "error", title: "Update failed" });
        }
    };

    const remove = async (id: string) => {
        try {
            await TransactionService.remove(id);
            Toast.fire({ icon: "success", title: "Transaction removed" });
            load();
        } catch {
            Toast.fire({ icon: "error", title: "Delete failed" });
        }
    };

    useEffect(() => {
        load();

        const unsub = syncManager.subscribe((event) => {
            if (event.type === "sync-complete") {
                load();
            }
        });

        return () => unsub();
    }, [load]);

    return {
        data,
        loading,
        error,
        reload: load,
        create,
        update,
        remove,
    };
}

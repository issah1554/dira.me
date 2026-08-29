import { useState, useEffect, useCallback } from "react";
import { partyService } from "../services/partyService";
import type { Party, PartyCreateDTO, PartyUpdateDTO } from "../../../types/party";
import { useAuth } from "../../../contexts/AuthContext";
import { syncManager } from "../../../lib/offline/syncManager";

export const useParties = () => {
    const [parties, setParties] = useState<Party[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { user } = useAuth();

    const loadParties = useCallback(async () => {
        if (!user?.uid) return;

        setLoading(true);
        setError(null);

        try {
            const data = await partyService.getParties(user.uid);
            setParties(data);
        } catch (err) {
            setError("Failed to load counterparties / parties");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user?.uid]);

    const createParty = async (partyData: PartyCreateDTO): Promise<Party> => {
        if (!user?.uid) throw new Error("User not authenticated");

        setLoading(true);
        setError(null);

        try {
            const newParty = await partyService.createParty(partyData, user.uid);
            setParties(prev => [...prev, newParty].sort((a, b) => a.name.localeCompare(b.name)));
            return newParty;
        } catch (err) {
            setError("Failed to create party");
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateParty = async (id: string, partyData: PartyUpdateDTO): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            await partyService.updateParty(id, partyData);
            setParties(prev =>
                prev.map(p => (p.id === id ? { ...p, ...partyData, updatedAt: new Date() } : p))
                    .sort((a, b) => a.name.localeCompare(b.name))
            );
        } catch (err) {
            setError("Failed to update party");
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteParty = async (id: string): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            await partyService.deleteParty(id);
            setParties(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            setError("Failed to delete party");
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.uid) {
            loadParties();
        }

        const unsub = syncManager.subscribe((event) => {
            if (event.type === "sync-complete") {
                loadParties();
            }
        });

        return () => unsub();
    }, [user?.uid, loadParties]);

    return {
        parties,
        loading,
        error,
        loadParties,
        createParty,
        updateParty,
        deleteParty,
    };
};

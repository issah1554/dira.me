// src/features/finance/services/partyService.ts
import { supabase } from "../../../supabase";
import type { Party, PartyCreateDTO, PartyUpdateDTO, PartyType } from "../../../types/party";
import type { Database } from "../../../types/database";
import { offlineDb } from "../../../lib/offline/offlineDb";
import { syncManager } from "../../../lib/offline/syncManager";

type PartyRow = Database["public"]["Tables"]["parties"]["Row"];
type PartyUpdate = Database["public"]["Tables"]["parties"]["Update"];

export const partyTypeIcons: Record<PartyType, string> = {
    person: "bi-person",
    company: "bi-building",
    employer: "bi-briefcase",
    customer: "bi-people",
    merchant: "bi-shop",
    bank: "bi-bank",
    government: "bi-shield-check",
    other: "bi-diagram-3",
};

export const partyTypeLabels: Record<PartyType, string> = {
    person: "Person / Individual",
    company: "Company / Business",
    employer: "Employer",
    customer: "Customer / Client",
    merchant: "Merchant / Vendor",
    bank: "Bank / Financial Institution",
    government: "Government / Tax Authority",
    other: "Other",
};

export const partyTypeColors: Record<PartyType, { bg: string; text: string; badge: string }> = {
    person: { bg: "bg-primary-100", text: "text-primary-600", badge: "bg-primary-100 text-primary-800" },
    company: { bg: "bg-secondary-100", text: "text-secondary-600", badge: "bg-secondary-100 text-secondary-800" },
    employer: { bg: "bg-primary-100", text: "text-primary-600", badge: "bg-primary-100 text-primary-800" },
    customer: { bg: "bg-success-100", text: "text-success-600", badge: "bg-success-100 text-success-800" },
    merchant: { bg: "bg-accent-100", text: "text-accent-600", badge: "bg-accent-100 text-accent-800" },
    bank: { bg: "bg-info-100", text: "text-info-600", badge: "bg-info-100 text-info-800" },
    government: { bg: "bg-danger-100", text: "text-danger-600", badge: "bg-danger-100 text-danger-800" },
    other: { bg: "bg-main-200", text: "text-main-600", badge: "bg-main-200 text-main-800" },
};

const rowToParty = (row: PartyRow): Party => {
    return {
        id: String(row.id),
        userId: row.user_id,
        name: row.name,
        type: row.type as PartyType,
        phone: row.phone || "",
        email: row.email || "",
        notes: row.notes || "",
        createdAt: row.created_at ? new Date(row.created_at) : new Date(),
        updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(),
    };
};

export const partyService = {
    async getParties(userId: string): Promise<Party[]> {
        const cached = await offlineDb.getAll<PartyRow>("parties");
        const userCached = cached.filter(p => p.user_id === userId);

        if (typeof navigator !== "undefined" && navigator.onLine) {
            try {
                const { data, error } = await supabase
                    .from("parties")
                    .select("*")
                    .eq("user_id", userId)
                    .order("name", { ascending: true });

                if (!error && data) {
                    await offlineDb.clearStore("parties");
                    await offlineDb.putMany("parties", data);
                    return (data || []).map(row => rowToParty(row as PartyRow));
                }
            } catch (err) {
                console.warn("Failed to fetch parties online, using cache:", err);
            }
        }

        userCached.sort((a, b) => a.name.localeCompare(b.name));
        return userCached.map(rowToParty);
    },

    async getPartyById(id: string): Promise<Party | null> {
        const cached = await offlineDb.getById<PartyRow>("parties", id);
        if (cached) return rowToParty(cached);

        if (typeof navigator !== "undefined" && navigator.onLine) {
            try {
                const { data, error } = await supabase
                    .from("parties")
                    .select("*")
                    .eq("id", id)
                    .maybeSingle();

                if (error) throw error;
                if (!data) return null;
                return rowToParty(data as PartyRow);
            } catch (err) {
                console.warn("Failed to fetch party online:", err);
            }
        }

        return null;
    },

    async createParty(partyData: PartyCreateDTO, userId: string): Promise<Party> {
        return await syncManager.onUserMutation(async () => {
            const now = new Date().toISOString();
            const partyId = crypto.randomUUID ? crypto.randomUUID() : `party_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

            const newRow: PartyRow = {
                id: partyId,
                user_id: userId,
                name: partyData.name.trim(),
                type: partyData.type || "person",
                phone: partyData.phone?.trim() || "",
                email: partyData.email?.trim() || "",
                notes: partyData.notes?.trim() || "",
                created_at: now,
                updated_at: now,
            };

            // 1. Write immediately to local IndexedDB
            await offlineDb.put("parties", newRow);

            // 2. Sync to Supabase or queue
            if (typeof navigator !== "undefined" && navigator.onLine) {
                try {
                    const { data, error } = await supabase
                        .from("parties")
                        .insert([newRow])
                        .select()
                        .single();

                    if (error) throw error;
                    if (data) {
                        await offlineDb.put("parties", data);
                        return rowToParty(data as PartyRow);
                    }
                } catch (err) {
                    console.warn("Online party creation failed, queueing:", err);
                    await offlineDb.addToSyncQueue({
                        table: "parties",
                        action: "insert",
                        recordId: partyId,
                        payload: newRow,
                        userId,
                    });
                }
            } else {
                await offlineDb.addToSyncQueue({
                    table: "parties",
                    action: "insert",
                    recordId: partyId,
                    payload: newRow,
                    userId,
                });
            }

            return rowToParty(newRow);
        });
    },

    async updateParty(id: string, partyData: PartyUpdateDTO): Promise<void> {
        return await syncManager.onUserMutation(async () => {
            const cached = await offlineDb.getById<PartyRow>("parties", id);
            const updateData: PartyUpdate = {
                updated_at: new Date().toISOString(),
            };

            if (partyData.name !== undefined) updateData.name = partyData.name.trim();
            if (partyData.type !== undefined) updateData.type = partyData.type;
            if (partyData.phone !== undefined) updateData.phone = partyData.phone.trim();
            if (partyData.email !== undefined) updateData.email = partyData.email.trim();
            if (partyData.notes !== undefined) updateData.notes = partyData.notes.trim();

            // 1. Update IndexedDB immediately
            if (cached) {
                await offlineDb.put("parties", { ...cached, ...updateData });
            }

            // 2. Sync to Supabase or queue
            if (typeof navigator !== "undefined" && navigator.onLine) {
                try {
                    const { error } = await supabase
                        .from("parties")
                        .update(updateData)
                        .eq("id", id);

                    if (error) throw error;
                } catch (err) {
                    console.warn("Online party update failed, queueing:", err);
                    await offlineDb.addToSyncQueue({
                        table: "parties",
                        action: "update",
                        recordId: id,
                        payload: updateData,
                        userId: cached?.user_id || "",
                    });
                }
            } else {
                await offlineDb.addToSyncQueue({
                    table: "parties",
                    action: "update",
                    recordId: id,
                    payload: updateData,
                    userId: cached?.user_id || "",
                });
            }
        });
    },

    async deleteParty(id: string): Promise<void> {
        return await syncManager.onUserMutation(async () => {
            const cached = await offlineDb.getById<PartyRow>("parties", id);

            // 1. Delete from IndexedDB immediately
            await offlineDb.deleteItem("parties", id);

            // 2. Sync to Supabase or queue
            if (typeof navigator !== "undefined" && navigator.onLine) {
                try {
                    const { error } = await supabase
                        .from("parties")
                        .delete()
                        .eq("id", id);

                    if (error) throw error;
                } catch (err) {
                    console.warn("Online party delete failed, queueing:", err);
                    await offlineDb.addToSyncQueue({
                        table: "parties",
                        action: "delete",
                        recordId: id,
                        payload: {},
                        userId: cached?.user_id || "",
                    });
                }
            } else {
                await offlineDb.addToSyncQueue({
                    table: "parties",
                    action: "delete",
                    recordId: id,
                    payload: {},
                    userId: cached?.user_id || "",
                });
            }
        });
    },
};

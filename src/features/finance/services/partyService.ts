import { supabase } from "../../../supabase";
import type { Party, PartyCreateDTO, PartyUpdateDTO, PartyType } from "../../../types/party";
import type { Database } from "../../../types/database";

type PartyRow = Database["public"]["Tables"]["parties"]["Row"];
type PartyInsert = Database["public"]["Tables"]["parties"]["Insert"];
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
    person: { bg: "bg-blue-100 dark:bg-blue-950/40", text: "text-blue-600 dark:text-blue-400", badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300" },
    company: { bg: "bg-purple-100 dark:bg-purple-950/40", text: "text-purple-600 dark:text-purple-400", badge: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300" },
    employer: { bg: "bg-indigo-100 dark:bg-indigo-950/40", text: "text-indigo-600 dark:text-indigo-400", badge: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300" },
    customer: { bg: "bg-green-100 dark:bg-green-950/40", text: "text-green-600 dark:text-green-400", badge: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" },
    merchant: { bg: "bg-amber-100 dark:bg-amber-950/40", text: "text-amber-600 dark:text-amber-400", badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300" },
    bank: { bg: "bg-cyan-100 dark:bg-cyan-950/40", text: "text-cyan-600 dark:text-cyan-400", badge: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300" },
    government: { bg: "bg-rose-100 dark:bg-rose-950/40", text: "text-rose-600 dark:text-rose-400", badge: "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300" },
    other: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-600 dark:text-gray-400", badge: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300" },
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
        try {
            const { data, error } = await supabase
                .from("parties")
                .select("*")
                .eq("user_id", userId)
                .order("name", { ascending: true });

            if (error) throw error;
            return (data || []).map(row => rowToParty(row as PartyRow));
        } catch (error) {
            console.error("Error fetching parties:", error);
            throw error;
        }
    },

    async getPartyById(id: string): Promise<Party | null> {
        try {
            const { data, error } = await supabase
                .from("parties")
                .select("*")
                .eq("id", id)
                .maybeSingle();

            if (error) throw error;
            if (!data) return null;
            return rowToParty(data as PartyRow);
        } catch (error) {
            console.error("Error fetching party:", error);
            throw error;
        }
    },

    async createParty(partyData: PartyCreateDTO, userId: string): Promise<Party> {
        try {
            const now = new Date().toISOString();
            const insertData: PartyInsert = {
                user_id: userId,
                name: partyData.name.trim(),
                type: partyData.type || "person",
                phone: partyData.phone?.trim() || "",
                email: partyData.email?.trim() || "",
                notes: partyData.notes?.trim() || "",
                created_at: now,
                updated_at: now,
            };

            const { data, error } = await supabase
                .from("parties")
                .insert([insertData])
                .select()
                .single();

            if (error) throw error;
            return rowToParty(data as PartyRow);
        } catch (error) {
            console.error("Error creating party:", error);
            throw error;
        }
    },

    async updateParty(id: string, partyData: PartyUpdateDTO): Promise<void> {
        try {
            const updateData: PartyUpdate = {
                updated_at: new Date().toISOString(),
            };

            if (partyData.name !== undefined) updateData.name = partyData.name.trim();
            if (partyData.type !== undefined) updateData.type = partyData.type;
            if (partyData.phone !== undefined) updateData.phone = partyData.phone.trim();
            if (partyData.email !== undefined) updateData.email = partyData.email.trim();
            if (partyData.notes !== undefined) updateData.notes = partyData.notes.trim();

            const { error } = await supabase
                .from("parties")
                .update(updateData)
                .eq("id", id);

            if (error) throw error;
        } catch (error) {
            console.error("Error updating party:", error);
            throw error;
        }
    },

    async deleteParty(id: string): Promise<void> {
        try {
            const { error } = await supabase
                .from("parties")
                .delete()
                .eq("id", id);

            if (error) throw error;
        } catch (error) {
            console.error("Error deleting party:", error);
            throw error;
        }
    },
};

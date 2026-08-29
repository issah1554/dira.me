import { supabase } from "../../../supabase";
import type { Account, AccountCreateDTO, AccountUpdateDTO } from "../../../types/account";
import type { Database } from "../../../types/database";

type AccountRow = Database["public"]["Tables"]["accounts"]["Row"];
type AccountInsert = Database["public"]["Tables"]["accounts"]["Insert"];
type AccountUpdate = Database["public"]["Tables"]["accounts"]["Update"];

// Helper to get default icon based on account type
const getDefaultIcon = (type: string): string => {
    const iconMap: Record<string, string> = {
        "cash": "bi-wallet2",
        "savings": "bi-piggy-bank",
        "current": "bi-bank",
        "mobile": "bi-phone",
        "digital": "bi-wallet",
        "credit": "bi-credit-card"
    };
    return iconMap[type] || "bi-wallet2";
};

// Convert Supabase row to Account object
const rowToAccount = (row: AccountRow): Account => {
    const currentBalance = typeof row.current_balance === "number" ? row.current_balance : parseFloat(String(row.current_balance || "0")) || 0;
    const openingBalance = typeof row.opening_balance === "number" ? row.opening_balance : parseFloat(String(row.opening_balance || "0")) || 0;

    let createdAt: Date | undefined;
    if (row.created_at) {
        createdAt = new Date(row.created_at);
    }

    let updatedAt: Date | undefined;
    if (row.updated_at) {
        updatedAt = new Date(row.updated_at);
    }

    let lastTransaction = new Date().toISOString().split("T")[0];
    if (row.last_transaction) {
        try {
            lastTransaction = new Date(row.last_transaction).toISOString().split("T")[0];
        } catch {
            lastTransaction = String(row.last_transaction);
        }
    }

    return {
        id: String(row.id),
        name: row.name,
        type: row.type,
        balance: `₹${currentBalance.toLocaleString("en-IN")}`,
        accountNumber: row.account_number || "",
        status: (row.status as "active" | "inactive" | "pending") || "active",
        openingBalance,
        currentBalance,
        description: row.description || "",
        lastTransaction,
        createdAt: createdAt || new Date(),
        updatedAt: updatedAt || new Date(),
        icon: row.icon || getDefaultIcon(row.type),
        userId: row.user_id,
    };
};

// Account Service
export const accountService = {
    // Create new account
    async createAccount(accountData: AccountCreateDTO, userId: string): Promise<Account> {
        try {
            const openingBal = parseFloat(accountData.openingBalance?.toString() || "0") || 0;
            const now = new Date().toISOString();

            const newAccountRow: AccountInsert = {
                user_id: userId,
                name: accountData.name,
                type: accountData.type,
                account_number: accountData.accountNumber || "",
                status: "active",
                opening_balance: openingBal,
                current_balance: openingBal,
                description: accountData.description || "",
                icon: getDefaultIcon(accountData.type),
                last_transaction: now.split("T")[0],
                created_at: now,
                updated_at: now,
            };

            const { data, error } = await supabase
                .from("accounts")
                .insert([newAccountRow])
                .select()
                .single();

            if (error) throw error;
            return rowToAccount(data as AccountRow);
        } catch (error) {
            console.error("Error creating account:", error);
            throw error;
        }
    },

    // Get all accounts for a user
    async getAccounts(userId: string): Promise<Account[]> {
        try {
            const { data, error } = await supabase
                .from("accounts")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false });

            if (error) throw error;
            return (data || []).map((row) => rowToAccount(row as AccountRow));
        } catch (error) {
            console.error("Error fetching accounts:", error);
            throw error;
        }
    },

    // Get single account by ID
    async getAccountById(accountId: string): Promise<Account | null> {
        try {
            const { data, error } = await supabase
                .from("accounts")
                .select("*")
                .eq("id", accountId)
                .maybeSingle();

            if (error) throw error;
            return data ? rowToAccount(data as AccountRow) : null;
        } catch (error) {
            console.error("Error fetching account:", error);
            throw error;
        }
    },

    // Update account
    async updateAccount(accountId: string, accountData: AccountUpdateDTO): Promise<void> {
        try {
            const updates: AccountUpdate = {
                updated_at: new Date().toISOString(),
            };
            if (accountData.name !== undefined) updates.name = accountData.name;
            if (accountData.type !== undefined) {
                updates.type = accountData.type;
                updates.icon = getDefaultIcon(accountData.type);
            }
            if (accountData.status !== undefined) updates.status = accountData.status;
            if (accountData.description !== undefined) updates.description = accountData.description;

            const { error } = await supabase
                .from("accounts")
                .update(updates)
                .eq("id", accountId);

            if (error) throw error;
        } catch (error) {
            console.error("Error updating account:", error);
            throw error;
        }
    },

    // Delete account
    async deleteAccount(accountId: string): Promise<void> {
        try {
            const { error } = await supabase
                .from("accounts")
                .delete()
                .eq("id", accountId);

            if (error) throw error;
        } catch (error) {
            console.error("Error deleting account:", error);
            throw error;
        }
    },

    // Get account summary stats
    async getAccountSummary(userId: string): Promise<{
        totalBalance: number;
        activeAccounts: number;
        accountTypes: number;
    }> {
        try {
            const accounts = await this.getAccounts(userId);
            const activeAccounts = accounts.filter(acc => acc.status === "active");

            const totalBalance = activeAccounts.reduce((sum, acc) => {
                const balance = typeof acc.currentBalance === 'number'
                    ? acc.currentBalance
                    : parseFloat(String(acc.currentBalance || "0").replace(/[^0-9.-]+/g, ""));
                return sum + balance;
            }, 0);

            const uniqueTypes = new Set(activeAccounts.map(acc => acc.type));

            return {
                totalBalance,
                activeAccounts: activeAccounts.length,
                accountTypes: uniqueTypes.size
            };
        } catch (error) {
            console.error("Error getting account summary:", error);
            throw error;
        }
    }
};
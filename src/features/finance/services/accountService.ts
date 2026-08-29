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
    return iconMap[type.toLowerCase()] || "bi-wallet2";
};

// Convert Supabase row to Account object with calculated balance
const rowToAccount = (row: AccountRow, calculatedBalance?: number, calculatedLastTx?: string): Account => {
    const openingBalance = typeof row.opening_balance === "number" ? row.opening_balance : parseFloat(String(row.opening_balance || "0")) || 0;
    const currentBalance = calculatedBalance !== undefined
        ? calculatedBalance
        : (typeof row.current_balance === "number" ? row.current_balance : parseFloat(String(row.current_balance || "0")) || 0);

    let createdAt: Date | undefined;
    if (row.created_at) {
        createdAt = new Date(row.created_at);
    }

    let updatedAt: Date | undefined;
    if (row.updated_at) {
        updatedAt = new Date(row.updated_at);
    }

    let lastTransaction = calculatedLastTx || new Date().toISOString().split("T")[0];
    if (!calculatedLastTx && row.last_transaction) {
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
        balance: `${currentBalance.toLocaleString()} TZS`,
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
                name: accountData.name.trim(),
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
            return rowToAccount(data as AccountRow, openingBal);
        } catch (error) {
            console.error("Error creating account:", error);
            throw error;
        }
    },

    // Get all accounts for a user with dynamically computed balances from transactions
    async getAccounts(userId: string): Promise<Account[]> {
        try {
            const [accountsResult, transactionsResult] = await Promise.all([
                supabase
                    .from("accounts")
                    .select("*")
                    .eq("user_id", userId)
                    .order("created_at", { ascending: false }),
                supabase
                    .from("transactions")
                    .select("*")
                    .or(`user_id.eq.${userId},user_id.is.null`),
            ]);

            if (accountsResult.error) throw accountsResult.error;

            const transactions = transactionsResult.data || [];

            return (accountsResult.data || []).map((accountRow) => {
                // Find all transactions associated with this account (by name or by id)
                const accountTxList = transactions.filter(
                    (tx) => tx.account?.trim().toLowerCase() === accountRow.name?.trim().toLowerCase() ||
                            tx.account === accountRow.id
                );

                let net = 0;
                let latestDate = accountRow.last_transaction || "";

                accountTxList.forEach((tx) => {
                    const amt = Number(tx.amount) || 0;
                    if (tx.status !== "failed") {
                        if (tx.dc === "cr") {
                            net += amt; // Cash In
                        } else if (tx.dc === "dr") {
                            net -= amt; // Cash Out
                        }
                    }
                    if (tx.date) {
                        const txDateStr = tx.date.split("T")[0];
                        if (!latestDate || txDateStr > latestDate) {
                            latestDate = txDateStr;
                        }
                    }
                });

                const openingBal = Number(accountRow.opening_balance) || 0;
                const dynamicCurrentBalance = openingBal + net;

                return rowToAccount(accountRow as AccountRow, dynamicCurrentBalance, latestDate);
            });
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
            if (!data) return null;

            // Fetch transactions for this account to compute current balance
            const { data: txData } = await supabase
                .from("transactions")
                .select("*")
                .or(`account.eq.${data.name},account.eq.${data.id}`);

            let net = 0;
            (txData || []).forEach((tx) => {
                const amt = Number(tx.amount) || 0;
                if (tx.status !== "failed") {
                    if (tx.dc === "cr") net += amt;
                    else if (tx.dc === "dr") net -= amt;
                }
            });

            const openingBal = Number(data.opening_balance) || 0;
            return rowToAccount(data as AccountRow, openingBal + net);
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
            if (accountData.name !== undefined) updates.name = accountData.name.trim();
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
                return sum + (acc.currentBalance || 0);
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
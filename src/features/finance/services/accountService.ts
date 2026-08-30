import { supabase } from "../../../supabase";
import type { Account, AccountCreateDTO, AccountUpdateDTO, CurrencyCode } from "../../../types/account";
import type { Database } from "../../../types/database";
import { offlineDb } from "../../../lib/offline/offlineDb";
import { syncManager } from "../../../lib/offline/syncManager";

type AccountRow = Database["public"]["Tables"]["accounts"]["Row"];
type AccountUpdate = Database["public"]["Tables"]["accounts"]["Update"];

// Helper to format currency
export const formatCurrencyAmount = (amount: number, currency: CurrencyCode = "TZS"): string => {
    const val = amount || 0;
    if (currency === "USD") {
        return `$ ${val.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    }
    return `${val.toLocaleString()} TZS`;
};

// Helper to get default icon based on account type
const getDefaultIcon = (type: string): string => {
    const iconMap: Record<string, string> = {
        "cash": "bi-wallet2",
        "savings": "bi-piggy-bank",
        "checking": "bi-bank",
        "mobile_money": "bi-phone",
        "credit_card": "bi-credit-card",
        "investment": "bi-graph-up-arrow",
        "other": "bi-wallet",
    };
    return iconMap[type] || "bi-wallet";
};

// Helper to map DB row to Account object
const rowToAccount = (row: AccountRow, currentBalance?: number): Account => {
    const openingBal = typeof row.opening_balance === "number"
        ? row.opening_balance
        : parseFloat(String(row.opening_balance)) || 0;

    const computedCurrentBal = currentBalance !== undefined
        ? currentBalance
        : typeof row.current_balance === "number"
            ? row.current_balance
            : parseFloat(String(row.current_balance)) || openingBal;

    const curr = (row.currency as CurrencyCode) || "TZS";

    return {
        id: row.id,
        userId: row.user_id,
        name: row.name,
        type: row.type,
        currency: curr,
        openingBalance: openingBal,
        currentBalance: computedCurrentBal,
        transactionCount: 0,
        balance: formatCurrencyAmount(computedCurrentBal, curr),
        accountNumber: row.account_number || "",
        status: row.status,
        description: row.description || "",
        icon: row.icon || getDefaultIcon(row.type),
        lastTransaction: row.last_transaction || row.updated_at?.split("T")[0] || "",
        createdAt: row.created_at ? new Date(row.created_at) : new Date(),
        updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(),
    };
};

const computeAccountBalances = (accounts: AccountRow[], transactions: any[]): Account[] => {
    return accounts.map((accountRow) => {
        const accountTxList = transactions.filter(
            (tx) => tx.account?.trim().toLowerCase() === accountRow.name?.trim().toLowerCase() ||
                    tx.account === accountRow.id
        );

        let net = 0;
        let latestDate = accountRow.last_transaction || "";

        accountTxList.forEach((tx) => {
            const amt = Number(tx.amount) || 0;
            if (tx.status !== "failed") {
                const isCashIn = tx.type === "income" || tx.type === "borrow" || tx.type === "collection" || tx.dc === "cr";
                if (isCashIn) {
                    net += amt; // Cash In (Income / Borrow / Collection)
                } else {
                    net -= amt; // Cash Out (Expense / Repayment / Lend / Transfer)
                }
            }
            if (tx.date) {
                const txDateStr = String(tx.date).split("T")[0];
                if (!latestDate || txDateStr > latestDate) {
                    latestDate = txDateStr;
                }
            }
        });

        const openingBal = Number(accountRow.opening_balance) || 0;
        const dynamicCurrentBalance = openingBal + net;

        return {
            ...rowToAccount(accountRow, dynamicCurrentBalance),
            lastTransaction: latestDate || accountRow.last_transaction || "",
            transactionCount: accountTxList.length,
        };
    });
};

export const accountService = {
    // Create a new account
    async createAccount(accountData: AccountCreateDTO, userId: string): Promise<Account> {
        return await syncManager.onUserMutation(async () => {
            const openingBal = parseFloat(String(accountData.openingBalance || "0")) || 0;
            const currency: CurrencyCode = accountData.currency || "TZS";
            const now = new Date().toISOString();
            const accountId = crypto.randomUUID ? crypto.randomUUID() : `acc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

            const newAccountRow: AccountRow = {
                id: accountId,
                user_id: userId,
                name: accountData.name.trim(),
                type: accountData.type,
                currency,
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

            // 1. Write immediately to local IndexedDB
            await offlineDb.put("accounts", newAccountRow);

            // 2. If online, attempt to sync to Supabase; otherwise queue
            if (typeof navigator !== "undefined" && navigator.onLine) {
                try {
                    const { error } = await supabase
                        .from("accounts")
                        .insert([newAccountRow]);

                    if (error) throw error;
                } catch (err) {
                    console.warn("Online account creation failed, queueing for background sync:", err);
                    await offlineDb.addToSyncQueue({
                        table: "accounts",
                        action: "insert",
                        recordId: accountId,
                        payload: newAccountRow,
                        userId,
                    });
                }
            } else {
                await offlineDb.addToSyncQueue({
                    table: "accounts",
                    action: "insert",
                    recordId: accountId,
                    payload: newAccountRow,
                    userId,
                });
            }

            return rowToAccount(newAccountRow, openingBal);
        });
    },

    // Get all accounts for user
    async getAccounts(userId: string): Promise<Account[]> {
        const cachedAccounts = await offlineDb.getAll<AccountRow>("accounts");
        const cachedTx = await offlineDb.getAll<any>("transactions");
        const userCachedAccounts = cachedAccounts.filter(a => a.user_id === userId);

        if (typeof navigator !== "undefined" && navigator.onLine) {
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

                if (!accountsResult.error && accountsResult.data) {
                    // Update cache
                    await offlineDb.clearStore("accounts");
                    await offlineDb.putMany("accounts", accountsResult.data);

                    if (!transactionsResult.error && transactionsResult.data) {
                        await offlineDb.clearStore("transactions");
                        await offlineDb.putMany("transactions", transactionsResult.data);
                    }

                    return computeAccountBalances(accountsResult.data as AccountRow[], transactionsResult.data || []);
                }
            } catch (err) {
                console.warn("Error fetching online accounts, falling back to local cache:", err);
            }
        }

        // Return cached computed accounts
        return computeAccountBalances(userCachedAccounts, cachedTx);
    },

    // Get single account by ID
    async getAccountById(accountId: string): Promise<Account | null> {
        const cached = await offlineDb.getById<AccountRow>("accounts", accountId);
        const cachedTx = await offlineDb.getAll<any>("transactions");

        if (cached) {
            const computed = computeAccountBalances([cached], cachedTx);
            return computed[0] || null;
        }

        if (typeof navigator !== "undefined" && navigator.onLine) {
            try {
                const { data, error } = await supabase
                    .from("accounts")
                    .select("*")
                    .eq("id", accountId)
                    .maybeSingle();

                if (error) throw error;
                if (!data) return null;
                return rowToAccount(data as AccountRow);
            } catch (err) {
                console.warn("Failed to fetch account online:", err);
            }
        }

        return null;
    },

    // Update account
    async updateAccount(accountId: string, accountData: AccountUpdateDTO): Promise<void> {
        return await syncManager.onUserMutation(async () => {
            const cached = await offlineDb.getById<AccountRow>("accounts", accountId);
            const updates: AccountUpdate = {
                updated_at: new Date().toISOString(),
            };
            if (accountData.name !== undefined) updates.name = accountData.name.trim();
            if (accountData.type !== undefined) {
                updates.type = accountData.type;
                updates.icon = getDefaultIcon(accountData.type);
            }
            if (accountData.currency !== undefined) updates.currency = accountData.currency;
            if (accountData.status !== undefined) updates.status = accountData.status;
            if (accountData.description !== undefined) updates.description = accountData.description;

            // 1. Update IndexedDB immediately
            if (cached) {
                await offlineDb.put("accounts", { ...cached, ...updates });
            }

            // 2. Sync to Supabase or queue
            if (typeof navigator !== "undefined" && navigator.onLine) {
                try {
                    const { error } = await supabase
                        .from("accounts")
                        .update(updates)
                        .eq("id", accountId);

                    if (error) throw error;
                } catch (err) {
                    console.warn("Online account update failed, queueing:", err);
                    await offlineDb.addToSyncQueue({
                        table: "accounts",
                        action: "update",
                        recordId: accountId,
                        payload: updates,
                        userId: cached?.user_id || "",
                    });
                }
            } else {
                await offlineDb.addToSyncQueue({
                    table: "accounts",
                    action: "update",
                    recordId: accountId,
                    payload: updates,
                    userId: cached?.user_id || "",
                });
            }
        });
    },

    // Delete account
    async deleteAccount(accountId: string): Promise<void> {
        return await syncManager.onUserMutation(async () => {
            const cached = await offlineDb.getById<AccountRow>("accounts", accountId);

            // 1. Delete from IndexedDB immediately
            await offlineDb.deleteItem("accounts", accountId);

            // 2. Sync to Supabase or queue
            if (typeof navigator !== "undefined" && navigator.onLine) {
                try {
                    const { error } = await supabase
                        .from("accounts")
                        .delete()
                        .eq("id", accountId);

                    if (error) throw error;
                } catch (err) {
                    console.warn("Online account delete failed, queueing:", err);
                    await offlineDb.addToSyncQueue({
                        table: "accounts",
                        action: "delete",
                        recordId: accountId,
                        payload: {},
                        userId: cached?.user_id || "",
                    });
                }
            } else {
                await offlineDb.addToSyncQueue({
                    table: "accounts",
                    action: "delete",
                    recordId: accountId,
                    payload: {},
                    userId: cached?.user_id || "",
                });
            }
        });
    },

    // Get account summary stats
    async getAccountSummary(userId: string): Promise<{
        totalBalance: number;
        activeAccounts: number;
        accountTypes: number;
        balancesByCurrency: Record<CurrencyCode, number>;
    }> {
        try {
            const accounts = await this.getAccounts(userId);
            const activeAccounts = accounts.filter(acc => acc.status === "active");

            const balancesByCurrency: Record<CurrencyCode, number> = {
                TZS: 0,
                USD: 0,
            };

            let totalBalance = 0;
            activeAccounts.forEach(acc => {
                const bal = acc.currentBalance || 0;
                totalBalance += bal;
                const curr = acc.currency || "TZS";
                balancesByCurrency[curr] = (balancesByCurrency[curr] || 0) + bal;
            });

            const uniqueTypes = new Set(activeAccounts.map(acc => acc.type));

            return {
                totalBalance,
                activeAccounts: activeAccounts.length,
                accountTypes: uniqueTypes.size,
                balancesByCurrency,
            };
        } catch (error) {
            console.error("Error getting account summary:", error);
            throw error;
        }
    }
};

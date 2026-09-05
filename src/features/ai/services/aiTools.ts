// src/features/ai/services/aiTools.ts
import { supabase } from "../../../supabase";
import { accountService } from "../../finance/services/accountService";
import { TransactionService, type Transaction } from "../../finance/services/TransactionService";
import { categoryService } from "../../finance/services/categoryService";
import { partyService } from "../../finance/services/partyService";
import type { Account } from "../../../types/account";
import type { Party } from "../../../types/party";

export interface DraftTransactionAction {
    amount: number;
    fee?: number;
    type: "income" | "expense" | "transfer" | "borrow" | "repayment" | "lend" | "collection";
    accountId: string;
    accountName: string;
    toAccountId?: string;
    toAccountName?: string;
    partyId?: string;
    partyName?: string;
    category?: string;
    notes?: string;
    date?: string;
}

export const AI_TOOL_DEFINITIONS = [
    {
        name: "get_account_balances",
        description: "Retrieves all user bank, cash, and mobile-money accounts with their real-time balances and currencies.",
        parameters: {
            type: "OBJECT",
            properties: {},
        },
    },
    {
        name: "query_transactions",
        description: "Searches or filters the user's recorded ledger transactions by category, type, party name, or date range.",
        parameters: {
            type: "OBJECT",
            properties: {
                category: { type: "STRING", description: "Filter by category name, e.g. Food, Transport, Salary" },
                type: { type: "STRING", description: "Filter by transaction type: income, expense, transfer, borrow, repayment, lend, collection" },
                searchQuery: { type: "STRING", description: "Free-text search across notes, parties, or account names" },
                limit: { type: "NUMBER", description: "Max number of records to return (defaults to 15)" },
            },
        },
    },
    {
        name: "get_spending_analysis",
        description: "Calculates total expenses and spending percentage breakdown grouped by category.",
        parameters: {
            type: "OBJECT",
            properties: {
                period: { type: "STRING", description: "Timeframe: 'all', 'month', 'week'" },
            },
        },
    },
    {
        name: "get_counterparties",
        description: "Retrieves all registered parties/counterparties (customers, merchants, employers, friends) and debt balances.",
        parameters: {
            type: "OBJECT",
            properties: {},
        },
    },
    {
        name: "draft_transaction",
        description: "Creates an actionable transaction draft card that the user can review and click 'Confirm & Add to Ledger' to execute with one click.",
        parameters: {
            type: "OBJECT",
            properties: {
                amount: { type: "NUMBER", description: "The transaction amount (positive number)" },
                fee: { type: "NUMBER", description: "Transfer fee or charge if applicable (for transfer transactions)" },
                type: { type: "STRING", description: "Transaction type: 'income', 'expense', 'transfer', 'borrow', 'repayment', 'lend', 'collection'" },
                category: { type: "STRING", description: "Category name (e.g. Food, Transport, Salary, Housing, Utilities)" },
                accountName: { type: "STRING", description: "Name of the source account (e.g. Cash, NMB, CRDB, M-Pesa)" },
                toAccountName: { type: "STRING", description: "Destination account name if this is a transfer" },
                partyName: { type: "STRING", description: "Counterparty name if applicable" },
                notes: { type: "STRING", description: "Brief description or memo" },
            },
            required: ["amount", "type"],
        },
    },
];

export const aiToolExecutors = {
    async get_account_balances() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: "User not authenticated" };

        const accounts = await accountService.getAccounts(user.id).catch(() => []);
        return {
            accountsCount: accounts.length,
            accounts: accounts.map(a => ({
                id: a.id,
                name: a.name,
                type: a.type,
                currency: a.currency || "TZS",
                currentBalance: a.currentBalance,
                status: a.status,
            })),
        };
    },

    async query_transactions(args: { category?: string; type?: string; searchQuery?: string; limit?: number }) {
        const [transactions, accounts, parties] = await Promise.all([
            TransactionService.list().catch(() => [] as Transaction[]),
            (async () => {
                const { data: { user } } = await supabase.auth.getUser();
                return user ? accountService.getAccounts(user.id).catch(() => []) : [];
            })(),
            (async () => {
                const { data: { user } } = await supabase.auth.getUser();
                return user ? partyService.getParties(user.id).catch(() => []) : [];
            })(),
        ]);

        let filtered = [...transactions];

        if (args.category) {
            const cat = args.category.toLowerCase();
            filtered = filtered.filter(t => (t.category || "").toLowerCase().includes(cat));
        }

        if (args.type) {
            const typ = args.type.toLowerCase();
            filtered = filtered.filter(t => (t.type || "").toLowerCase() === typ);
        }

        if (args.searchQuery) {
            const q = args.searchQuery.toLowerCase();
            filtered = filtered.filter(t =>
                (t.notes || "").toLowerCase().includes(q) ||
                (t.category || "").toLowerCase().includes(q) ||
                String(t.amount).includes(q)
            );
        }

        const limit = args.limit || 15;
        const totalMatching = filtered.length;
        const results = filtered.slice(0, limit).map(t => {
            const acc = accounts.find((a: Account) => a.id === t.accountId);
            const party = parties.find((p: Party) => p.id === t.party_id);
            return {
                id: t.id,
                date: t.date,
                amount: t.amount,
                currency: t.currency || "TZS",
                type: t.type,
                category: t.category,
                accountName: acc?.name || "Account",
                partyName: party?.name || null,
                notes: t.notes,
                status: t.status,
            };
        });

        return {
            totalMatching,
            returnedCount: results.length,
            transactions: results,
        };
    },

    async get_spending_analysis(_args?: { period?: string }) {
        const transactions = await TransactionService.list().catch(() => [] as Transaction[]);
        const expenses = transactions.filter(t => t.type === "expense" || t.dc === "dr");

        const byCategory: Record<string, number> = {};
        let totalExpense = 0;

        expenses.forEach(t => {
            const cat = t.category || "General";
            const amt = Number(t.amount) || 0;
            byCategory[cat] = (byCategory[cat] || 0) + amt;
            totalExpense += amt;
        });

        const breakdown = Object.entries(byCategory)
            .sort((a, b) => b[1] - a[1])
            .map(([category, amount]) => ({
                category,
                amount,
                percentage: totalExpense > 0 ? Number(((amount / totalExpense) * 100).toFixed(1)) : 0,
            }));

        return {
            totalExpense,
            currency: "TZS",
            totalTransactionsAnalyzed: expenses.length,
            categoryBreakdown: breakdown,
        };
    },

    async get_counterparties() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: "User not authenticated" };

        const [parties, transactions] = await Promise.all([
            partyService.getParties(user.id).catch(() => []),
            TransactionService.list().catch(() => []),
        ]);

        const partyDetails = parties.map(p => {
            const relatedTxs = transactions.filter(t => t.party_id === p.id);
            const borrowed = relatedTxs.filter(t => t.type === "borrow").reduce((s, t) => s + (Number(t.amount) || 0), 0);
            const lent = relatedTxs.filter(t => t.type === "lend").reduce((s, t) => s + (Number(t.amount) || 0), 0);
            const repaid = relatedTxs.filter(t => t.type === "repayment").reduce((s, t) => s + (Number(t.amount) || 0), 0);
            const collected = relatedTxs.filter(t => t.type === "collection").reduce((s, t) => s + (Number(t.amount) || 0), 0);

            return {
                id: p.id,
                name: p.name,
                type: p.type,
                phone: p.phone,
                email: p.email,
                totalTransactions: relatedTxs.length,
                netDebtToParty: borrowed - repaid, // We owe them
                netLoanToParty: lent - collected,   // They owe us
            };
        });

        return {
            partiesCount: parties.length,
            parties: partyDetails,
        };
    },

    async draft_transaction(args: {
        amount: number;
        fee?: number;
        type: string;
        category?: string;
        accountName?: string;
        toAccountName?: string;
        partyName?: string;
        notes?: string;
    }): Promise<{ success: boolean; draft: DraftTransactionAction; message: string }> {
        const { data: { user } } = await supabase.auth.getUser();
        const [accounts, categories, parties] = await Promise.all([
            user ? accountService.getAccounts(user.id).catch(() => []) : [],
            categoryService.list().catch(() => []),
            user ? partyService.getParties(user.id).catch(() => []) : [],
        ]);

        // Match source account
        const matchedAccount = accounts.find(a =>
            args.accountName && a.name.toLowerCase().includes(args.accountName.toLowerCase())
        ) || accounts[0];

        // Match target account for transfer
        const matchedToAccount = args.toAccountName
            ? accounts.find(a => a.name.toLowerCase().includes(args.toAccountName!.toLowerCase()))
            : undefined;

        // Match party
        const matchedParty = args.partyName
            ? parties.find(p => p.name.toLowerCase().includes(args.partyName!.toLowerCase()))
            : undefined;

        // Match category
        const matchedCategory = args.category
            ? categories.find(c => c.name.toLowerCase() === args.category!.toLowerCase())?.name || args.category
            : "General";

        const validTypes = ["income", "expense", "transfer", "borrow", "repayment", "lend", "collection"] as const;
        const normalizedType = validTypes.includes(args.type as any) ? (args.type as DraftTransactionAction["type"]) : "expense";

        const fee = args.fee ? Number(args.fee) : undefined;

        const draft: DraftTransactionAction = {
            amount: Number(args.amount) || 0,
            fee: fee && fee > 0 ? fee : undefined,
            type: normalizedType,
            accountId: matchedAccount?.id || "",
            accountName: matchedAccount?.name || "Cash",
            toAccountId: matchedToAccount?.id,
            toAccountName: matchedToAccount?.name,
            partyId: matchedParty?.id,
            partyName: matchedParty?.name || args.partyName,
            category: matchedCategory,
            notes: args.notes || "",
            date: new Date().toISOString(),
        };

        return {
            success: true,
            draft,
            message: `Transaction draft created for ${draft.amount.toLocaleString()} TZS (${draft.type}). Ready for confirmation.`,
        };
    },
};

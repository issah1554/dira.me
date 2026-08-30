// src/features/ai/services/geminiService.ts
import { GoogleGenAI } from "@google/genai";
import { supabase } from "../../../supabase";
import { accountService } from "../../finance/services/accountService";
import { TransactionService, type Transaction } from "../../finance/services/TransactionService";
import { categoryService } from "../../finance/services/categoryService";
import { partyService } from "../../finance/services/partyService";
import type { Account } from "../../../types/account";
import type { Party } from "../../../types/party";
import type { TransactionCategory } from "../../../types/category";

export interface ChatMessage {
    id: string;
    role: "user" | "model";
    content: string;
    timestamp: Date;
    suggestedAction?: {
        type: "create_transaction";
        data: {
            amount?: number;
            type?: string;
            category?: string;
            account?: string;
            party?: string;
            notes?: string;
        };
    };
}

const getApiKey = (): string => {
    return (
        import.meta.env.VITE_GEMINI_API_KEY ||
        import.meta.env.GEMINI_API_KEY ||
        ""
    );
};

export const geminiService = {
    isConfigured(): boolean {
        return Boolean(getApiKey());
    },

    async buildFinancialContext(): Promise<string> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const userId = user?.id || "";

            const [accounts, transactions, categories, parties]: [
                Account[],
                Transaction[],
                TransactionCategory[],
                Party[]
            ] = await Promise.all([
                userId ? accountService.getAccounts(userId).catch(() => []) : Promise.resolve([]),
                TransactionService.list().catch(() => []),
                categoryService.list().catch(() => []),
                userId ? partyService.getParties(userId).catch(() => []) : Promise.resolve([]),
            ]);

            const accountSummary = accounts
                .map((a: Account) => `- ${a.name} (${a.type}, ${a.currency}): Balance ${a.currentBalance}`)
                .join("\n");

            const categoryList = categories
                .map((c: TransactionCategory) => `- ${c.name}${c.description ? `: ${c.description}` : ""}`)
                .join("\n");

            const partyList = parties
                .map((p: Party) => `- ${p.name} (${p.type})${p.phone ? ` Tel: ${p.phone}` : ""}`)
                .join("\n");

            const recentTxs = transactions
                .slice(0, 15)
                .map((t: Transaction) => {
                    const acc = accounts.find((a: Account) => a.id === t.accountId)?.name || "Account";
                    const party = parties.find((p: Party) => p.id === t.party_id)?.name || "";
                    const partyStr = party ? ` with ${party}` : "";
                    return `- ${t.date.split("T")[0]}: ${t.type.toUpperCase()} of ${t.amount} ${t.currency || "TZS"} (${t.category})${partyStr} via ${acc} - "${t.notes}" [Status: ${t.status}]`;
                })
                .join("\n");

            const today = new Date().toISOString().split("T")[0];

            return `
CURRENT USER FINANCIAL CONTEXT (Date: ${today}):

[ACCOUNTS & BALANCES]
${accountSummary || "No accounts found."}

[TRANSACTION CATEGORIES]
${categoryList || "No categories found."}

[COUNTERPARTIES / PARTIES]
${partyList || "No parties recorded."}

[RECENT TRANSACTIONS]
${recentTxs || "No transactions recorded yet."}
`;
        } catch (err) {
            console.warn("Could not assemble full financial context:", err);
            return "Financial context currently unavailable.";
        }
    },

    async sendMessage(
        messages: { role: "user" | "model"; content: string }[],
        userPrompt: string
    ): Promise<string> {
        const apiKey = getApiKey();
        if (!apiKey) {
            throw new Error(
                "Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file."
            );
        }

        const financialContext = await this.buildFinancialContext();

        const systemInstruction = `You are Dira AI, an intelligent, friendly, and highly capable personal and business financial assistant for the Dira.me bookkeeping and financial ledger app.

Your role:
1. Provide accurate financial analysis, spending insights, budget suggestions, and debt/cash-flow calculations based on the user's live financial data.
2. Help users formulate budgets, track expenses, understand where their money is going, and provide actionable financial advice.
3. If the user asks to record or draft a transaction (e.g., "I spent 20,000 on groceries with Cash", "Received 500k salary"), extract the details clearly:
   - Type (Income, Expense, Transfer, Borrow, Repayment, Lend, Collection)
   - Amount
   - Category (matching their categories if possible)
   - Account
   - Party/Counterparty (if mentioned)
   - Notes
4. Communicate clearly using clean Markdown (bullet points, bold highlights, tables where applicable, concise summaries).
5. Currency context: The user predominantly uses TZS (Tanzanian Shilling) and USD. Format currency amounts nicely.
6. Be polite, professional, encouraging, and accurate.

${financialContext}`;

        try {
            const ai = new GoogleGenAI({ apiKey });

            const formattedContents = [
                ...messages.map(m => ({
                    role: m.role,
                    parts: [{ text: m.content }],
                })),
                {
                    role: "user",
                    parts: [{ text: userPrompt }],
                },
            ];

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: formattedContents,
                config: {
                    systemInstruction: {
                        parts: [{ text: systemInstruction }],
                    },
                    temperature: 0.7,
                },
            });

            return response.text || "I'm sorry, I couldn't generate a response. Please try again.";
        } catch (err: any) {
            console.error("Gemini API call error:", err);
            // Fallback try with 1.5-flash if 2.5-flash encounters an issue
            try {
                const ai = new GoogleGenAI({ apiKey });
                const response = await ai.models.generateContent({
                    model: "gemini-1.5-flash",
                    contents: [
                        {
                            role: "user",
                            parts: [{ text: `${systemInstruction}\n\nUser Question: ${userPrompt}` }],
                        },
                    ],
                });
                return response.text || "I'm sorry, I couldn't generate a response.";
            } catch (fallbackErr: any) {
                throw new Error(
                    err?.message || fallbackErr?.message || "Failed to communicate with Gemini AI."
                );
            }
        }
    },
};

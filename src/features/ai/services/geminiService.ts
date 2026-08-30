// src/features/ai/services/geminiService.ts
import { GoogleGenAI, type FunctionDeclaration } from "@google/genai";
import { supabase } from "../../../supabase";
import { accountService } from "../../finance/services/accountService";
import { TransactionService, type Transaction } from "../../finance/services/TransactionService";
import { categoryService } from "../../finance/services/categoryService";
import { partyService } from "../../finance/services/partyService";
import {
    AI_TOOL_DEFINITIONS,
    aiToolExecutors,
    type DraftTransactionAction,
} from "./aiTools";
import type { Account } from "../../../types/account";
import type { Party } from "../../../types/party";
import type { TransactionCategory } from "../../../types/category";

export interface ChatMessage {
    id: string;
    role: "user" | "model";
    content: string;
    timestamp: Date;
    modelUsed?: string;
    draftAction?: DraftTransactionAction;
    isExecuted?: boolean;
}

/**
 * Priority model candidates list matching Google AI Studio Free Tier Quotas & Fallbacks
 */
const CANDIDATE_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-1.5-pro",
];

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

    /**
     * Gather live user financial data from IndexedDB / Supabase
     */
    async getFinancialSnapshot(): Promise<{
        accounts: Account[];
        transactions: Transaction[];
        categories: TransactionCategory[];
        parties: Party[];
    }> {
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

            return { accounts, transactions, categories, parties };
        } catch (err) {
            console.warn("Could not retrieve full financial snapshot:", err);
            return { accounts: [], transactions: [], categories: [], parties: [] };
        }
    },

    async buildFinancialContext(): Promise<string> {
        const { accounts, transactions, categories, parties } = await this.getFinancialSnapshot();

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
    },

    /**
     * Local Context-Aware Zero-Downtime Deterministic Fallback Engine
     * Executes when all Gemini models fail (429 quota exhausted, offline, network failure)
     * Supports both English and Swahili (Kiswahili) intent analysis
     */
    async generateLocalFallbackResponse(userPrompt: string): Promise<{ text: string; draftAction?: DraftTransactionAction }> {
        const { accounts, transactions, categories, parties } = await this.getFinancialSnapshot();
        const q = userPrompt.toLowerCase();

        // 1. Transaction Draft Parsing Intent (e.g. "I spent 15000 on lunch", "Nimelipa 20000 ya mafuta kwa NMB")
        const amountMatch = q.match(/(\d+[\d,.]*|\d+k)/i);
        const isExpenseIntent = q.includes("spent") || q.includes("paid") || q.includes("bought") || q.includes("tumia") || q.includes("nimenunua") || q.includes("nimelipa") || q.includes("gharama");
        const isIncomeIntent = q.includes("received") || q.includes("earned") || q.includes("salary") || q.includes("mshahara") || q.includes("nimepokea") || q.includes("mapato");

        if (amountMatch && (isExpenseIntent || isIncomeIntent)) {
            let rawAmtStr = amountMatch[1].replace(/,/g, "");
            let amt = 0;
            if (rawAmtStr.toLowerCase().endsWith("k")) {
                amt = parseFloat(rawAmtStr) * 1000;
            } else {
                amt = parseFloat(rawAmtStr);
            }

            if (amt > 0) {
                const draftResult = await aiToolExecutors.draft_transaction({
                    amount: amt,
                    type: isIncomeIntent ? "income" : "expense",
                    category: categories.find(c => q.includes(c.name.toLowerCase()))?.name || (isIncomeIntent ? "Salary" : "Food"),
                    accountName: accounts.find(a => q.includes(a.name.toLowerCase()))?.name,
                    partyName: parties.find(p => q.includes(p.name.toLowerCase()))?.name,
                    notes: userPrompt,
                });

                return {
                    text: `### 📝 Muamala Umetayarishwa (Transaction Drafted)

Nimeweka tayari taarifa za muamala wa **${amt.toLocaleString()} TZS** (${isIncomeIntent ? "Mapato/Income" : "Matumizi/Expense"}). 

Tafadhali kagua kadi iliyo hapo chini kisha bonyeza **"Confirm & Add to Ledger"** kuuhifadhi moja kwa moja.`,
                    draftAction: draftResult.draft,
                };
            }
        }

        // 2. Balance / Accounts Inquiry
        if (q.includes("balance") || q.includes("salio") || q.includes("account") || q.includes("akaunti") || q.includes("how much") || q.includes("pesa")) {
            if (accounts.length === 0) {
                return {
                    text: "Huna akaunti yoyote iliyosajiliwa bado. Nenda **Finance > Accounts** kuongeza akaunti ya benki au fedha taslimu.\n\n*You currently have no registered accounts.*",
                };
            }

            const totalTZS = accounts
                .filter(a => (a.currency || "TZS") === "TZS")
                .reduce((sum, a) => sum + (Number(a.currentBalance) || 0), 0);
            const totalUSD = accounts
                .filter(a => a.currency === "USD")
                .reduce((sum, a) => sum + (Number(a.currentBalance) || 0), 0);

            const lines = accounts.map(
                a => `* **${a.name}** (${a.type}): **${Number(a.currentBalance).toLocaleString()} ${a.currency || "TZS"}**`
            );

            return {
                text: `### 💰 Muhtasari wa Salio (Account Balances)

${lines.join("\n")}

---
**Jumla ya Salio (Total Net Balance):**
* **${totalTZS.toLocaleString()} TZS**
${totalUSD > 0 ? `* **$ ${totalUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD**` : ""}

*(Generated via Dira Local Offline Engine)*`,
            };
        }

        // 3. Spending & Category Analysis
        if (q.includes("spend") || q.includes("matumizi") || q.includes("expense") || q.includes("food") || q.includes("transport") || q.includes("summary") || q.includes("ripoti")) {
            const spending = await aiToolExecutors.get_spending_analysis();

            if (spending.categoryBreakdown.length === 0) {
                return {
                    text: "Hakuna miamala ya matumizi iliyorekodiwa bado. Utakapoongeza miamala, uchanganuzi wa kina utaonekana hapa.\n\n*(No expense transactions recorded yet.)*",
                };
            }

            const catLines = spending.categoryBreakdown.map(
                c => `* **${c.category}**: ${c.amount.toLocaleString()} TZS (${c.percentage}%)`
            );

            return {
                text: `### 📊 Uchanganuzi wa Matumizi (Spending Breakdown)

Mchanganuo wa matumizi yako kulingana na vipengele (categories):
${catLines.join("\n")}

---
**Jumla ya Matumizi:** **${spending.totalExpense.toLocaleString()} TZS** (Jumla ya miamala: ${spending.totalTransactionsAnalyzed})

*(Generated via Dira Local Offline Engine)*`,
            };
        }

        // 4. Counterparties / Debts Inquiry
        if (q.includes("party") || q.includes("parties") || q.includes("wateja") || q.includes("madeni") || q.includes("who owes") || q.includes("borrow") || q.includes("lend") || q.includes("debt")) {
            const partyData = await aiToolExecutors.get_counterparties();
            const partyList = partyData?.parties || [];

            if (partyList.length === 0) {
                return {
                    text: "Huna wahusika (counterparties) waliosajiliwa bado. Unaweza kuongeza kupitia **Finance > Parties**.",
                };
            }

            const partyLines = partyList.map(p => {
                let debtStr = "";
                if (p.netDebtToParty > 0) debtStr = ` — Unamdai: ${p.netDebtToParty.toLocaleString()} TZS`;
                if (p.netLoanToParty > 0) debtStr = ` — Anakudai: ${p.netLoanToParty.toLocaleString()} TZS`;
                return `* **${p.name}** (${p.type})${p.phone ? ` • Tel: ${p.phone}` : ""}${debtStr}`;
            });

            return {
                text: `### 🤝 Wahusika na Madeni (Parties & Debt Status)

${partyLines.join("\n")}

*(Generated via Dira Local Offline Engine)*`,
            };
        }

        // 5. Budgeting / Saving Advice
        if (q.includes("budget") || q.includes("save") || q.includes("bajeti") || q.includes("weka akiba") || q.includes("tip")) {
            return {
                text: `### 💡 Mwongozo wa Bajeti (50/30/20 Budget Framework)

1. **50% Mahitaji Muhimu (Needs)**: Kodi ya nyumba, Umeme, Maji, Chakula, Mafuta.
2. **30% Matumizi ya Ziada (Wants)**: Burudani, Manunuzi binafsi, Migahawa.
3. **20% Akiba na Madeni (Savings & Debt)**: Mfuko wa dharura na kulipa madeni.

👉 *Ushauri*: Rekodi miamala yako kila siku kwenye Dira ili kuwa na udhibiti kamili wa fedha zako.

*(Generated via Dira Local Offline Engine)*`,
            };
        }

        // 6. Default Contextual Overview
        const totalBal = accounts.reduce((s, a) => s + (Number(a.currentBalance) || 0), 0);
        return {
            text: `### 🌟 Dira Financial Intelligence Overview

* **Akaunti Zilizo Hai (Active Accounts)**: ${accounts.length} (${totalBal.toLocaleString()} TZS total)
* **Miamala Iliyorekodiwa (Transactions)**: ${transactions.length}
* **Vipengele (Categories)**: ${categories.length}

Unaweza kuniuliza kwa Kiingereza au Kiswahili:
* *"Salio la akaunti zangu"* / *"What is my total account balance?"*
* *"Mchanganuo wa matumizi kwa mwezi"* / *"Summarize my spending by category"*
* *"Nani ananidai?"* / *"List my registered counterparties and debts"*
* *"Nimelipa 15,000 ya chakula kwa Cash"* / *"Draft an expense of 20,000"*

*(Generated via Dira Local Offline Engine)*`,
        };
    },

    /**
     * Send message using Multi-Model Priority Cascade and Function Calling
     */
    async sendMessage(
        messages: { role: "user" | "model"; content: string }[],
        userPrompt: string
    ): Promise<{ text: string; modelUsed: string; draftAction?: DraftTransactionAction }> {
        const apiKey = getApiKey();
        const financialContext = await this.buildFinancialContext();

        const systemInstruction = `You are Dira AI, an intelligent, friendly, and highly capable personal and business financial assistant for the Dira.me bookkeeping and financial ledger app.

Your role:
1. Provide accurate financial analysis, spending insights, budget suggestions, and debt/cash-flow calculations based on the user's live financial data.
2. Answer fluently in both English and Kiswahili depending on the user's language choice.
3. You have access to real-time database tools:
   - 'get_account_balances': to check live balances.
   - 'query_transactions': to search past transactions.
   - 'get_spending_analysis': to calculate category spending and percentages.
   - 'get_counterparties': to check parties and debt balances.
   - 'draft_transaction': when the user mentions wanting to record or add a transaction (e.g. "I spent 20,000 on groceries with Cash", "Nimelipa 50k kwa NMB"), CALL 'draft_transaction' so the user receives a confirmation card!
4. Communicate clearly using clean Markdown (bullet points, bold highlights, tables where applicable, concise summaries).
5. Currency context: The user predominantly uses TZS (Tanzanian Shilling) and USD. Format currency amounts nicely.

${financialContext}`;

        // If no API key configured, use local intelligence directly
        if (!apiKey) {
            console.warn("[Dira AI] No Gemini API Key found. Utilizing local expert engine.");
            const fallback = await this.generateLocalFallbackResponse(userPrompt);
            return {
                text: fallback.text,
                modelUsed: "Dira Local Offline Engine",
                draftAction: fallback.draftAction,
            };
        }

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

        // Format tools for Gemini API
        const functionDeclarations: FunctionDeclaration[] = AI_TOOL_DEFINITIONS.map(tool => ({
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters as any,
        }));

        let capturedDraftAction: DraftTransactionAction | undefined;

        // Model Cascade Loop: Try each candidate model in priority order
        for (const candidate of CANDIDATE_MODELS) {
            try {
                const ai = new GoogleGenAI({ apiKey });

                const response = await ai.models.generateContent({
                    model: candidate,
                    contents: formattedContents,
                    config: {
                        systemInstruction: {
                            parts: [{ text: systemInstruction }],
                        },
                        temperature: 0.7,
                        tools: [{ functionDeclarations }],
                    },
                });

                // Check if model returned function calls
                const functionCalls = response.functionCalls;
                if (functionCalls && functionCalls.length > 0) {
                    for (const call of functionCalls) {
                        const toolName = call.name;
                        if (toolName && toolName in aiToolExecutors) {
                            const executor = (aiToolExecutors as any)[toolName];
                            const result = await executor(call.args || {});
                            if (toolName === "draft_transaction" && result?.draft) {
                                capturedDraftAction = result.draft;
                            }
                        }
                    }

                    // If draft_transaction was called, generate a helpful companion message or use model text
                    if (capturedDraftAction) {
                        return {
                            text: response.text || `I have prepared your **${capturedDraftAction.type.toUpperCase()}** transaction draft for **${capturedDraftAction.amount.toLocaleString()} TZS**. Please review and confirm below.`,
                            modelUsed: candidate,
                            draftAction: capturedDraftAction,
                        };
                    }
                }

                if (response && response.text) {
                    console.info(`[Dira AI] Successfully generated response using model ${candidate}`);
                    return {
                        text: response.text,
                        modelUsed: candidate,
                        draftAction: capturedDraftAction,
                    };
                }
            } catch (err: any) {
                console.warn(
                    `[Dira AI] Model ${candidate} failed (${err?.message || err}). Cascading to next candidate...`
                );
                continue;
            }
        }

        // All LLMs exhausted or offline: Fall back gracefully to Local Database Expert
        console.warn("[Dira AI] All online LLM models failed. Engaging local database expert.");
        const fallback = await this.generateLocalFallbackResponse(userPrompt);
        return {
            text: fallback.text,
            modelUsed: "Dira Local Offline Engine",
            draftAction: fallback.draftAction,
        };
    },
};

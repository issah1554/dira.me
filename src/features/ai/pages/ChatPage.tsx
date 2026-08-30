// src/features/ai/pages/ChatPage.tsx
import { useState, useRef, useEffect } from "react";
import { geminiService, type ChatMessage } from "../services/geminiService";
import { useAccounts } from "../../finance/hooks/useAccounts";
import { useTransactions } from "../../finance/hooks/useTransactions";

const PROMPT_CATEGORIES = [
    {
        title: "Financial Overview",
        icon: "bi-pie-chart",
        prompts: [
            "What is my net balance and active accounts breakdown?",
            "Summarize all transactions from this month",
            "Show my top 3 biggest expenses",
        ],
    },
    {
        title: "Budgeting & Saving",
        icon: "bi-piggy-bank",
        prompts: [
            "How can I cut expenses based on my spending patterns?",
            "Create a realistic 50/30/20 budget plan for my income",
            "Are there any recurring fees or unusual transactions?",
        ],
    },
    {
        title: "Debts & Counterparties",
        icon: "bi-people",
        prompts: [
            "Who are my registered counterparties and what is my transaction history with them?",
            "Analyze my borrowed vs lent money",
        ],
    },
    {
        title: "Ledger Assistant",
        icon: "bi-journal-plus",
        prompts: [
            "Draft an expense entry: 35,000 TZS for Electricity via Bank",
            "Explain how double-entry bookkeeping works for transfers",
        ],
    },
];

export default function ChatPage() {
    const { summary, formatCurrency } = useAccounts();
    const { data: transactions } = useTransactions();

    const [messages, setMessages] = useState<ChatMessage[]>(() => [
        {
            id: "welcome-full-1",
            role: "model",
            content:
                "Welcome to **Dira AI Assistant**! 🌟\n\nI am connected to your live Dira ledger, including your accounts, categories, and transactions. You can ask me to analyze your finances, give budget recommendations, breakdown category spending, or help format new ledger entries.\n\nHow can I help you today?",
            timestamp: new Date(),
        },
    ]);

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const handleSendMessage = async (textToSend?: string) => {
        const query = (textToSend || input).trim();
        if (!query || loading) return;

        const userMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            role: "user",
            content: query,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMsg]);
        if (!textToSend) setInput("");
        setLoading(true);
        setError(null);

        try {
            const history = messages
                .filter(m => m.id !== "welcome-full-1")
                .map(m => ({ role: m.role, content: m.content }));

            const responseText = await geminiService.sendMessage(history, query);

            const aiMsg: ChatMessage = {
                id: `ai-${Date.now()}`,
                role: "model",
                content: responseText,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (err: any) {
            console.error("AI Error:", err);
            setError(err?.message || "Failed to communicate with Gemini AI.");
        } finally {
            setLoading(false);
        }
    };

    const handleClearChat = () => {
        setMessages([
            {
                id: "welcome-full-1",
                role: "model",
                content:
                    "Conversation reset! 🚀 How can I assist with your financial analysis or budgeting?",
                timestamp: new Date(),
            },
        ]);
        setError(null);
    };

    const formatMessageContent = (text: string) => {
        return text.split("\n").map((line, idx) => {
            const isBullet = line.trim().startsWith("- ") || line.trim().startsWith("* ");
            const isNumbered = /^\d+\.\s/.test(line.trim());
            const isHeader = line.trim().startsWith("### ") || line.trim().startsWith("## ");

            let formattedLine = line;
            if (isBullet) formattedLine = line.trim().substring(2);
            if (isHeader) formattedLine = line.trim().replace(/^#{2,3}\s/, "");

            const parts = formattedLine.split(/(\*\*.*?\*\*)/g);

            const renderedParts = parts.map((part, pIdx) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                    return <strong key={pIdx} className="font-semibold text-main-900">{part.slice(2, -2)}</strong>;
                }
                return part;
            });

            if (isHeader) {
                return (
                    <h5 key={idx} className="font-bold text-main-900 mt-2.5 mb-1 text-sm sm:text-base">
                        {renderedParts}
                    </h5>
                );
            }

            if (isBullet || isNumbered) {
                return (
                    <li key={idx} className="ml-5 list-disc text-sm text-main-700 leading-relaxed">
                        {renderedParts}
                    </li>
                );
            }

            if (!line.trim()) {
                return <div key={idx} className="h-2" />;
            }

            return (
                <p key={idx} className="text-sm text-main-700 leading-relaxed">
                    {renderedParts}
                </p>
            );
        });
    };

    return (
        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-120px)] text-main-700">
            {/* Left / Main Chat Container */}
            <div className="flex-1 flex flex-col bg-main-200/50 border border-main-300 rounded-2xl overflow-hidden shadow-sm">
                {/* Chat Header */}
                <div className="px-5 py-4 bg-main-100 border-b border-main-300 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-purple-600 text-white flex items-center justify-center shadow-sm">
                            <i className="bi bi-stars text-xl" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-base text-main-900">Dira AI Financial Advisor</h3>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                                    Gemini 2.5
                                </span>
                            </div>
                            <p className="text-xs text-main-500 flex items-center gap-1.5 mt-0.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                                Synchronized with {summary.activeAccounts} accounts & {transactions.length} transactions
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleClearChat}
                        className="px-3 py-1.5 text-xs font-medium text-main-600 hover:text-main-900 hover:bg-main-200 border border-main-300 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Clear conversation"
                    >
                        <i className="bi bi-arrow-counterclockwise" />
                        <span>Clear Chat</span>
                    </button>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-main-100/60 dark:bg-main-200/30 min-h-[360px]">
                    {messages.map(msg => {
                        const isUser = msg.role === "user";
                        return (
                            <div
                                key={msg.id}
                                className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                            >
                                {!isUser && (
                                    <div className="w-8 h-8 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0 border border-primary/30 mt-0.5">
                                        <i className="bi bi-stars text-sm" />
                                    </div>
                                )}

                                <div
                                    className={`max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl space-y-1.5 ${
                                        isUser
                                            ? "bg-primary text-white rounded-tr-none shadow-sm"
                                            : "bg-main-100 border border-main-300 text-main-800 rounded-tl-none shadow-sm"
                                    }`}
                                >
                                    {isUser ? (
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                    ) : (
                                        formatMessageContent(msg.content)
                                    )}
                                    <p
                                        className={`text-[10px] mt-1.5 text-right ${
                                            isUser ? "text-white/70" : "text-main-400"
                                        }`}
                                    >
                                        {new Date(msg.timestamp).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </div>
                        );
                    })}

                    {/* Typing Animation */}
                    {loading && (
                        <div className="flex items-center gap-3 text-main-500">
                            <div className="w-8 h-8 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0 border border-primary/30">
                                <i className="bi bi-stars text-sm" />
                            </div>
                            <div className="bg-main-100 border border-main-300 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2 shadow-sm">
                                <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" />
                                <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                                <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-start gap-2.5">
                            <i className="bi bi-exclamation-triangle-fill text-base mt-0.5 shrink-0" />
                            <div>
                                <p className="font-semibold">AI Assistant Notice</p>
                                <p className="text-xs mt-0.5">{error}</p>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        handleSendMessage();
                    }}
                    className="p-4 bg-main-100 border-t border-main-300 flex items-center gap-3"
                >
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Ask Dira AI anything about your ledger, expenses, or financial plans..."
                        disabled={loading}
                        className="flex-1 bg-main-200/70 border border-main-300 rounded-xl px-4 py-3 text-sm text-main placeholder:text-main-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="px-5 py-3 rounded-xl bg-primary text-white font-medium flex items-center gap-2 hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md cursor-pointer shrink-0"
                    >
                        {loading ? (
                            <>
                                <i className="bi bi-arrow-clockwise animate-spin text-sm" />
                                <span>Thinking...</span>
                            </>
                        ) : (
                            <>
                                <span>Send</span>
                                <i className="bi bi-send-fill text-xs" />
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Right Sidebar: Context & Suggested Topics */}
            <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0">
                {/* Balance & Context Widget */}
                <div className="bg-main-200/60 border border-main-300 rounded-2xl p-4 space-y-3 shadow-sm">
                    <h4 className="font-bold text-sm text-main-900 flex items-center gap-2">
                        <i className="bi bi-wallet2 text-primary" />
                        Live Account Context
                    </h4>

                    <div className="bg-main-100 rounded-xl p-3 border border-main-300">
                        <p className="text-xs text-main-500">Total Net Balance</p>
                        <p className="text-xl font-bold text-main-900 mt-0.5">{formatCurrency(summary.totalBalance)}</p>
                        <p className="text-[11px] text-main-400 mt-1">Across {summary.activeAccounts} active account(s)</p>
                    </div>

                    <div className="text-xs text-main-500 space-y-1">
                        <p className="flex items-center gap-1.5">
                            <i className="bi bi-check2-circle text-emerald-500" />
                            Transactions synced: <strong className="text-main-700">{transactions.length}</strong>
                        </p>
                        <p className="flex items-center gap-1.5">
                            <i className="bi bi-shield-check text-primary" />
                            Private & secure prompt isolation
                        </p>
                    </div>
                </div>

                {/* Prompt Categories */}
                <div className="bg-main-200/60 border border-main-300 rounded-2xl p-4 space-y-4 shadow-sm flex-1 overflow-y-auto">
                    <h4 className="font-bold text-sm text-main-900 flex items-center gap-2">
                        <i className="bi bi-lightbulb text-amber-500" />
                        Suggested Inquiries
                    </h4>

                    {PROMPT_CATEGORIES.map((cat, cIdx) => (
                        <div key={cIdx} className="space-y-1.5">
                            <h5 className="text-xs font-semibold text-main-600 flex items-center gap-1.5 uppercase tracking-wider">
                                <i className={`bi ${cat.icon} text-primary`} />
                                {cat.title}
                            </h5>
                            <div className="space-y-1">
                                {cat.prompts.map((p, pIdx) => (
                                    <button
                                        key={pIdx}
                                        onClick={() => handleSendMessage(p)}
                                        className="w-full text-left p-2 rounded-lg bg-main-100 hover:bg-primary/10 hover:text-primary hover:border-primary/40 border border-main-300 text-xs text-main-700 transition-all cursor-pointer leading-snug"
                                    >
                                        &quot;{p}&quot;
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

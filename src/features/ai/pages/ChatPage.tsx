// src/features/ai/pages/ChatPage.tsx
import { useState, useRef, useEffect } from "react";
import { useAiChat } from "../hooks/useAiChat";
import { TransactionDraftCard } from "../components/TransactionDraftCard";
import { useAccounts } from "../../finance/hooks/useAccounts";
import { useTransactions } from "../../finance/hooks/useTransactions";
import { Toast } from "../../../components/ui/Toast";

const PROMPT_CATEGORIES = [
    {
        title: "Financial Overview / Salio",
        icon: "bi-pie-chart",
        prompts: [
            "What is my net balance and active accounts breakdown?",
            "Salio la akaunti zangu zote",
            "Show my top 3 biggest expenses",
        ],
    },
    {
        title: "Action & Ledger / Miamala",
        icon: "bi-journal-plus",
        prompts: [
            "Nimelipa 35,000 ya Umeme kupitia Benki",
            "I spent 15,000 TZS on Fuel via Cash",
            "Nimepokea 500k mshahara wa mwezi huu",
        ],
    },
    {
        title: "Budgeting & Saving / Bajeti",
        icon: "bi-piggy-bank",
        prompts: [
            "How can I cut expenses based on my spending patterns?",
            "Nipe ushauri wa bajeti wa 50/30/20",
            "Are there any recurring fees or unusual transactions?",
        ],
    },
    {
        title: "Debts & Counterparties / Madeni",
        icon: "bi-people",
        prompts: [
            "Who are my registered counterparties and what is my transaction history with them?",
            "Nani ananidai au nani ninamdai?",
        ],
    },
];

export default function ChatPage() {
    const { summary, formatCurrency } = useAccounts();
    const { data: transactions } = useTransactions();

    const {
        sessions,
        activeSessionId,
        messages,
        loading,
        error,
        createNewSession,
        switchSession,
        deleteSession,
        clearCurrentChat,
        sendMessage,
        executeDraftAction,
    } = useAiChat();

    const [input, setInput] = useState("");
    const [sidebarTab, setSidebarTab] = useState<"history" | "prompts">("prompts");

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const handleSend = (textToSend?: string) => {
        const query = (textToSend || input).trim();
        if (!query || loading) return;
        if (!textToSend) setInput("");
        sendMessage(query);
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        Toast.fire({ icon: "success", title: "Copied to clipboard" });
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
        <div className="flex-1 flex flex-col lg:flex-row gap-5 min-h-[calc(100vh-120px)] text-main-700">
            {/* Main Chat Container */}
            <div className="flex-1 flex flex-col bg-main-200/50 border border-main-300 rounded-2xl overflow-hidden shadow-sm min-h-[500px]">
                {/* Chat Header */}
                <div className="px-5 py-3.5 bg-main-100 border-b border-main-300 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary via-indigo-600 to-purple-600 text-main-0 flex items-center justify-center shadow-sm">
                            <i className="bi bi-stars text-xl animate-pulse" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-base text-main-900">Dira AI Assistant</h3>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                                    Multi-Model
                                </span>
                            </div>
                            <p className="text-xs text-main-500 flex items-center gap-1.5 mt-0.5">
                                <span className="w-2 h-2 rounded-full bg-success-500 inline-block" />
                                Connected to {summary.activeAccounts} accounts & {transactions.length} transactions
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={createNewSession}
                            className="px-3 py-1.5 text-xs font-semibold bg-primary text-main-0 hover:bg-primary/90 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                            title="Start fresh conversation"
                        >
                            <i className="bi bi-plus-lg text-xs" />
                            <span>New Chat</span>
                        </button>

                        <button
                            onClick={clearCurrentChat}
                            className="px-3 py-1.5 text-xs font-medium text-main-600 hover:text-main-900 hover:bg-main-200 border border-main-300 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                            title="Reset current conversation"
                        >
                            <i className="bi bi-arrow-counterclockwise" />
                            <span className="hidden sm:inline">Reset</span>
                        </button>
                    </div>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-main-100/60">
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
                                    className={`max-w-[88%] sm:max-w-[78%] px-4 py-3 rounded-2xl space-y-2 ${
                                        isUser
                                            ? "bg-primary text-main-0 rounded-tr-none shadow-sm"
                                            : "bg-main-100 border border-main-300 text-main-800 rounded-tl-none shadow-sm"
                                    }`}
                                >
                                    {isUser ? (
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                    ) : (
                                        formatMessageContent(msg.content)
                                    )}

                                    {/* Action Card if transaction was drafted */}
                                    {msg.draftAction && (
                                        <TransactionDraftCard
                                            messageId={msg.id}
                                            draft={msg.draftAction}
                                            isExecuted={msg.isExecuted}
                                            onExecute={executeDraftAction}
                                        />
                                    )}

                                    {/* Message Footer: Model Badge & Timestamp & Copy */}
                                    <div
                                        className={`flex items-center justify-between text-[10px] pt-1.5 border-t ${
                                            isUser
                                                ? "border-main-0/20 text-main-0/70"
                                                : "border-main-300/60 text-main-400"
                                        }`}
                                    >
                                        <span className="flex items-center gap-1.5">
                                            {msg.modelUsed && (
                                                <span className="px-1.5 py-0.2 bg-main-300/50 rounded text-[9px] font-medium">
                                                    {msg.modelUsed}
                                                </span>
                                            )}
                                            <span>
                                                {new Date(msg.timestamp).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </span>

                                        {!isUser && (
                                            <button
                                                onClick={() => handleCopy(msg.content)}
                                                className="hover:text-primary transition-colors cursor-pointer"
                                                title="Copy response"
                                            >
                                                <i className="bi bi-clipboard text-xs" />
                                            </button>
                                        )}
                                    </div>
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
                        <div className="p-4 bg-danger-500/10 border border-danger-500/30 rounded-xl text-danger-600 text-sm flex items-start gap-2.5">
                            <i className="bi bi-exclamation-triangle-fill text-base mt-0.5 shrink-0" />
                            <div>
                                <p className="font-semibold">Notice</p>
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
                        handleSend();
                    }}
                    className="p-4 bg-main-100 border-t border-main-300 flex items-center gap-3"
                >
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Uliza chochote / Ask Dira AI anything about ledger, expenses, or budgets..."
                        disabled={loading}
                        className="flex-1 bg-main-200/70 border border-main-300 rounded-xl px-4 py-3 text-sm text-main placeholder:text-main-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="px-5 py-3 rounded-xl bg-primary text-main-0 font-semibold flex items-center gap-2 hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md cursor-pointer shrink-0"
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

            {/* Right Sidebar: Tabs for Chat History & Context / Prompts */}
            <div className="w-full lg:w-80 flex flex-col gap-3 shrink-0">
                {/* Balance & Context Widget */}
                <div className="bg-main-200/60 border border-main-300 rounded-2xl p-4 space-y-3 shadow-sm">
                    <h4 className="font-bold text-sm text-main-900 flex items-center gap-2">
                        <i className="bi bi-wallet2 text-primary" />
                        Live Account Balances
                    </h4>

                    <div className="bg-main-100 rounded-xl p-3 border border-main-300">
                        <p className="text-xs text-main-500">Total Net Balance</p>
                        <p className="text-xl font-bold text-main-900 mt-0.5">{formatCurrency(summary.totalBalance)}</p>
                        <p className="text-[11px] text-main-400 mt-1">Across {summary.activeAccounts} active account(s)</p>
                    </div>

                    <div className="flex border border-main-300 rounded-lg p-0.5 bg-main-100 text-xs">
                        <button
                            onClick={() => setSidebarTab("prompts")}
                            className={`flex-1 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                                sidebarTab === "prompts" ? "bg-primary text-main-0" : "text-main-600 hover:text-main-900"
                            }`}
                        >
                            Prompts
                        </button>
                        <button
                            onClick={() => setSidebarTab("history")}
                            className={`flex-1 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                                sidebarTab === "history" ? "bg-primary text-main-0" : "text-main-600 hover:text-main-900"
                            }`}
                        >
                            History ({sessions.length})
                        </button>
                    </div>
                </div>

                {/* Tab: Suggested Inquiries */}
                {sidebarTab === "prompts" && (
                    <div className="bg-main-200/60 border border-main-300 rounded-2xl p-4 space-y-4 shadow-sm flex-1 overflow-y-auto max-h-[500px]">
                        <h4 className="font-bold text-sm text-main-900 flex items-center gap-2">
                            <i className="bi bi-lightbulb text-accent-500" />
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
                                            onClick={() => handleSend(p)}
                                            className="w-full text-left p-2 rounded-lg bg-main-100 hover:bg-primary/10 hover:text-primary hover:border-primary/40 border border-main-300 text-xs text-main-700 transition-all cursor-pointer leading-snug"
                                        >
                                            &quot;{p}&quot;
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Tab: Chat History / Sessions */}
                {sidebarTab === "history" && (
                    <div className="bg-main-200/60 border border-main-300 rounded-2xl p-4 space-y-3 shadow-sm flex-1 overflow-y-auto max-h-[500px]">
                        <div className="flex items-center justify-between">
                            <h4 className="font-bold text-sm text-main-900 flex items-center gap-2">
                                <i className="bi bi-clock-history text-primary" />
                                Saved Threads
                            </h4>
                            <button
                                onClick={createNewSession}
                                className="text-xs text-primary font-semibold hover:underline cursor-pointer"
                            >
                                + New Thread
                            </button>
                        </div>

                        <div className="space-y-1.5">
                            {sessions.map(s => {
                                const isActive = s.id === activeSessionId;
                                return (
                                    <div
                                        key={s.id}
                                        onClick={() => switchSession(s.id)}
                                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs transition-all cursor-pointer ${
                                            isActive
                                                ? "bg-primary/10 border-primary text-primary font-semibold shadow-xs"
                                                : "bg-main-100 border-main-300 text-main-700 hover:bg-main-200/70"
                                        }`}
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate">{s.title || "Conversation"}</p>
                                            <p className="text-[10px] text-main-400 font-normal">
                                                {s.messages.length} messages • {new Date(s.updatedAt).toLocaleDateString()}
                                            </p>
                                        </div>

                                        {sessions.length > 1 && (
                                            <button
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    deleteSession(s.id);
                                                }}
                                                className="text-main-400 hover:text-danger p-1 rounded transition-colors cursor-pointer"
                                                title="Delete thread"
                                            >
                                                <i className="bi bi-trash text-xs" />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// src/features/ai/components/FloatingChatbot.tsx
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAiChat } from "../hooks/useAiChat";
import { TransactionDraftCard } from "./TransactionDraftCard";
import { Toast } from "../../../components/ui/Toast";

const SUGGESTED_PROMPTS = [
    "📊 Summarize my recent spending",
    "💰 Salio la akaunti zangu zote",
    "🏷️ How much did I spend on Food?",
    "📝 Nimelipa 20,000 ya mafuta kwa NMB",
    "💡 Give me 3 tips to optimize my budget",
];

export function FloatingChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const {
        messages,
        loading,
        error,
        sendMessage,
        clearCurrentChat,
        executeDraftAction,
    } = useAiChat();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            inputRef.current?.focus();
        }
    }, [isOpen, messages, loading]);

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
                    <h5 key={idx} className="font-bold text-main-900 mt-2 mb-1 text-xs sm:text-sm">
                        {renderedParts}
                    </h5>
                );
            }

            if (isBullet || isNumbered) {
                return (
                    <li key={idx} className="ml-4 list-disc text-xs text-main-700 leading-relaxed">
                        {renderedParts}
                    </li>
                );
            }

            if (!line.trim()) {
                return <div key={idx} className="h-1.5" />;
            }

            return (
                <p key={idx} className="text-xs text-main-700 leading-relaxed">
                    {renderedParts}
                </p>
            );
        });
    };

    return (
        <aside aria-label="AI Assistant" className="fixed bottom-5 right-5 z-50 font-sans">
            {/* Floating Action Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-primary via-indigo-600 to-purple-600 text-white rounded-full shadow-xl hover:shadow-primary/30 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
                    title="Open Dira AI Assistant"
                    aria-label="Open AI Assistant"
                >
                    <div className="relative">
                        <i className="bi bi-stars text-lg animate-pulse" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-white animate-ping" />
                    </div>
                    <span className="text-sm font-bold tracking-wide">Dira AI</span>
                </button>
            )}

            {/* Chatbot Window */}
            {isOpen && (
                <div className="w-[94vw] sm:w-[430px] h-[580px] max-h-[85vh] bg-main-100 dark:bg-main-200 border border-main-300 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in">
                    {/* Header */}
                    <div className="px-4 py-3 bg-gradient-to-r from-primary/95 via-indigo-600 to-purple-700 text-white flex items-center justify-between shadow-sm shrink-0">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <i className="bi bi-stars text-white text-base" />
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <h4 className="font-bold text-sm leading-tight">Dira AI</h4>
                                    <span className="px-1.5 py-0.2 bg-white/20 text-white text-[9px] font-semibold rounded-full">
                                        Multi-Model Engine
                                    </span>
                                </div>
                                <p className="text-[10px] text-white/80 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                                    Live Financial Tools Connected
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={clearCurrentChat}
                                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                title="Reset conversation"
                                aria-label="Clear chat"
                            >
                                <i className="bi bi-arrow-counterclockwise text-sm" />
                            </button>
                            <Link
                                to="/ai/chat"
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                                title="Expand to full screen"
                                aria-label="Open Full Page AI"
                            >
                                <i className="bi bi-arrows-angle-expand text-xs" />
                            </Link>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                title="Minimize"
                                aria-label="Close chat"
                            >
                                <i className="bi bi-x-lg text-sm" />
                            </button>
                        </div>
                    </div>

                    {/* Messages Thread */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-main-100 dark:bg-main-200">
                        {messages.map(msg => {
                            const isUser = msg.role === "user";
                            return (
                                <div
                                    key={msg.id}
                                    className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                                >
                                    {!isUser && (
                                        <div className="w-7 h-7 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5 border border-primary/30">
                                            <i className="bi bi-stars text-xs" />
                                        </div>
                                    )}

                                    <div
                                        className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs space-y-1.5 ${
                                            isUser
                                                ? "bg-primary text-white rounded-tr-none shadow-sm"
                                                : "bg-main-200/80 border border-main-300 text-main-800 rounded-tl-none shadow-sm"
                                        }`}
                                    >
                                        {isUser ? (
                                            <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                        ) : (
                                            formatMessageContent(msg.content)
                                        )}

                                        {/* Action Card if draft was created */}
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
                                            className={`flex items-center justify-between text-[9px] pt-1 border-t ${
                                                isUser
                                                    ? "border-white/20 text-white/70"
                                                    : "border-main-300/60 text-main-400"
                                            }`}
                                        >
                                            <span className="flex items-center gap-1">
                                                {msg.modelUsed && (
                                                    <span className="px-1.5 py-0.2 bg-main-300/40 rounded text-[8px] font-medium truncate max-w-28">
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
                                                    <i className="bi bi-clipboard text-[10px]" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Loading Typing Indicator */}
                        {loading && (
                            <div className="flex items-center gap-2 text-main-500 text-xs animate-fade-in">
                                <div className="w-7 h-7 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 border border-primary/30">
                                    <i className="bi bi-stars text-xs" />
                                </div>
                                <div className="bg-main-200/80 border border-main-300 px-3.5 py-2.5 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-xs flex items-start gap-2">
                                <i className="bi bi-exclamation-triangle-fill text-sm mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-semibold">Notice</p>
                                    <p className="text-[11px] mt-0.5">{error}</p>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggested Prompts (if chat has few messages) */}
                    {messages.length <= 2 && !loading && (
                        <div className="px-3 py-2 bg-main-200/50 border-t border-main-300 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
                            {SUGGESTED_PROMPTS.map((prompt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSend(prompt.replace(/^[^\w]+/, ""))}
                                    className="whitespace-nowrap px-2.5 py-1 bg-main-100 hover:bg-primary/10 hover:text-primary hover:border-primary/40 border border-main-300 rounded-full text-[11px] font-medium text-main-600 transition-all cursor-pointer shrink-0"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input Bar */}
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            handleSend();
                        }}
                        className="p-2.5 bg-main-200 border-t border-main-300 flex items-center gap-2 shrink-0"
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Uliza chochote / Ask Dira AI anything..."
                            disabled={loading}
                            className="flex-1 bg-main-100 border border-main-300 rounded-xl px-3.5 py-2 text-xs text-main placeholder:text-main-400 focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer shrink-0"
                            aria-label="Send message"
                        >
                            {loading ? (
                                <i className="bi bi-arrow-clockwise animate-spin text-sm" />
                            ) : (
                                <i className="bi bi-send-fill text-xs" />
                            )}
                        </button>
                    </form>
                </div>
            )}
        </aside>
    );
}

// src/features/ai/hooks/useAiChat.ts
import { useState, useEffect, useCallback } from "react";
import { geminiService, type ChatMessage } from "../services/geminiService";
import type { DraftTransactionAction } from "../services/aiTools";
import { TransactionService } from "../../finance/services/TransactionService";
import { Toast } from "../../../components/ui/Toast";

export interface ChatSession {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    messages: ChatMessage[];
}

const STORAGE_KEY_SESSIONS = "dira_ai_chat_sessions_v1";
const STORAGE_KEY_ACTIVE_ID = "dira_ai_active_session_id_v1";

const createDefaultSession = (): ChatSession => {
    const id = `session-${Date.now()}`;
    return {
        id,
        title: "New Conversation",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [
            {
                id: `welcome-${Date.now()}`,
                role: "model",
                content:
                    "Habari! 👋 I'm **Dira AI**, your financial intelligence assistant. I am connected to your live ledger, accounts, categories, and transactions.\n\nHow can I help you today? *(Unaweza kuuliza kwa Kiswahili au Kiingereza)*",
                timestamp: new Date(),
                modelUsed: "Dira AI",
            },
        ],
    };
};

export function useAiChat() {
    const [sessions, setSessions] = useState<ChatSession[]>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_SESSIONS);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch (e) {
            console.warn("Could not load stored AI sessions:", e);
        }
        return [createDefaultSession()];
    });

    const [activeSessionId, setActiveSessionId] = useState<string>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
            if (stored) return stored;
        } catch (e) {
            console.warn("Could not read active session ID:", e);
        }
        return sessions[0]?.id || "session-default";
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Save sessions whenever updated
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
        } catch (e) {
            console.warn("Failed to persist AI sessions:", e);
        }
    }, [sessions]);

    // Save active session ID
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY_ACTIVE_ID, activeSessionId);
        } catch (e) {
            console.warn("Failed to persist active session ID:", e);
        }
    }, [activeSessionId]);

    const currentSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

    const createNewSession = useCallback(() => {
        const newSession = createDefaultSession();
        setSessions(prev => [newSession, ...prev]);
        setActiveSessionId(newSession.id);
        setError(null);
        return newSession.id;
    }, []);

    const switchSession = useCallback((sessionId: string) => {
        setActiveSessionId(sessionId);
        setError(null);
    }, []);

    const deleteSession = useCallback((sessionId: string) => {
        setSessions(prev => {
            const filtered = prev.filter(s => s.id !== sessionId);
            if (filtered.length === 0) {
                const def = createDefaultSession();
                setActiveSessionId(def.id);
                return [def];
            }
            if (activeSessionId === sessionId) {
                setActiveSessionId(filtered[0].id);
            }
            return filtered;
        });
    }, [activeSessionId]);

    const clearCurrentChat = useCallback(() => {
        if (!currentSession) return;
        const resetMsg: ChatMessage = {
            id: `welcome-${Date.now()}`,
            role: "model",
            content: "Conversation reset! ✨ How can I assist your financial planning or bookkeeping?",
            timestamp: new Date(),
            modelUsed: "Dira AI",
        };

        setSessions(prev =>
            prev.map(s =>
                s.id === currentSession.id
                    ? { ...s, messages: [resetMsg], updatedAt: new Date().toISOString() }
                    : s
            )
        );
        setError(null);
    }, [currentSession]);

    const sendMessage = useCallback(
        async (userPrompt: string) => {
            const query = userPrompt.trim();
            if (!query || loading || !currentSession) return;

            const userMsg: ChatMessage = {
                id: `user-${Date.now()}`,
                role: "user",
                content: query,
                timestamp: new Date(),
            };

            // Update session messages immediately
            setSessions(prev =>
                prev.map(s => {
                    if (s.id === currentSession.id) {
                        const newTitle =
                            s.messages.length <= 1
                                ? query.slice(0, 30) + (query.length > 30 ? "..." : "")
                                : s.title;
                        return {
                            ...s,
                            title: newTitle,
                            messages: [...s.messages, userMsg],
                            updatedAt: new Date().toISOString(),
                        };
                    }
                    return s;
                })
            );

            setLoading(true);
            setError(null);

            try {
                const history = currentSession.messages
                    .filter(m => !m.id.startsWith("welcome-"))
                    .map(m => ({ role: m.role, content: m.content }));

                const result = await geminiService.sendMessage(history, query);

                const aiMsg: ChatMessage = {
                    id: `ai-${Date.now()}`,
                    role: "model",
                    content: result.text,
                    timestamp: new Date(),
                    modelUsed: result.modelUsed,
                    draftAction: result.draftAction,
                };

                setSessions(prev =>
                    prev.map(s =>
                        s.id === currentSession.id
                            ? {
                                  ...s,
                                  messages: [...s.messages, aiMsg],
                                  updatedAt: new Date().toISOString(),
                              }
                            : s
                    )
                );
            } catch (err: any) {
                console.error("AI Error:", err);
                setError(err?.message || "Failed to communicate with AI Assistant.");
            } finally {
                setLoading(false);
            }
        },
        [currentSession, loading]
    );

    const executeDraftAction = useCallback(
        async (messageId: string, draft: DraftTransactionAction) => {
            try {
                if (draft.type === "transfer" && draft.toAccountId) {
                    await TransactionService.createTransfer({
                        fromAccount: draft.accountId,
                        toAccount: draft.toAccountId,
                        amount: draft.amount,
                        fee: draft.fee,
                        notes: draft.notes || "Transfer via Dira AI",
                        category: draft.category || "Transfer",
                        date: draft.date || new Date().toISOString(),
                        status: "completed",
                    });
                } else {
                    await TransactionService.create({
                        amount: draft.amount,
                        type: draft.type,
                        accountId: draft.accountId,
                        party_id: draft.partyId || null,
                        category: draft.category || "General",
                        notes: draft.notes || `Added via Dira AI (${draft.type})`,
                        date: draft.date || new Date().toISOString(),
                        currency: "TZS",
                        status: "completed",
                    });
                }

                // Mark message as executed
                setSessions(prev =>
                    prev.map(s => ({
                        ...s,
                        messages: s.messages.map(m =>
                            m.id === messageId ? { ...m, isExecuted: true } : m
                        ),
                    }))
                );

                Toast.fire({
                    icon: "success",
                    title: `Transaction recorded: ${draft.amount.toLocaleString()} TZS`,
                });
            } catch (err: any) {
                console.error("Failed to execute transaction draft:", err);
                Toast.fire({
                    icon: "error",
                    title: "Could not record transaction. Please check account details.",
                });
            }
        },
        []
    );

    return {
        sessions,
        activeSessionId,
        currentSession,
        messages: currentSession?.messages || [],
        loading,
        error,
        createNewSession,
        switchSession,
        deleteSession,
        clearCurrentChat,
        sendMessage,
        executeDraftAction,
    };
}

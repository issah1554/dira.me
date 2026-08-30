// src/features/ai/components/TransactionDraftCard.tsx
import { useState } from "react";
import type { DraftTransactionAction } from "../services/aiTools";
import { Button } from "../../../components/ui/Buttons";

interface TransactionDraftCardProps {
    messageId: string;
    draft: DraftTransactionAction;
    isExecuted?: boolean;
    onExecute: (messageId: string, draft: DraftTransactionAction) => Promise<void>;
}

export function TransactionDraftCard({
    messageId,
    draft,
    isExecuted = false,
    onExecute,
}: TransactionDraftCardProps) {
    const [submitting, setSubmitting] = useState(false);

    const isIncome = draft.type === "income" || draft.type === "borrow" || draft.type === "collection";
    const isTransfer = draft.type === "transfer";

    const handleConfirm = async () => {
        if (isExecuted || submitting) return;
        setSubmitting(true);
        try {
            await onExecute(messageId, draft);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-2.5 p-3.5 bg-main-100 dark:bg-main-300/60 border-2 border-primary/40 rounded-xl space-y-2.5 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                        Transaction Action Card
                    </span>
                </div>
                <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        isIncome
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : isTransfer
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                            : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                    }`}
                >
                    {draft.type}
                </span>
            </div>

            {/* Amount */}
            <div className="flex items-baseline justify-between border-b border-main-300 pb-2">
                <span className="text-xs text-main-500 font-medium">Proposed Amount:</span>
                <span
                    className={`text-base font-extrabold ${
                        isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                    }`}
                >
                    {isIncome ? "+" : "-"} {draft.amount.toLocaleString()} TZS
                </span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-1.5 text-xs text-main-700">
                <div>
                    <span className="text-[10px] text-main-400 block font-medium">
                        {isTransfer ? "From Account:" : "Account:"}
                    </span>
                    <span className="font-semibold text-main-800 flex items-center gap-1 truncate">
                        <i className="bi bi-wallet2 text-primary text-[10px]" />
                        {draft.accountName || "Cash"}
                    </span>
                </div>

                {isTransfer && draft.toAccountName && (
                    <div>
                        <span className="text-[10px] text-main-400 block font-medium">To Account:</span>
                        <span className="font-semibold text-main-800 flex items-center gap-1 truncate">
                            <i className="bi bi-bank text-primary text-[10px]" />
                            {draft.toAccountName}
                        </span>
                    </div>
                )}

                {!isTransfer && draft.category && (
                    <div>
                        <span className="text-[10px] text-main-400 block font-medium">Category:</span>
                        <span className="font-semibold text-main-800 flex items-center gap-1 truncate">
                            <i className="bi bi-tag text-primary text-[10px]" />
                            {draft.category}
                        </span>
                    </div>
                )}

                {draft.partyName && (
                    <div>
                        <span className="text-[10px] text-main-400 block font-medium">Counterparty:</span>
                        <span className="font-semibold text-main-800 flex items-center gap-1 truncate">
                            <i className="bi bi-person text-primary text-[10px]" />
                            {draft.partyName}
                        </span>
                    </div>
                )}
            </div>

            {draft.notes && (
                <p className="text-[11px] text-main-500 italic bg-main-200/50 px-2 py-1 rounded">
                    &quot;{draft.notes}&quot;
                </p>
            )}

            {/* Action Button */}
            <div className="pt-1">
                {isExecuted ? (
                    <div className="w-full py-1.5 px-3 bg-emerald-500/15 border border-emerald-500/30 rounded-lg text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5">
                        <i className="bi bi-check-circle-fill text-emerald-500" />
                        <span>Recorded to Ledger</span>
                    </div>
                ) : (
                    <Button
                        size="xs"
                        color="primary"
                        className="w-full justify-center py-2 text-xs font-bold shadow-sm"
                        disabled={submitting}
                        onClick={handleConfirm}
                    >
                        {submitting ? (
                            <>
                                <i className="bi bi-arrow-clockwise animate-spin mr-1.5" />
                                <span>Recording...</span>
                            </>
                        ) : (
                            <>
                                <i className="bi bi-journal-plus mr-1.5" />
                                <span>Confirm & Add to Ledger</span>
                            </>
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
}

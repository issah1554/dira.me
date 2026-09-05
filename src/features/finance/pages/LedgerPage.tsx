import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import CollapsibleTable, { type Column } from "../../../components/ui/Table";
import { Button } from "../../../components/ui/Buttons";
import { Toast } from "../../../components/ui/Toast";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../../../components/ui/Modal";
import { TextInput } from "../../../components/ui/TextInput";
import { DatePicker } from "../../../components/ui/DatePicker";
import { TimePicker } from "../../../components/ui/TimePicker";
import { SearchableSelect, type SearchableOption } from "../../../components/ui/SearchableSelect";
import { useTransactions } from "../hooks/useTransactions";
import { useAccounts } from "../hooks/useAccounts";
import { useParties } from "../hooks/useParties";
import { useCategories } from "../hooks/useCategories";
import { useTransactionTypes } from "../hooks/useTransactionTypes";
import { partyTypeIcons, partyTypeColors } from "../services/partyService";
import { categoryColorStyles } from "../services/categoryService";
import { transactionTypeConfig, type Transaction } from "../services/TransactionService";
import type { TransactionType } from "../../../types/database";
import Loader from "../../../components/ui/Loaders";

/* =======================
   Helpers
======================= */

const getCurrentTimeStr = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};


/* =======================
   Component
======================= */

export default function LedgerPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const accountParam = searchParams.get("account") || searchParams.get("accountId") || "";

    const {
        data: transactions,
        loading,
        create: createTransaction,
        createTransfer,
        update: updateTransaction,
        updateTransfer,
        remove: removeTransaction,
        removeTransfer,
    } = useTransactions();
    const { accounts, loadAccounts } = useAccounts();
    const { parties } = useParties();
    const { categories } = useCategories();
    const { types: dynamicTypes, typeConfigMap } = useTransactionTypes();

    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingTransferId, setEditingTransferId] = useState<string | null>(null);
    const [viewingTransaction, setViewingTransaction] = useState<Transaction | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState("");

    // Category options for searchable select
    const categoryOptions: SearchableOption[] = useMemo(() => {
        return categories.map(c => ({
            value: c.name,
            label: c.name,
            subtext: c.description || undefined,
            icon: c.icon || "bi-tag",
            badge: c.color,
            badgeClass: categoryColorStyles[c.color || "primary"]?.badge,
        }));
    }, [categories]);

    // Party options for searchable select
    const partyOptions: SearchableOption[] = useMemo(() => {
        return parties.map(p => {
            const colors = partyTypeColors[p.type] || partyTypeColors.other;
            const icon = partyTypeIcons[p.type] || "bi-person";
            const sub = [p.phone, p.email, p.notes].filter(Boolean).join(" • ");
            return {
                value: p.id,
                label: p.name,
                subtext: sub || undefined,
                badge: p.type,
                badgeClass: colors.badge,
                icon,
            };
        });
    }, [parties]);

    // Minimal Filter State
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(Boolean(accountParam));
    const [filterType, setFilterType] = useState<string>("");
    const [filterAccount, setFilterAccount] = useState(accountParam);
    const [filterParty, setFilterParty] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterDateFrom, setFilterDateFrom] = useState("");
    const [filterDateTo, setFilterDateTo] = useState("");

    useEffect(() => {
        if (accountParam) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFilterAccount(accountParam);
            setShowFilters(true);
        }
    }, [accountParam]);

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split("T")[0],
        time: getCurrentTimeStr(),
        type: "expense" as TransactionType,
        amount: "",
        fee: "",
        account: "",
        toAccount: "",
        party_id: "" as string | null,
        category: "General",
        notes: "",
    });

    const closeModal = () => {
        setOpen(false);
        setEditingId(null);
        setEditingTransferId(null);
        setFormData({
            date: new Date().toISOString().split("T")[0],
            time: getCurrentTimeStr(),
            type: "expense",
            amount: "",
            fee: "",
            account: accounts.length > 0 ? accounts[0].id : "",
            toAccount: "",
            party_id: null,
            category: "General",
            notes: "",
        });
    };

    const handleOpenAdd = () => {
        setEditingId(null);
        setEditingTransferId(null);
        setFormData({
            date: new Date().toISOString().split("T")[0],
            time: getCurrentTimeStr(),
            type: "expense",
            amount: "",
            fee: "",
            account: accounts.length > 0 ? accounts[0].id : "",
            toAccount: "",
            party_id: null,
            category: "General",
            notes: "",
        });
        setOpen(true);
    };

    const handleOpenEdit = (tx: Transaction) => {
        setEditingId(tx.id);
        setEditingTransferId(tx.transferId || null);
        let dateVal = new Date().toISOString().split("T")[0];
        let timeVal = getCurrentTimeStr();

        if (tx.date) {
            try {
                const d = new Date(tx.date);
                if (!isNaN(d.getTime())) {
                    dateVal = d.toISOString().split("T")[0];
                    timeVal = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
                }
            } catch {
                dateVal = tx.date.split("T")[0];
            }
        }

        const type = (tx.type as TransactionType) || (tx.dc === "cr" ? "income" : "expense");
        const transferPair = tx.transferId
            ? transactions.filter(item => item.transferId === tx.transferId)
            : [];
        const transferFrom = transferPair.find(item => item.type === "transfer" && item.dc === "dr")
            || transferPair.find(item => item.dc === "dr" && item.category !== "Fees")
            || transferPair.find(item => item.dc === "dr");
        const transferTo = transferPair.find(item => item.type === "transfer" && item.dc === "cr")
            || transferPair.find(item => item.dc === "cr");
        const feeItem = transferPair.find(item => item.id !== transferFrom?.id && item.id !== transferTo?.id && item.dc === "dr");

        const amountVal = tx.transferId
            ? String(transferFrom?.amount || transferTo?.amount || tx.amount)
            : String(tx.amount);
        const notesVal = tx.transferId
            ? (transferFrom?.notes || transferTo?.notes || tx.notes)
            : tx.notes;

        setFormData({
            date: dateVal,
            time: timeVal,
            type: tx.transferId ? "transfer" : type,
            amount: amountVal,
            fee: feeItem ? String(feeItem.amount) : "",
            account: transferFrom?.accountId || tx.accountId,
            toAccount: transferTo?.accountId || "",
            party_id: tx.party_id || null,
            category: tx.category || "General",
            notes: notesVal || "",
        });
        setOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const amt = parseFloat(formData.amount);
        if (isNaN(amt) || amt <= 0) {
            Toast.fire({ icon: "error", title: "Please enter a valid positive amount" });
            return;
        }
        if (!formData.account) {
            Toast.fire({ icon: "error", title: "Please select an existing account" });
            return;
        }

        const selectedAccount = accounts.find(a => a.id === formData.account);
        const currency = selectedAccount?.currency || "TZS";

        let fullIsoDate = new Date().toISOString();
        if (formData.date) {
            const timeVal = formData.time || "00:00";
            const combined = new Date(`${formData.date}T${timeVal}:00`);
            if (!isNaN(combined.getTime())) {
                fullIsoDate = combined.toISOString();
            } else {
                fullIsoDate = new Date(formData.date).toISOString();
            }
        }

        if (formData.type === "transfer") {
            const destinationAccount = accounts.find(a => a.id === formData.toAccount);
            if (!destinationAccount) {
                Toast.fire({ icon: "error", title: "Please select a destination account" });
                return;
            }
            if (formData.account === formData.toAccount) {
                Toast.fire({ icon: "error", title: "From and To accounts must be different" });
                return;
            }
            if (currency !== destinationAccount.currency) {
                Toast.fire({ icon: "error", title: "Transfers between different currencies are not supported yet" });
                return;
            }

            const feeAmt = formData.fee.trim() !== "" ? parseFloat(formData.fee) : 0;
            if (isNaN(feeAmt) || feeAmt < 0) {
                Toast.fire({ icon: "error", title: "Please enter a valid positive fee (or 0)" });
                return;
            }

            const transferPair = editingTransferId
                ? transactions.filter(tx => tx.transferId === editingTransferId)
                : [];
            const originalDebit = transferPair.find(tx => tx.type === "transfer" && tx.dc === "dr")
                || transferPair.find(tx => tx.dc === "dr" && tx.category !== "Fees");
            const originalFee = transferPair.find(tx => tx.id !== originalDebit?.id && tx.dc === "dr");

            const available = (selectedAccount?.currentBalance || 0)
                + (originalDebit?.accountId === formData.account ? originalDebit.amount : 0)
                + (originalFee?.accountId === formData.account ? originalFee.amount : 0);

            if ((amt + feeAmt) > available) {
                Toast.fire({ icon: "error", title: "Transfer amount plus fee exceeds the available balance" });
                return;
            }

            const transferPayload = {
                date: fullIsoDate,
                amount: amt,
                fee: feeAmt > 0 ? feeAmt : undefined,
                fromAccount: formData.account,
                toAccount: formData.toAccount,
                currency,
                category: formData.category || "Transfer",
                notes: formData.notes,
                status: "completed" as const,
            };

            if (editingTransferId) {
                await updateTransfer(editingTransferId, transferPayload);
            } else {
                await createTransfer(transferPayload);
            }
            loadAccounts();
            closeModal();
            return;
        }

        const dc = transactionTypeConfig[formData.type].dc;

        const payload = {
            date: fullIsoDate,
            amount: amt,
            type: formData.type,
            dc,
            accountId: formData.account,
            party_id: formData.party_id || null,
            currency,
            category: formData.category || "General",
            notes: formData.notes,
            status: "completed" as const,
        };

        if (editingId) {
            await updateTransaction(editingId, payload);
        } else {
            await createTransaction(payload);
        }

        // Refresh accounts so calculated balance updates immediately
        loadAccounts();
        closeModal();
    };

    const handleOpenView = (tx: Transaction) => {
        setViewingTransaction(tx);
        setDeleteConfirmation("");
    };

    const closeViewModal = () => {
        setViewingTransaction(null);
        setDeleteConfirmation("");
    };

    const handleRemove = async () => {
        if (!viewingTransaction || deleteConfirmation !== "DELETE") return;
        const tx = viewingTransaction;
        const isLinkedTransfer = Boolean(tx.transferId);
        if (isLinkedTransfer) await removeTransfer(tx.transferId!);
        else await removeTransaction(tx.id);
        closeViewModal();
        loadAccounts();
    };

    // Active filters count
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filterType) count++;
        if (filterAccount) count++;
        if (filterParty) count++;
        if (filterCategory) count++;
        if (filterStatus) count++;
        if (filterDateFrom || filterDateTo) count++;
        return count;
    }, [filterType, filterAccount, filterParty, filterCategory, filterStatus, filterDateFrom, filterDateTo]);

    const clearAllFilters = () => {
        setSearchQuery("");
        setFilterType("");
        setFilterAccount("");
        setFilterParty("");
        setFilterCategory("");
        setFilterStatus("");
        setFilterDateFrom("");
        setFilterDateTo("");
        if (accountParam) {
            setSearchParams({});
        }
    };

    // Filter transactions
    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx => {
            if (filterStatus && tx.status !== filterStatus) return false;
            if (filterType) {
                const txType = tx.type || (tx.dc === "cr" ? "income" : "expense");
                if (txType !== filterType) return false;
            }
            if (filterAccount && tx.accountId !== filterAccount) return false;
            if (filterParty && tx.party_id !== filterParty) return false;
            if (filterCategory && tx.category !== filterCategory) return false;
            if (filterDateFrom) {
                const txDate = tx.date.split("T")[0];
                if (txDate < filterDateFrom) return false;
            }
            if (filterDateTo) {
                const txDate = tx.date.split("T")[0];
                if (txDate > filterDateTo) return false;
            }
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const party = parties.find(p => p.id === tx.party_id);
                const matchCategory = tx.category?.toLowerCase().includes(q);
                const matchNotes = tx.notes?.toLowerCase().includes(q);
                const account = accounts.find(item => item.id === tx.accountId);
                const matchAccount = account?.name.toLowerCase().includes(q);
                const matchParty = party?.name.toLowerCase().includes(q);
                const matchAmount = String(tx.amount).includes(q);
                if (!matchCategory && !matchNotes && !matchAccount && !matchParty && !matchAmount) {
                    return false;
                }
            }
            return true;
        });
    }, [transactions, filterStatus, filterType, filterAccount, filterParty, filterCategory, filterDateFrom, filterDateTo, searchQuery, parties, accounts]);

    const filteredSummary = useMemo(() => {
        const byCurrency: Record<string, { cashIn: number; cashOut: number; net: number }> = {};

        filteredTransactions.forEach(tx => {
            if (tx.status === "failed") return;

            const currency = tx.currency || "TZS";
            const amount = Number(tx.amount) || 0;
            const isCashIn = tx.type === "income" || tx.type === "borrow" || tx.type === "collection" || tx.dc === "cr";
            const totals = byCurrency[currency] || { cashIn: 0, cashOut: 0, net: 0 };

            if (isCashIn) {
                totals.cashIn += amount;
                totals.net += amount;
            } else {
                totals.cashOut += amount;
                totals.net -= amount;
            }
            byCurrency[currency] = totals;
        });

        return {
            count: filteredTransactions.length,
            byCurrency,
        };
    }, [filteredTransactions]);

    const renderSummaryAmounts = (key: "cashIn" | "cashOut" | "net") => {
        const entries = Object.entries(filteredSummary.byCurrency);
        if (entries.length === 0) return <span>0 TZS</span>;

        return entries.map(([currency, totals]) => (
            <span key={currency} className="block">
                {currency === "USD" ? "$ " : ""}
                {totals[key].toLocaleString(undefined, { maximumFractionDigits: 2 })}
                {currency !== "USD" ? ` ${currency}` : ""}
            </span>
        ));
    };

    /* =======================
       Columns
    ======================= */

    const columns: Column<Transaction>[] = [
        {
            key: "date",
            header: "Date & Time",
            sortable: true,
            priority: 9,
            render: row => {
                let dateStr = row.date;
                let timeStr = "";
                try {
                    const dateObj = new Date(row.date);
                    if (!isNaN(dateObj.getTime())) {
                        dateStr = dateObj.toLocaleDateString("en-GB", {
                            weekday: "short",
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        });
                        timeStr = dateObj.toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                        });
                    }
                } catch {
                    dateStr = String(row.date);
                }

                return (
                    <div className="flex flex-col">
                        <span className="font-medium">{dateStr}</span>
                        {timeStr && (
                            <span className="text-xs text-main-500 flex items-center gap-1">
                                <i className="bi bi-clock text-[10px]" />
                                {timeStr}
                            </span>
                        )}
                    </div>
                );
            },
        },

        {
            key: "type",
            header: "Type",
            sortable: true,
            priority: 9,
            render: row => {
                const typeKey = (row.type as string) || (row.dc === "cr" ? "income" : "expense");
                const cfg = typeConfigMap[typeKey] || transactionTypeConfig[typeKey as TransactionType] || transactionTypeConfig.expense;
                return (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.badge}`}>
                        <i className={`bi ${cfg.icon}`} />
                        {cfg.label}
                    </span>
                );
            },
        },

        {
            key: "amount",
            header: "Amount",
            sortable: true,
            priority: 10,
            render: row => {
                const isUSD = row.currency === "USD";
                const isCashIn = row.type === "income" || row.type === "borrow" || row.type === "collection" || row.dc === "cr";
                const formattedAmount = isUSD
                    ? `$ ${row.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : `${row.amount.toLocaleString()} TZS`;
                return (
                    <span
                        className={`font-semibold ${isCashIn ? "text-success-600" : "text-danger-600"}`}
                    >
                        {isCashIn ? "+" : "-"} {formattedAmount}
                    </span>
                );
            },
        },

        {
            key: "party_id",
            header: "Party / Counterparty",
            sortable: true,
            priority: 8,
            render: row => {
                const party = parties.find(p => p.id === row.party_id);
                if (!party) return <span className="text-main-400 text-xs">—</span>;
                const colors = partyTypeColors[party.type] || partyTypeColors.other;
                const icon = partyTypeIcons[party.type] || "bi-person";
                return (
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${colors.badge}`}>
                        <i className={`bi ${icon}`} />
                        {party.name}
                    </span>
                );
            },
        },

        {
            key: "accountId",
            header: "Account",
            sortable: true,
            priority: 8,
            render: row => (
                <span className="inline-flex items-center gap-1 font-medium text-main-800">
                    <i className="bi bi-wallet2 text-xs text-primary" />
                    {accounts.find(account => account.id === row.accountId)?.name || "Unknown account"}
                </span>
            ),
        },

        {
            key: "category",
            header: "Category",
            sortable: true,
            priority: 7,
            render: row => {
                const matchedCategory = categories.find(c => c.name.toLowerCase() === (row.category || "").toLowerCase());
                const style = categoryColorStyles[matchedCategory?.color || "neutral"] || categoryColorStyles.neutral;
                return (
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium ${style.badge}`}>
                        <i className={`bi ${matchedCategory?.icon || "bi-tag"} text-xs`} />
                        {row.category || "General"}
                    </span>
                );
            },
        },

        { key: "notes", header: "Notes", priority: 5 },

        {
            key: "status",
            header: "Status",
            sortable: true,
            priority: 6,
            render: row => (
                <span
                    className={`px-2 py-0.5 rounded text-xs font-semibold capitalize ${row.status === "completed"
                        ? "bg-success-100 text-success-700"
                        : row.status === "pending"
                            ? "bg-warning-100 text-warning-700"
                            : "bg-danger-100 text-danger-700"
                        }`}
                >
                    {row.status}
                </span>
            ),
        },

        {
            key: "id",
            header: "Actions",
            render: row => (
                <div className="flex items-center gap-1.5">
                    <Button
                        size="xs"
                        color="primary"
                        variant="outline"
                        onClick={() => handleOpenEdit(row)}
                        title="Edit transaction"
                    >
                        <i className="bi bi-pencil mr-1" /> Edit
                    </Button>
                    <Button
                        size="xs"
                        color="neutral"
                        variant="outline"
                        onClick={() => handleOpenView(row)}
                        title="View transaction details"
                    >
                        <i className="bi bi-eye mr-1" /> View
                    </Button>
                </div>
            ),
        },
    ];

    // Unique account list for filters
    const availableAccounts = useMemo(() => {
        const set = new Set<string>();
        accounts.forEach(a => set.add(a.id));
        return Array.from(set);
    }, [accounts]);

    return (
        <div className="space-y-4 text-main-700">
            {/* Minimal Filter Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-65">
                    {/* Live Search Input */}
                    <div className="relative flex-1 max-w-xs min-w-50">
                        <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-main-400 text-xs pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search transactions..."
                            className="w-full pl-8 pr-7 py-1.5 text-sm bg-main-100 border border-main-300 rounded-lg text-main placeholder:text-main-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-main-400 hover:text-main-700 cursor-pointer"
                                aria-label="Clear search"
                            >
                                <i className="bi bi-x text-sm" />
                            </button>
                        )}
                    </div>

                    {/* Filter Toggle Button */}
                    <button
                        onClick={() => setShowFilters(v => !v)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all cursor-pointer ${
                            showFilters || activeFilterCount > 0
                                ? "bg-primary/10 border-primary text-primary"
                                : "border-main-300 bg-main-100 text-main-600 hover:bg-main-200"
                        }`}
                    >
                        <i className="bi bi-sliders text-xs" />
                        <span>Filters</span>
                        {activeFilterCount > 0 && (
                            <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-primary text-main-0 rounded-full">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>

                    {/* Clear All Shortcut */}
                    {(activeFilterCount > 0 || searchQuery) && (
                        <button
                            onClick={clearAllFilters}
                            className="text-xs text-main-500 hover:text-danger flex items-center gap-1 transition-colors px-1 cursor-pointer"
                        >
                            <i className="bi bi-x-circle" />
                            <span className="hidden sm:inline">Clear all</span>
                        </button>
                    )}
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2">
                    <Button
                        color="error"
                        size="sm"
                        variant="outline"
                        onClick={() =>
                            Toast.fire({ icon: "success", title: "Exported to PDF" })
                        }
                    >
                        <i className="bi bi-file-pdf" /> Export
                    </Button>

                    <Button
                        color="primary"
                        size="sm"
                        onClick={handleOpenAdd}
                    >
                        <i className="bi bi-plus-lg" /> Add Entry
                    </Button>
                </div>
            </div>

            {/* Expandable Advanced Filter Drawer (Cleanly Hidden by Default) */}
            {showFilters && (
                <div className="p-4 bg-main-200/50 rounded-xl border border-main-300 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 gap-3 text-xs animate-fade-in shadow-inner overflow-hidden">
                    <div className="min-w-0 xl:col-span-2">
                        <label className="block text-[11px] font-semibold text-main-600 mb-1">Type</label>
                        <select
                            value={filterType}
                            onChange={e => setFilterType(e.target.value)}
                            className="w-full border border-main-300 rounded-md px-2.5 py-1.5 bg-main-100 text-main text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                        >
                            <option value="">All Types</option>
                            {dynamicTypes.map(t => (
                                <option key={t.code} value={t.code}>{t.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="min-w-0 xl:col-span-2">
                        <label className="block text-[11px] font-semibold text-main-600 mb-1">Account</label>
                        <select
                            value={filterAccount}
                            onChange={e => setFilterAccount(e.target.value)}
                            className="w-full border border-main-300 rounded-md px-2.5 py-1.5 bg-main-100 text-main text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                        >
                            <option value="">All Accounts</option>
                            {availableAccounts.map(accountId => (
                                <option key={accountId} value={accountId}>
                                    {accounts.find(account => account.id === accountId)?.name || "Unknown account"}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="min-w-0 xl:col-span-2">
                        <label className="block text-[11px] font-semibold text-main-600 mb-1">Category</label>
                        <select
                            value={filterCategory}
                            onChange={e => setFilterCategory(e.target.value)}
                            className="w-full border border-main-300 rounded-md px-2.5 py-1.5 bg-main-100 text-main text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                        >
                            <option value="">All Categories</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.name}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="min-w-0 xl:col-span-2">
                        <label className="block text-[11px] font-semibold text-main-600 mb-1">Party / Counterparty</label>
                        <select
                            value={filterParty}
                            onChange={e => setFilterParty(e.target.value)}
                            className="w-full border border-main-300 rounded-md px-2.5 py-1.5 bg-main-100 text-main text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                        >
                            <option value="">All Parties</option>
                            {parties.map(p => (
                                <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
                            ))}
                        </select>
                    </div>

                    <div className="min-w-0 xl:col-span-2">
                        <label className="block text-[11px] font-semibold text-main-600 mb-1">Status</label>
                        <select
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                            className="w-full border border-main-300 rounded-md px-2.5 py-1.5 bg-main-100 text-main text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                        >
                            <option value="">All Statuses</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>

                    <div className="min-w-0 sm:col-span-2 xl:col-span-2">
                        <label className="block text-[11px] font-semibold text-main-600 mb-1">Date Range</label>
                        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1 min-w-0">
                            <input
                                type="date"
                                value={filterDateFrom}
                                onChange={e => setFilterDateFrom(e.target.value)}
                                className="w-full min-w-0 max-w-full border border-main-300 rounded-md px-1.5 py-1.5 bg-main-100 text-main text-xs focus:outline-none cursor-pointer"
                            />
                            <span className="text-main-400">—</span>
                            <input
                                type="date"
                                value={filterDateTo}
                                onChange={e => setFilterDateTo(e.target.value)}
                                className="w-full min-w-0 max-w-full border border-main-300 rounded-md px-1.5 py-1.5 bg-main-100 text-main text-xs focus:outline-none cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Active Filter Chips Bar (Quick Dismissal) */}
            {activeFilterCount > 0 && !showFilters && (
                <div className="flex flex-wrap items-center gap-1.5 text-xs pt-1">
                    <span className="text-[11px] text-main-400 font-medium mr-1">Active:</span>

                    {filterType && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-main-300 text-main-700 text-xs">
                            Type: {typeConfigMap[filterType]?.label || filterType}
                            <button onClick={() => setFilterType("")} className="hover:text-danger ml-0.5">
                                <i className="bi bi-x" />
                            </button>
                        </span>
                    )}

                    {filterAccount && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-main-300 text-main-700 text-xs">
                            Account: {accounts.find(a => a.id === filterAccount)?.name || filterAccount}
                            <button
                                onClick={() => {
                                    setFilterAccount("");
                                    if (accountParam) setSearchParams({});
                                }}
                                className="hover:text-danger ml-0.5 cursor-pointer"
                            >
                                <i className="bi bi-x" />
                            </button>
                        </span>
                    )}

                    {filterCategory && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-main-300 text-main-700 text-xs">
                            Category: {filterCategory}
                            <button onClick={() => setFilterCategory("")} className="hover:text-danger ml-0.5">
                                <i className="bi bi-x" />
                            </button>
                        </span>
                    )}

                    {filterParty && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-main-300 text-main-700 text-xs">
                            Party: {parties.find(p => p.id === filterParty)?.name}
                            <button onClick={() => setFilterParty("")} className="hover:text-danger ml-0.5">
                                <i className="bi bi-x" />
                            </button>
                        </span>
                    )}

                    {filterStatus && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-main-300 text-main-700 text-xs capitalize">
                            Status: {filterStatus}
                            <button onClick={() => setFilterStatus("")} className="hover:text-danger ml-0.5">
                                <i className="bi bi-x" />
                            </button>
                        </span>
                    )}

                    {(filterDateFrom || filterDateTo) && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-main-300 text-main-700 text-xs">
                            Date: {filterDateFrom || "Start"} to {filterDateTo || "End"}
                            <button
                                onClick={() => {
                                    setFilterDateFrom("");
                                    setFilterDateTo("");
                                }}
                                className="hover:text-danger ml-0.5"
                            >
                                <i className="bi bi-x" />
                            </button>
                        </span>
                    )}
                </div>
            )}

            {/* Summary of the current search and filters */}
            <section className="rounded-xl border border-main-300 bg-main-200/50 p-3" aria-label="Filtered transaction summary">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h4 className="text-xs font-semibold text-main-700">Filtered Summary</h4>
                    <span className="text-[11px] text-main-500">
                        Showing {filteredSummary.count.toLocaleString()} of {transactions.length.toLocaleString()} transactions
                    </span>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                    <div className="rounded-lg border border-main-300 bg-main-100 px-3 py-2 min-w-0">
                        <p className="text-[11px] text-main-500">Transactions</p>
                        <p className="text-base font-bold text-main-800">{filteredSummary.count.toLocaleString()}</p>
                    </div>
                    <div className="rounded-lg border border-success-300 bg-success-50 px-3 py-2 min-w-0">
                        <p className="text-[11px] text-success-700">Cash In</p>
                        <div className="text-sm font-bold text-success-700 wrap-break-word">{renderSummaryAmounts("cashIn")}</div>
                    </div>
                    <div className="rounded-lg border border-danger-300 bg-danger-50 px-3 py-2 min-w-0">
                        <p className="text-[11px] text-danger-700">Cash Out</p>
                        <div className="text-sm font-bold text-danger-700 wrap-break-word">{renderSummaryAmounts("cashOut")}</div>
                    </div>
                    <div className="rounded-lg border border-primary-300 bg-primary-100 px-3 py-2 min-w-0">
                        <p className="text-[11px] text-primary-700">Net</p>
                        <div className="text-sm font-bold text-primary-700 wrap-break-word">{renderSummaryAmounts("net")}</div>
                    </div>
                </div>
            </section>

            {/* Transaction Details Modal */}
            <Modal open={Boolean(viewingTransaction)} onClose={closeViewModal} size="xl" position="center" blur closeOnBackdrop closeOnEsc>
                <ModalHeader
                    title="Transaction Details"
                    icon="bi-receipt"
                    onClose={closeViewModal}
                />

                {viewingTransaction && (() => {
                    const typeKey = viewingTransaction.type || (viewingTransaction.dc === "cr" ? "income" : "expense");
                    const config = transactionTypeConfig[typeKey];
                    const transferRows = viewingTransaction.transferId
                        ? transactions.filter(tx => tx.transferId === viewingTransaction.transferId)
                        : [];
                    const transferFrom = transferRows.find(tx => tx.type === "transfer" && tx.dc === "dr")
                        || transferRows.find(tx => tx.dc === "dr" && tx.category !== "Fees")
                        || transferRows.find(tx => tx.dc === "dr");
                    const transferTo = transferRows.find(tx => tx.type === "transfer" && tx.dc === "cr")
                        || transferRows.find(tx => tx.dc === "cr");
                    const feeRow = transferRows.find(tx => tx.id !== transferFrom?.id && tx.id !== transferTo?.id && tx.dc === "dr");

                    const fromAccountId = transferFrom?.accountId;
                    const toAccountId = transferTo?.accountId;
                    const fromAccount = accounts.find(account => account.id === fromAccountId)?.name;
                    const toAccount = accounts.find(account => account.id === toAccountId)?.name;
                    const party = parties.find(item => item.id === viewingTransaction.party_id);
                    const date = new Date(viewingTransaction.date);

                    const isUSD = viewingTransaction.currency === "USD";
                    const formatAmt = (val: number) => isUSD
                        ? `$ ${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : `${val.toLocaleString()} TZS`;

                    const transferAmt = transferFrom?.amount || transferTo?.amount || viewingTransaction.amount;
                    const feeAmt = feeRow ? feeRow.amount : 0;
                    const totalOutflow = transferAmt + feeAmt;
                    const displayAmount = viewingTransaction.transferId
                        ? formatAmt(transferAmt)
                        : formatAmt(viewingTransaction.amount);

                    return (
                        <>
                            <ModalBody>
                                <div className="flex items-center gap-3 rounded-lg border border-main-300 bg-main-200/60 p-4">
                                    <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${config.badge}`}>
                                        <i className={`bi ${config.icon} text-lg`} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-semibold text-lg">{config.label}</h4>
                                        <p className="text-sm text-main-500">{displayAmount}</p>
                                    </div>
                                    <span className="px-2 py-0.5 rounded text-xs font-semibold capitalize bg-success-100 text-success-700">
                                        {viewingTransaction.status}
                                    </span>
                                </div>

                                <dl className="divide-y divide-main-300 rounded-lg border border-main-300">
                                    <div className="flex items-start justify-between gap-4 px-4 py-3">
                                        <dt className="text-sm text-main-500">Date & Time</dt>
                                        <dd className="text-sm font-medium text-main-800 text-right">
                                            {isNaN(date.getTime()) ? viewingTransaction.date : date.toLocaleString()}
                                        </dd>
                                    </div>
                                    {viewingTransaction.transferId ? (
                                        <>
                                            <div className="flex items-start justify-between gap-4 px-4 py-3">
                                                <dt className="text-sm text-main-500">From Account</dt>
                                                <dd className="text-sm font-medium text-main-800">{fromAccount || "Unknown"}</dd>
                                            </div>
                                            <div className="flex items-start justify-between gap-4 px-4 py-3">
                                                <dt className="text-sm text-main-500">To Account</dt>
                                                <dd className="text-sm font-medium text-main-800">{toAccount || "Unknown"}</dd>
                                            </div>
                                            <div className="flex items-start justify-between gap-4 px-4 py-3">
                                                <dt className="text-sm text-main-500">Transfer Amount</dt>
                                                <dd className="text-sm font-semibold text-main-800">{formatAmt(transferAmt)}</dd>
                                            </div>
                                            {feeAmt > 0 && (
                                                <>
                                                    <div className="flex items-start justify-between gap-4 px-4 py-3">
                                                        <dt className="text-sm text-main-500">Transfer Fee</dt>
                                                        <dd className="text-sm font-semibold text-danger-600">{formatAmt(feeAmt)}</dd>
                                                    </div>
                                                    <div className="flex items-start justify-between gap-4 px-4 py-3 bg-main-200/30">
                                                        <dt className="text-sm font-medium text-main-700">Total Deducted from Source</dt>
                                                        <dd className="text-sm font-bold text-main-900">{formatAmt(totalOutflow)}</dd>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex items-start justify-between gap-4 px-4 py-3">
                                            <dt className="text-sm text-main-500">Account</dt>
                                            <dd className="text-sm font-medium text-main-800">
                                                {accounts.find(account => account.id === viewingTransaction.accountId)?.name || "Unknown account"}
                                            </dd>
                                        </div>
                                    )}
                                    <div className="flex items-start justify-between gap-4 px-4 py-3">
                                        <dt className="text-sm text-main-500">Party / Counterparty</dt>
                                        <dd className="text-sm font-medium text-main-800">{party?.name || "None"}</dd>
                                    </div>
                                    <div className="flex items-start justify-between gap-4 px-4 py-3">
                                        <dt className="text-sm text-main-500">Category</dt>
                                        <dd className="text-sm font-medium text-main-800">{viewingTransaction.category || "—"}</dd>
                                    </div>
                                    <div className="flex items-start justify-between gap-4 px-4 py-3">
                                        <dt className="text-sm text-main-500">Notes</dt>
                                        <dd className="text-sm font-medium text-main-800 text-right wrap-break-word max-w-2/3">{viewingTransaction.notes || "—"}</dd>
                                    </div>
                                </dl>

                                <div className="rounded-lg border border-danger-300 bg-danger-50 p-4">
                                    <div className="flex items-start gap-2 mb-3">
                                        <i className="bi bi-exclamation-triangle text-danger-600 mt-0.5" />
                                        <div>
                                            <h5 className="font-semibold text-danger-800">
                                                {viewingTransaction.transferId ? "Delete transfer" : "Delete transaction"}
                                            </h5>
                                            <p className="text-xs text-danger-700">
                                                {viewingTransaction.transferId
                                                    ? "All linked transfer entries and associated fees will be permanently deleted. "
                                                    : "This transaction will be permanently deleted. "}
                                                Type <strong>DELETE</strong> to continue.
                                            </p>
                                        </div>
                                    </div>
                                    <input
                                        className="w-full px-3 py-2 border border-danger-300 rounded-md bg-main-0 text-main-800 focus:outline-none focus:ring-2 focus:ring-danger-500"
                                        value={deleteConfirmation}
                                        onChange={e => setDeleteConfirmation(e.target.value)}
                                        placeholder="DELETE"
                                        autoComplete="off"
                                    />
                                    <Button
                                        color="error"
                                        size="sm"
                                        className="mt-3 w-full"
                                        onClick={handleRemove}
                                        disabled={loading || deleteConfirmation !== "DELETE"}
                                    >
                                        {loading ? <i className="bi bi-arrow-clockwise animate-spin" /> : <i className="bi bi-trash" />}
                                        {viewingTransaction.transferId ? "Delete Transfer" : "Delete Transaction"}
                                    </Button>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="neutral" size="sm" variant="outline" onClick={closeViewModal} disabled={loading}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    );
                })()}
            </Modal>

            {/* Add / Edit Ledger Entry Modal */}
            <Modal open={open} onClose={closeModal} size="xl" position="center" blur>
                <ModalHeader
                    title={editingId ? "Edit Transaction" : "Add Ledger Entry"}
                    icon={editingId ? "bi-pencil-square" : "bi-journal-plus"}
                    onClose={closeModal}
                />

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                    <ModalBody>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <DatePicker
                                label="Date"
                                labelBgColor="bg-main-100"
                                value={formData.date}
                                onChange={date => setFormData(p => ({ ...p, date }))}
                                required
                                color="primary"
                                size="md"
                                showTodayButton
                            />

                            <TimePicker
                                label="Time"
                                labelBgColor="bg-main-100"
                                value={formData.time}
                                onChange={time => setFormData(p => ({ ...p, time }))}
                                required
                                color="primary"
                                size="md"
                                showNowButton
                            />
                        </div>

                        {/* Explicit Transaction Type Selection */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-semibold text-main-700 uppercase tracking-wider">
                                    Transaction Type <span className="text-danger-500">*</span>
                                </label>
                                <Link
                                    to="/finance/categories"
                                    className="text-[11px] text-primary hover:underline flex items-center gap-1"
                                >
                                    <i className="bi bi-gear" /> Manage Types
                                </Link>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                                {dynamicTypes.map(t => {
                                    const cfg = typeConfigMap[t.code] || {
                                        label: t.label,
                                        dc: t.dc,
                                        icon: t.icon,
                                        badge: t.badge,
                                        color: t.color,
                                        description: t.description,
                                    };
                                    const isSelected = formData.type === t.code;
                                    const changesTransferKind = Boolean(editingId) && (
                                        editingTransferId
                                            ? t.code !== "transfer"
                                            : formData.type !== "transfer" && t.code === "transfer"
                                    );
                                    return (
                                        <button
                                            key={t.code}
                                            type="button"
                                            onClick={() => setFormData(p => ({ ...p, type: t.code as TransactionType }))}
                                            disabled={changesTransferKind}
                                            className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                                                isSelected
                                                    ? `${cfg.badge} ring-2 ring-primary/40 shadow-sm font-semibold`
                                                    : "border-main-300 bg-main-100 text-main-600 hover:bg-main-200 disabled:opacity-40 disabled:cursor-not-allowed"
                                            }`}
                                        >
                                            <i className={`bi ${cfg.icon} text-base mb-1 ${isSelected ? cfg.color : "text-main-500"}`} />
                                            <span className="truncate">{cfg.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            <p className="text-[11px] text-main-500 mt-1.5">
                                {typeConfigMap[formData.type]?.description || "Select the transaction nature"}
                            </p>
                        </div>

                        <TextInput
                            label="Amount"
                            labelBgColor="bg-main-100"
                            type="number"
                            value={formData.amount}
                            onChange={e => setFormData(p => ({ ...p, amount: e.target.value }))}
                            required
                            color="primary"
                            size="md"
                        />

                        {formData.type === "transfer" && (
                            <TextInput
                                label="Transfer Fee (Optional)"
                                labelBgColor="bg-main-100"
                                type="number"
                                min="0"
                                step="any"
                                value={formData.fee}
                                onChange={e => setFormData(p => ({ ...p, fee: e.target.value }))}
                                placeholder="0.00"
                                color="primary"
                                size="md"
                                helperText={
                                    formData.fee && parseFloat(formData.fee) > 0
                                        ? `Total debited from source account: ${(
                                            (parseFloat(formData.amount) || 0) + (parseFloat(formData.fee) || 0)
                                          ).toLocaleString()} ${accounts.find(a => a.id === formData.account)?.currency || "TZS"} (${(parseFloat(formData.amount) || 0).toLocaleString()} transfer + ${(parseFloat(formData.fee) || 0).toLocaleString()} fee)`
                                        : "Fee deducted from the source account (e.g. mobile money or bank charge)"
                                }
                            />
                        )}

                        {/* Searchable Party / Counterparty Selection */}
                        {formData.type !== "transfer" && (
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-sm font-medium text-main">
                                        Party / Counterparty <span className="text-xs text-main-500 font-normal">(Optional)</span>
                                    </label>
                                    <Link
                                        to="/finance/parties"
                                        className="text-xs text-primary hover:underline flex items-center gap-1"
                                    >
                                        <i className="bi bi-box-arrow-up-right" /> Manage Parties
                                    </Link>
                                </div>
                                <SearchableSelect
                                    placeholder="Search or choose counterparty..."
                                    value={formData.party_id || null}
                                    onChange={val => setFormData(p => ({ ...p, party_id: val }))}
                                    options={partyOptions}
                                    onAddNew={() => navigate("/finance/parties")}
                                    addNewText="Manage / Add Parties"
                                    clearable={true}
                                />
                            </div>
                        )}

                        {/* Searchable Category Selection */}
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-sm font-medium text-main">
                                    Category <span className="text-danger-500">*</span>
                                </label>
                                <Link
                                    to="/finance/categories"
                                    className="text-xs text-primary hover:underline flex items-center gap-1"
                                >
                                    <i className="bi bi-box-arrow-up-right" /> Manage Categories
                                </Link>
                            </div>
                            <SearchableSelect
                                placeholder="Search category (e.g. Salary, Food, Housing, Fuel)..."
                                value={formData.category || null}
                                onChange={val => setFormData(p => ({ ...p, category: val || "General" }))}
                                options={categoryOptions}
                                allowCustom={true}
                                onAddNew={() => navigate("/finance/categories")}
                                addNewText="Manage / Add Categories"
                                clearable={false}
                                required={true}
                            />
                        </div>

                        <TextInput
                            label="Notes / Description"
                            labelBgColor="bg-main-100"
                            value={formData.notes}
                            onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                            placeholder="Add transaction details or memo"
                            color="primary"
                            size="md"
                        />

                        {/* Account Selection */}
                        <div>
                            <label className="block text-sm font-medium text-main mb-1">
                                {formData.type === "transfer" ? "From Account" : "Associated Account"} <span className="text-danger-500">*</span>
                            </label>
                            {accounts.length > 0 ? (
                                <select
                                    className="w-full border border-main-300 rounded px-3 py-2 text-sm bg-main-100 text-main focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                                    value={formData.account}
                                    onChange={e => setFormData(p => ({ ...p, account: e.target.value }))}
                                    required
                                >
                                    <option value="">-- Choose Account --</option>
                                    {accounts.map(acc => (
                                        <option key={acc.id} value={acc.id}>
                                            {acc.name} ({acc.type}) — Current Balance: {acc.balance}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <div className="p-3.5 bg-accent-500/10 border border-accent-500/30 rounded-lg text-accent-700 text-sm flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-semibold">
                                        <i className="bi bi-exclamation-triangle-fill text-accent-500" />
                                        No Accounts Found
                                    </div>
                                    <p className="text-xs text-main-500">
                                        Every transaction must be associated with an existing account. Please create an account before adding a transaction.
                                    </p>
                                    <Link
                                        to="/finance/accounts"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-main-0 text-xs font-medium rounded hover:bg-primary/90 transition-colors w-fit mt-1"
                                    >
                                        <i className="bi bi-plus-lg" /> Create Account
                                    </Link>
                                </div>
                            )}
                        </div>

                        {formData.type === "transfer" && (
                            <div>
                                <label className="block text-sm font-medium text-main mb-1">
                                    To Account <span className="text-danger-500">*</span>
                                </label>
                                <select
                                    className="w-full border border-main-300 rounded px-3 py-2 text-sm bg-main-100 text-main focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                                    value={formData.toAccount}
                                    onChange={e => setFormData(p => ({ ...p, toAccount: e.target.value }))}
                                    required
                                >
                                    <option value="">-- Choose Destination Account --</option>
                                    {accounts
                                        .filter(acc => acc.id !== formData.account)
                                        .map(acc => (
                                            <option key={acc.id} value={acc.id}>
                                                {acc.name} ({acc.type}) — Current Balance: {acc.balance}
                                            </option>
                                        ))}
                                </select>
                                <p className="text-[11px] text-main-500 mt-1">
                                    Both accounts must use the same currency. The transfer will create linked debit and credit entries.
                                </p>
                            </div>
                        )}
                    </ModalBody>

                    <ModalFooter >
                        <Button variant="outline" size="sm" onClick={closeModal} color="primary" type="button">
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            color="primary"
                            type="submit"
                            disabled={accounts.length === 0}
                        >
                            {editingId ? "Save Changes" : "Save Entry"}
                        </Button>
                    </ModalFooter>
                </form>
            </Modal>

            {/* Table or Empty State */}
            {loading && transactions.length === 0 ? (
                <div className="flex items-center justify-center py-16">
                    <Loader size={40} />
                </div>
            ) : filteredTransactions.length === 0 ? (
                <div className="text-center py-16 border border-main-300 bg-main-200/40 rounded-lg">
                    <i className="bi bi-journal-text text-4xl text-main-400 mb-3" />
                    <h4 className="text-lg font-medium text-main-700 mb-1">No transactions found</h4>
                    <p className="text-sm text-main-500 mb-4">
                        {transactions.length === 0
                            ? "You haven't recorded any ledger transactions yet."
                            : "No transactions match the selected filters."}
                    </p>
                    <Button
                        color="primary"
                        size="md"
                        onClick={handleOpenAdd}
                    >
                        <i className="bi bi-plus-lg mr-2" /> Add Your First Entry
                    </Button>
                </div>
            ) : (
                <CollapsibleTable
                    data={filteredTransactions}
                    columns={columns}
                    rowsPerPage={10}
                    showSearch={false}
                />
            )}
        </div>
    );
}

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import CollapsibleTable, { type Column } from "../../../components/ui/Table";
import { Button } from "../../../components/ui/Buttons";
import { Toast } from "../../../components/ui/Toast";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../../../components/ui/Modal";
import { TextInput } from "../../../components/ui/TextInput";
import { DatePicker } from "../../../components/ui/DatePicker";
import { useTransactions } from "../hooks/useTransactions";
import { useAccounts } from "../hooks/useAccounts";
import { useParties } from "../hooks/useParties";
import { partyTypeIcons, partyTypeColors } from "../services/partyService";
import type { Transaction } from "../services/TransactionService";
import Loader from "../../../components/ui/Loaders";

/* =======================
   Component
======================= */

export default function LedgerPage() {
    const {
        data: transactions,
        loading,
        create: createTransaction,
        update: updateTransaction,
        remove: removeTransaction,
    } = useTransactions();
    const { accounts, loadAccounts } = useAccounts();
    const { parties } = useParties();

    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [filterStatus, setFilterStatus] = useState("");
    const [filterType, setFilterType] = useState("");
    const [filterAccount, setFilterAccount] = useState("");
    const [filterParty, setFilterParty] = useState("");
    const [filterDateFrom, setFilterDateFrom] = useState("");
    const [filterDateTo, setFilterDateTo] = useState("");

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split("T")[0],
        amount: "",
        dc: "cr" as "dr" | "cr", // Default to Cash In
        account: "",
        party_id: "" as string | null,
        category: "General",
        notes: "",
    });

    const closeModal = () => {
        setOpen(false);
        setEditingId(null);
        setFormData({
            date: new Date().toISOString().split("T")[0],
            amount: "",
            dc: "cr",
            account: accounts.length > 0 ? accounts[0].name : "",
            party_id: null,
            category: "General",
            notes: "",
        });
    };

    const handleOpenAdd = () => {
        setEditingId(null);
        setFormData({
            date: new Date().toISOString().split("T")[0],
            amount: "",
            dc: "cr",
            account: accounts.length > 0 ? accounts[0].name : "",
            party_id: null,
            category: "General",
            notes: "",
        });
        setOpen(true);
    };

    const handleOpenEdit = (tx: Transaction) => {
        setEditingId(tx.id);
        setFormData({
            date: tx.date ? tx.date.split("T")[0] : new Date().toISOString().split("T")[0],
            amount: String(tx.amount),
            dc: tx.dc,
            account: tx.account,
            party_id: tx.party_id || null,
            category: tx.category || "General",
            notes: tx.notes || "",
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

        const selectedAccount = accounts.find(a => a.name === formData.account);
        const currency = selectedAccount?.currency || "TZS";

        const payload = {
            date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
            amount: amt,
            dc: formData.dc,
            account: formData.account,
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

    const handleRemove = async (id: string) => {
        if (window.confirm("Are you sure you want to remove this ledger transaction?")) {
            await removeTransaction(id);
            loadAccounts();
        }
    };

    // Filter transactions
    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx => {
            if (filterStatus && tx.status !== filterStatus) return false;
            if (filterType && tx.dc !== filterType) return false;
            if (filterAccount && tx.account !== filterAccount) return false;
            if (filterParty && tx.party_id !== filterParty) return false;
            if (filterDateFrom) {
                const txDate = tx.date.split("T")[0];
                if (txDate < filterDateFrom) return false;
            }
            if (filterDateTo) {
                const txDate = tx.date.split("T")[0];
                if (txDate > filterDateTo) return false;
            }
            return true;
        });
    }, [transactions, filterStatus, filterType, filterAccount, filterParty, filterDateFrom, filterDateTo]);

    /* =======================
       Columns
    ======================= */

    const columns: Column<Transaction>[] = [
        {
            key: "date",
            header: "Date",
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
                        {timeStr && <span className="text-xs text-main-500">{timeStr}</span>}
                    </div>
                );
            },
        },

        {
            key: "dc",
            header: "Type",
            sortable: true,
            priority: 9,
            render: row => (
                <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        row.dc === "cr"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-red-100 text-red-700 border border-red-200"
                    }`}
                >
                    <i className={`bi ${row.dc === "cr" ? "bi-arrow-down-left" : "bi-arrow-up-right"}`} />
                    {row.dc === "cr" ? "Cash In" : "Cash Out"}
                </span>
            ),
        },

        {
            key: "amount",
            header: "Amount",
            sortable: true,
            priority: 10,
            render: row => {
                const isUSD = row.currency === "USD";
                const formattedAmount = isUSD
                    ? `$ ${row.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : `${row.amount.toLocaleString()} TZS`;
                return (
                    <span
                        className={`font-semibold ${row.dc === "cr" ? "text-green-600" : "text-red-600"}`}
                    >
                        {row.dc === "cr" ? "+" : "-"} {formattedAmount}
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
            key: "account",
            header: "Account",
            sortable: true,
            priority: 8,
            render: row => (
                <span className="inline-flex items-center gap-1 font-medium text-main-800">
                    <i className="bi bi-wallet2 text-xs text-primary" />
                    {row.account}
                </span>
            ),
        },

        {
            key: "category",
            header: "Category",
            sortable: true,
            priority: 7,
            render: row => (
                <span className="text-sm font-medium text-main-700">
                    {row.category || "—"}
                </span>
            ),
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
                        ? "bg-green-100 text-green-700"
                        : row.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
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
                        color="error"
                        variant="outline"
                        onClick={() => handleRemove(row.id)}
                        title="Remove transaction"
                    >
                        <i className="bi bi-trash mr-1" /> Remove
                    </Button>
                </div>
            ),
        },
    ];

    // Unique account list for filters
    const availableAccounts = useMemo(() => {
        const set = new Set<string>();
        accounts.forEach(a => set.add(a.name));
        transactions.forEach(t => {
            if (t.account) set.add(t.account);
        });
        return Array.from(set);
    }, [accounts, transactions]);

    return (
        <div className="space-y-4 text-main-700">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                        className="border border-main-300 rounded px-2 py-1.5 text-sm bg-main-100"
                    >
                        <option value="">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                    </select>

                    <select
                        value={filterType}
                        onChange={e => setFilterType(e.target.value)}
                        className="border border-main-300 rounded px-2 py-1.5 text-sm bg-main-100"
                    >
                        <option value="">All Types</option>
                        <option value="cr">Cash In (+)</option>
                        <option value="dr">Cash Out (-)</option>
                    </select>

                    <select
                        value={filterAccount}
                        onChange={e => setFilterAccount(e.target.value)}
                        className="border border-main-300 rounded px-2 py-1.5 text-sm bg-main-100"
                    >
                        <option value="">All Accounts</option>
                        {availableAccounts.map(acc => (
                            <option key={acc} value={acc}>{acc}</option>
                        ))}
                    </select>

                    <select
                        value={filterParty}
                        onChange={e => setFilterParty(e.target.value)}
                        className="border border-main-300 rounded px-2 py-1.5 text-sm bg-main-100"
                    >
                        <option value="">All Parties</option>
                        {parties.map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
                        ))}
                    </select>

                    <div className="flex items-center gap-1.5 border border-main-300 rounded px-2 py-1 bg-main-100">
                        <i className="bi bi-calendar-range text-main-500 text-xs" />
                        <input
                            type="date"
                            value={filterDateFrom}
                            onChange={e => setFilterDateFrom(e.target.value)}
                            aria-label="From date"
                            className="bg-transparent text-xs text-main focus:outline-none cursor-pointer"
                        />
                        <span className="text-xs text-main-400">—</span>
                        <input
                            type="date"
                            value={filterDateTo}
                            onChange={e => setFilterDateTo(e.target.value)}
                            aria-label="To date"
                            className="bg-transparent text-xs text-main focus:outline-none cursor-pointer"
                        />
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        color="error"
                        size="sm"
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

            {/* Add / Edit Ledger Entry Modal */}
            <Modal open={open} onClose={closeModal} size="md" position="center" blur>
                <ModalHeader
                    title={editingId ? "Edit Transaction" : "Add Ledger Entry"}
                    icon={editingId ? "bi-pencil-square" : "bi-journal-plus"}
                    onClose={closeModal}
                />

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                    <ModalBody>
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

                        {/* Cash In vs Cash Out Selection */}
                        <div className="flex gap-3">
                            <label
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer border text-sm font-medium transition-colors
                                ${formData.dc === "cr"
                                    ? "bg-green-100 dark:bg-green-950/40 border-green-500 text-green-700 dark:text-green-300 ring-2 ring-green-500/20"
                                    : "border-main-300 text-main-600 hover:bg-main-200"}
                                `}
                            >
                                <input
                                    type="radio"
                                    name="dc"
                                    value="cr"
                                    className="hidden"
                                    checked={formData.dc === "cr"}
                                    onChange={() => setFormData(p => ({ ...p, dc: "cr" }))}
                                />
                                <i className="bi bi-arrow-down-left-circle-fill text-green-600" />
                                Cash In
                            </label>

                            <label
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer border text-sm font-medium transition-colors
                                ${formData.dc === "dr"
                                    ? "bg-red-100 dark:bg-red-950/40 border-red-500 text-red-700 dark:text-red-300 ring-2 ring-red-500/20"
                                    : "border-main-300 text-main-600 hover:bg-main-200"}
                                `}
                            >
                                <input
                                    type="radio"
                                    name="dc"
                                    value="dr"
                                    className="hidden"
                                    checked={formData.dc === "dr"}
                                    onChange={() => setFormData(p => ({ ...p, dc: "dr" }))}
                                />
                                <i className="bi bi-arrow-up-right-circle-fill text-red-600" />
                                Cash Out
                            </label>
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

                        {/* Party / Counterparty Selection */}
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-sm font-medium text-main">
                                    Party / Counterparty <span className="text-xs text-main-500 font-normal">(Optional)</span>
                                </label>
                                <Link
                                    to="/finance/parties"
                                    className="text-xs text-primary hover:underline flex items-center gap-1"
                                >
                                    <i className="bi bi-plus-circle" /> Manage Parties
                                </Link>
                            </div>
                            <select
                                className="w-full border border-main-300 rounded px-3 py-2 text-sm bg-main-100 text-main focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                                value={formData.party_id || ""}
                                onChange={e => setFormData(p => ({ ...p, party_id: e.target.value || null }))}
                            >
                                <option value="">-- None / Direct --</option>
                                {parties.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} ({p.type})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <TextInput
                            label="Category"
                            labelBgColor="bg-main-100"
                            value={formData.category}
                            onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                            placeholder="e.g. Salary, Rent, Food, Utilities, Sales"
                            color="primary"
                            size="md"
                        />

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
                                Associated Account <span className="text-red-500">*</span>
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
                                        <option key={acc.id} value={acc.name}>
                                            {acc.name} ({acc.type}) — Current Balance: {acc.balance}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-700 dark:text-amber-300 text-sm flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-semibold">
                                        <i className="bi bi-exclamation-triangle-fill text-amber-500" />
                                        No Accounts Found
                                    </div>
                                    <p className="text-xs text-main-500">
                                        Every transaction must be associated with an existing account. Please create an account before adding a transaction.
                                    </p>
                                    <Link
                                        to="/finance/accounts"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded hover:bg-primary/90 transition-colors w-fit mt-1"
                                    >
                                        <i className="bi bi-plus-lg" /> Create Account
                                    </Link>
                                </div>
                            )}
                        </div>
                    </ModalBody>

                    <ModalFooter>
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
                />
            )}
        </div>
    );
}

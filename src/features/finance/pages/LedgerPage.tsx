import { useState, useMemo } from "react";
import CollapsibleTable, { type Column } from "../../../components/ui/Table";
import { Button } from "../../../components/ui/Buttons";
import { Toast } from "../../../components/ui/Toast";
import { Modal } from "../../../components/ui/Modal";
import { TextInput } from "../../../components/ui/TextInput";
import { DatePicker } from "../../../components/ui/DatePicker";
import { useTransactions } from "../hooks/useTransactions";
import { useAccounts } from "../hooks/useAccounts";
import type { Transaction } from "../services/TransactionService";
import Loader from "../../../components/ui/Loaders";

/* =======================
   Component
======================= */

export default function LedgerPage() {
    const { data: transactions, loading, create: createTransaction, remove: removeTransaction } = useTransactions();
    const { accounts } = useAccounts();

    const [open, setOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState("");
    const [filterAccount, setFilterAccount] = useState("");
    const [filterDateFrom, setFilterDateFrom] = useState("");
    const [filterDateTo, setFilterDateTo] = useState("");

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split("T")[0],
        amount: "",
        dc: "dr" as "dr" | "cr",
        account: "",
        category: "General",
        notes: "",
    });

    const closeModal = () => {
        setOpen(false);
        setFormData({
            date: new Date().toISOString().split("T")[0],
            amount: "",
            dc: "dr",
            account: "",
            category: "General",
            notes: "",
        });
    };

    const handleCreateEntry = async (e: React.FormEvent) => {
        e.preventDefault();
        const amt = parseFloat(formData.amount);
        if (isNaN(amt) || amt <= 0) {
            Toast.fire({ icon: "error", title: "Please enter a valid positive amount" });
            return;
        }
        if (!formData.account) {
            Toast.fire({ icon: "error", title: "Please select or specify an account" });
            return;
        }

        await createTransaction({
            date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
            amount: amt,
            dc: formData.dc,
            account: formData.account,
            category: formData.category || "General",
            notes: formData.notes,
            status: "completed",
        });

        closeModal();
    };

    const handleRemove = async (id: string) => {
        if (window.confirm("Are you sure you want to remove this ledger transaction?")) {
            await removeTransaction(id);
        }
    };

    // Filter transactions
    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx => {
            if (filterStatus && tx.status !== filterStatus) return false;
            if (filterAccount && tx.account !== filterAccount) return false;
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
    }, [transactions, filterStatus, filterAccount, filterDateFrom, filterDateTo]);

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
            key: "amount",
            header: "Amount",
            sortable: true,
            priority: 10,
            render: row => (
                <span
                    className={`font-semibold ${row.dc === "dr" ? "text-red-600" : "text-green-600"}`}
                >
                    {row.amount.toLocaleString()} TZS
                </span>
            ),
        },

        { key: "account", header: "Account", sortable: true, priority: 8 },

        {
            key: "category",
            header: "Category",
            sortable: true,
            priority: 8,
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
            priority: 7,
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
                <div className="flex gap-2">
                    <Button
                        size="xs"
                        color="error"
                        variant="outline"
                        onClick={() => handleRemove(row.id)}
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
                        value={filterAccount}
                        onChange={e => setFilterAccount(e.target.value)}
                        className="border border-main-300 rounded px-2 py-1.5 text-sm bg-main-100"
                    >
                        <option value="">All Accounts</option>
                        {availableAccounts.map(acc => (
                            <option key={acc} value={acc}>{acc}</option>
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
                        onClick={() => setOpen(true)}
                    >
                        <i className="bi bi-plus-lg" /> Add Entry
                    </Button>
                </div>
            </div>

            {/* Add Ledger Entry Modal */}
            <Modal open={open} onClose={closeModal} size="md" position="center" blur>
                <div className="bg-main-200 rounded-lg shadow-xl">
                    <div className="flex items-center justify-between px-6 py-4">
                        <h3 className="text-lg text-main font-semibold flex items-center gap-2">
                            <i className="bi bi-journal-plus" />
                            Add Ledger Entry
                        </h3>
                        <button onClick={closeModal}>
                            <i className="bi bi-x-lg" />
                        </button>
                    </div>

                    <form onSubmit={handleCreateEntry} className="p-6 space-y-4">
                        <DatePicker
                            label="Date"
                            labelBgColor="bg-main-200"
                            value={formData.date}
                            onChange={date => setFormData(p => ({ ...p, date }))}
                            required
                            color="primary"
                            size="md"
                            showTodayButton
                        />

                        <TextInput
                            label="Amount"
                            labelBgColor="bg-main-200"
                            type="number"
                            value={formData.amount}
                            onChange={e => setFormData(p => ({ ...p, amount: e.target.value }))}
                            required
                            color="primary"
                            size="md"
                        />

                        <div className="flex gap-2">
                            <label
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer border text-sm font-medium
                                ${formData.dc === "dr"
                                    ? "bg-red-200 border-2 border-red-300 text-red-600"
                                    : "border-main-300 text-main-600 hover:bg-danger-100"}
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
                                <i className="bi bi-dash-circle" />
                                Debit
                            </label>

                            <label
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer border text-sm font-medium
                                ${formData.dc === "cr"
                                    ? "bg-green-200 border-2 border-green-300 text-green-600"
                                    : "border-main-300 text-green-600 hover:bg-green-100"}
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
                                <i className="bi bi-plus-circle" />
                                Credit
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-main mb-1">
                                Account <span className="text-red-500">*</span>
                            </label>
                            {accounts.length > 0 ? (
                                <select
                                    className="w-full border border-main-300 rounded px-3 py-2 text-sm bg-main-100 text-main focus:outline-none focus:ring-2 focus:ring-primary"
                                    value={formData.account}
                                    onChange={e => setFormData(p => ({ ...p, account: e.target.value }))}
                                    required
                                >
                                    <option value="">Select Account</option>
                                    {accounts.map(acc => (
                                        <option key={acc.id} value={acc.name}>
                                            {acc.name} ({acc.balance})
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <TextInput
                                    label="Account Name"
                                    labelBgColor="bg-main-200"
                                    value={formData.account}
                                    onChange={e => setFormData(p => ({ ...p, account: e.target.value }))}
                                    placeholder="e.g. Cash, Bank, Mobile Money"
                                    required
                                    color="primary"
                                    size="md"
                                />
                            )}
                        </div>

                        <TextInput
                            label="Category"
                            labelBgColor="bg-main-200"
                            value={formData.category}
                            onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                            color="primary"
                            size="md"
                        />

                        <TextInput
                            label="Notes"
                            labelBgColor="bg-main-200"
                            value={formData.notes}
                            onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                            color="primary"
                            size="md"
                        />

                        <div className="flex justify-end gap-3 pt-4 border-t border-main-300">
                            <Button variant="outline" size="sm" onClick={closeModal} color="primary" type="button">
                                Cancel
                            </Button>
                            <Button size="sm" color="primary" type="submit">
                                Save Entry
                            </Button>
                        </div>
                    </form>
                </div>
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
                    <Button color="primary" size="md" onClick={() => setOpen(true)}>
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

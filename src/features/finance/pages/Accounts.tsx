import { useState } from "react";
// import { Toast } from "../../../components/ui/Toast";
import { Button } from "../../../components/ui/Buttons";
import { Modal } from "../../../components/ui/Modal";
import { TextInput } from "../../../components/ui/TextInput";
import { useAccounts } from "../hooks/useAccounts";
import Loader from "../../../components/ui/Loaders";

const accountTypes = [
    { value: "cash", label: "Cash" },
    { value: "savings", label: "Savings Account" },
    { value: "current", label: "Current Account" },
    { value: "mobile", label: "Mobile Wallet" },
    { value: "digital", label: "Digital Wallet" },
    { value: "credit", label: "Credit Card" },
];

const accountTypeLabels: Record<string, string> = {
    "cash": "Cash",
    "savings": "Savings Account",
    "current": "Current Account",
    "mobile": "Mobile Wallet",
    "digital": "Digital Wallet",
    "credit": "Credit Card"
};

export default function Accounts() {
    const [open, setOpen] = useState(false);
    const [, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        accountNumber: "",
        openingBalance: "",
        description: ""
    });

    const {
        accounts,
        summary,
        loading,
        error,
        createAccount,
        deleteAccount,
        formatCurrency
    } = useAccounts();

    const handleClose = () => {
        setOpen(false);
        setFormData({ name: "", type: "", accountNumber: "", openingBalance: "", description: "" });
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            await createAccount({
                name: formData.name,
                type: formData.type,
                accountNumber: formData.accountNumber,
                openingBalance: parseFloat(formData.openingBalance) || 0,
                description: formData.description
            });

            setToast({ message: "Account created successfully!", type: 'success' });
            handleClose();
        } catch (err) {
            setToast({ message: "Failed to create account", type: 'error' });
        }
    };

    const handleDeleteAccount = async (accountId: string, accountName: string) => {
        if (window.confirm(`Are you sure you want to delete "${accountName}"?`)) {
            try {
                await deleteAccount(accountId);
                setToast({ message: "Account deleted successfully!", type: 'success' });
            } catch (err) {
                setToast({ message: "Failed to delete account", type: 'error' });
            }
        }
    };

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            active: "bg-success-100 text-success-800",
            inactive: "bg-red-100 text-red-800",
            pending: "bg-yellow-100 text-yellow-800"
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const getTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            "cash": "bg-primary-100 text-primary-600",
            "savings": "bg-success-100 text-success-600",
            "current": "bg-accent-100 text-accent-600",
            "mobile": "bg-orange-100 text-orange-600",
            "digital": "bg-pink-100 text-pink-600",
            "credit": "bg-red-100 text-red-600"
        };
        return colors[type] || "bg-gray-100 text-gray-600";
    };

    if (loading && accounts.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-100">
                <Loader size={50} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-red-600 bg-red-50 rounded-lg">
                Error: {error}
                <Button onClick={() => window.location.reload()} className="mt-2" color={"success"} size={"lg"}>
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="flex-1 text-main-700">
            {/* Toast Notification */}

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text font-bold">Financial Accounts</h3>
                    <p className="text-sm text-main-500">Manage cash, bank accounts, and digital wallets</p>
                </div>
                <Button color="primary" size="sm" rounded="md" onClick={() => setOpen(true)}>
                    <i className="bi bi-plus-lg mr-2" />
                    Add Account
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-primary-100 border border-primary-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-primary-600">Total Balance</p>
                            <h4 className="text-2xl font-bold text-primary-700">
                                {formatCurrency(summary.totalBalance)}
                            </h4>
                        </div>
                        <i className="bi bi-currency-rupee text-2xl text-primary-400"></i>
                    </div>
                    <p className="text-xs text-primary-500 mt-2">Across all active accounts</p>
                </div>
                <div className="bg-success-100 border border-success-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-success-600">Active Accounts</p>
                            <h4 className="text-2xl font-bold text-success-700">{summary.activeAccounts}</h4>
                        </div>
                        <i className="bi bi-check-circle text-2xl text-success-400"></i>
                    </div>
                    <p className="text-xs text-success-500 mt-2">
                        {accounts.filter(a => a.status !== 'active').length} account(s) inactive
                    </p>
                </div>
                <div className="bg-accent-100 border border-accent-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-accent-600">Account Types</p>
                            <h4 className="text-2xl font-bold text-accent-700">{summary.accountTypes}</h4>
                        </div>
                        <i className="bi bi-wallet2 text-2xl text-accent-400"></i>
                    </div>
                    <p className="text-xs text-accent-500 mt-2">Various account types</p>
                </div>
            </div>

            {/* Accounts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {accounts.map(account => (
                    <div key={account.id} className="bg-main-200/60 rounded-lg border border-main-300 p-5 hover:ring-primary/70 hover:ring-2 transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 ${getTypeColor(account.type)} rounded-lg flex items-center justify-center`}>
                                    <i className={`bi ${account.icon}`} />
                                </div>
                                <div>
                                    <h4 className="font-semibold">{account.name}</h4>
                                    <p className="text-xs text-main-500">{account.accountNumber || "No account number"}</p>
                                </div>
                            </div>
                            {getStatusBadge(account.status)}
                        </div>

                        <div className="mb-4">
                            <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(account.type)}`}>
                                {accountTypeLabels[account.type] || account.type}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-main-600">Current Balance:</span>
                                <span className="font-bold text-lg text-main-800">{account.balance}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-main-500">Last Transaction:</span>
                                <span className="text-main-700">{account.lastTransaction}</span>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4 pt-4 border-t border-main-300">
                            <Button color="neutral" size="xs" variant="outline" className="flex-1">
                                <i className="bi bi-eye mr-1" /> View
                            </Button>
                            <Button color="neutral" size="xs" variant="outline" className="flex-1">
                                <i className="bi bi-pencil mr-1" /> Edit
                            </Button>
                            <Button
                                color="neutral"
                                size="xs"
                                variant="outline"
                                className="flex-1"
                                onClick={() => handleDeleteAccount(account.id, account.name)}
                                disabled={loading}
                            >
                                {loading ? (
                                    <i className="bi bi-arrow-clockwise animate-spin mr-1" />
                                ) : (
                                    <i className="bi bi-trash mr-1" />
                                )}
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {accounts.length === 0 && !loading && (
                <div className="text-center py-12 border border-main-300 bg-main-200/40 rounded-lg">
                    <i className="bi bi-wallet2 text-4xl text-main-400 mb-4" />
                    <h4 className="text-lg font-medium text-main-600 mb-2">No accounts yet</h4>
                    <p className="text-main-500 mb-4">Start by adding your first account</p>
                    <Button color="primary" onClick={() => setOpen(true)} size={"lg"}>
                        <i className="bi bi-plus-lg mr-2" /> Add Your First Account
                    </Button>
                </div>
            )}

            {/* Add Account Modal */}
            <Modal open={open} onClose={handleClose} size="md" position="center" blur closeOnBackdrop closeOnEsc>
                <div className={`bg-main-100 rounded-lg shadow-xl overflow-hidden ${open ? "animation-zoom-in" : ""}`}>
                    <div className="flex items-center justify-between px-6 py-4 text-main-700">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <i className="bi bi-wallet2" />
                            Add New Account
                        </h3>
                        <button onClick={handleClose}><i className="bi bi-x-lg" /></button>
                    </div>
                    <form className="p-6 space-y-4" onSubmit={handleSubmit}>
                        <TextInput
                            label="Account Name"
                            labelBgColor="bg-main-100"
                            color="primary"
                            size="md"
                            rounded="md"
                            value={formData.name}
                            onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                            required
                            placeholder="e.g., HDFC Savings, Cash Drawer, etc."
                        />

                        <div>
                            <label className="block text-sm font-medium text-main-700 mb-2">
                                Account Type
                            </label>
                            <select
                                className="w-full px-3 py-2 border border-main-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                value={formData.type}
                                onChange={e => setFormData(p => ({ ...p, type: e.target.value }))}
                                required
                            >
                                <option value="">Select account type</option>
                                {accountTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <TextInput
                            label="Account Number/Identifier (Optional)"
                            labelBgColor="bg-main-100"
                            color="primary"
                            size="md"
                            rounded="md"
                            value={formData.accountNumber}
                            onChange={e => setFormData(p => ({ ...p, accountNumber: e.target.value }))}
                            placeholder="e.g., Bank account number, wallet ID"
                        />

                        <TextInput
                            label="Opening Balance"
                            labelBgColor="bg-main-100"
                            color="primary"
                            size="md"
                            rounded="md"
                            type="number"
                            value={formData.openingBalance}
                            onChange={e => setFormData(p => ({ ...p, openingBalance: e.target.value }))}
                            required
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                        />

                        <TextInput
                            label="Description (Optional)"
                            labelBgColor="bg-main-100"
                            color="primary"
                            size="md"
                            rounded="md"
                            value={formData.description}
                            onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                            placeholder="Any additional details about this account"
                        />

                        <div className="flex justify-end gap-3 pt-4 border-t border-main-200">
                            <Button
                                type="button"
                                color="neutral"
                                size="sm"
                                variant="outline"
                                onClick={handleClose}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                color="primary"
                                size="sm"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <i className="bi bi-arrow-clockwise animate-spin mr-2" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check-lg mr-2" />
                                        Create Account
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}
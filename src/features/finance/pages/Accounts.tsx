import { useState } from "react";
import { Button } from "../../../components/ui/Buttons";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../../../components/ui/Modal";
import { TextInput } from "../../../components/ui/TextInput";
import { useAccounts } from "../hooks/useAccounts";
import Loader from "../../../components/ui/Loaders";
import type { CurrencyCode } from "../../../types/account";
import type { Account } from "../../../types/account";

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
    const [editAccount, setEditAccount] = useState<Account | null>(null);
    const [viewAccount, setViewAccount] = useState<Account | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState("");
    const [, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        currency: "TZS" as CurrencyCode,
        accountNumber: "",
        openingBalance: "",
        description: ""
    });
    const [editFormData, setEditFormData] = useState({
        name: "",
        type: "",
        currency: "TZS" as CurrencyCode,
        status: "active" as Account["status"],
        description: ""
    });

    const {
        accounts,
        summary,
        loading,
        error,
        createAccount,
        updateAccount,
        deleteAccount,
        formatCurrency
    } = useAccounts();

    const handleOpenEdit = (account: Account) => {
        setEditAccount(account);
        setEditFormData({
            name: account.name,
            type: account.type,
            currency: account.currency,
            status: account.status,
            description: account.description || ""
        });
    };

    const handleEditSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        if (!editAccount) return;

        try {
            await updateAccount(editAccount.id, editFormData);
            setToast({ message: "Account updated successfully!", type: "success" });
            setEditAccount(null);
        } catch {
            setToast({ message: "Failed to update account", type: "error" });
        }
    };

    const handleClose = () => {
        setOpen(false);
        setFormData({
            name: "",
            type: "",
            currency: "TZS",
            accountNumber: "",
            openingBalance: "",
            description: ""
        });
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            await createAccount({
                name: formData.name,
                type: formData.type,
                currency: formData.currency,
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

    const handleDeleteAccount = async () => {
        if (!viewAccount || deleteConfirmation !== viewAccount.name) return;

        try {
            await deleteAccount(viewAccount.id);
            setToast({ message: "Account deleted successfully!", type: 'success' });
            setViewAccount(null);
            setDeleteConfirmation("");
        } catch {
            setToast({ message: "Failed to delete account", type: 'error' });
        }
    };

    const handleOpenView = (account: Account) => {
        setViewAccount(account);
        setDeleteConfirmation("");
    };

    const handleCloseView = () => {
        setViewAccount(null);
        setDeleteConfirmation("");
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
            {/* Header */}
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
                            <p className="text-sm text-primary-600">Total Balance (TZS)</p>
                            <h4 className="text-2xl font-bold text-primary-700">
                                {formatCurrency(summary.balancesByCurrency?.TZS || 0, "TZS")}
                            </h4>
                            {summary.balancesByCurrency?.USD ? (
                                <p className="text-xs text-primary-600 mt-1 font-semibold">
                                    + {formatCurrency(summary.balancesByCurrency.USD, "USD")}
                                </p>
                            ) : null}
                        </div>
                        <i className="bi bi-wallet2 text-2xl text-primary-400"></i>
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
                        <i className="bi bi-collection text-2xl text-accent-400"></i>
                    </div>
                    <p className="text-xs text-accent-500 mt-2">Various account types</p>
                </div>
            </div>

            {/* Accounts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {accounts.map(account => (
                    <div key={account.id} className="group bg-main-200/60 rounded-lg border border-main-300 p-5 hover:ring-primary/70 hover:ring-2 transition-shadow">
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
                            <div className="flex items-center gap-1.5">
                                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-main-100 text-main-700 border border-main-300">
                                    {account.currency || "TZS"}
                                </span>
                                {getStatusBadge(account.status)}
                            </div>
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
                                <span className="text-main-500">Transactions:</span>
                                <span className="inline-flex items-center gap-1.5 font-semibold text-main-700">
                                    <i className="bi bi-receipt" />
                                    {account.transactionCount}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-main-300 transition-opacity md:opacity-0 md:pointer-events-none md:group-hover:opacity-100 md:group-hover:pointer-events-auto md:group-focus-within:opacity-100 md:group-focus-within:pointer-events-auto">
                            <Button
                                color="primary"
                                size="xs"
                                variant="outline"
                                className="w-8 h-8 p-0"
                                onClick={() => handleOpenEdit(account)}
                                disabled={loading}
                                aria-label={`Edit ${account.name}`}
                                title="Edit account"
                            >
                                <i className="bi bi-pencil-square" aria-hidden="true" />
                            </Button>
                            <Button
                                color="neutral"
                                size="xs"
                                variant="outline"
                                className="w-8 h-8 p-0"
                                onClick={() => handleOpenView(account)}
                                aria-label={`View ${account.name}`}
                                title="View account details"
                            >
                                <i className="bi bi-eye" aria-hidden="true" />
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
                <ModalHeader
                    title="Add New Account"
                    icon="bi-wallet2"
                    onClose={handleClose}
                />

                <form className="flex flex-col flex-1 min-h-0" onSubmit={handleSubmit}>
                    <ModalBody>
                        <TextInput
                            label="Account Name"
                            labelBgColor="bg-main-100"
                            color="primary"
                            size="md"
                            rounded="md"
                            value={formData.name}
                            onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                            required
                            placeholder="e.g., CRDB Bank, Cash Wallet, USD Account, etc."
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-main-700 mb-2">
                                    Account Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    className="w-full px-3 py-2 border border-main-300 rounded-md bg-main-100 text-main-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
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

                            <div>
                                <label className="block text-sm font-medium text-main-700 mb-2">
                                    Currency <span className="text-red-500">*</span>
                                </label>
                                <select
                                    className="w-full px-3 py-2 border border-main-300 rounded-md bg-main-100 text-main-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
                                    value={formData.currency}
                                    onChange={e => setFormData(p => ({ ...p, currency: e.target.value as CurrencyCode }))}
                                    required
                                >
                                    <option value="TZS">TZS — Tanzanian Shilling</option>
                                    <option value="USD">USD — US Dollar ($)</option>
                                </select>
                            </div>
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
                            label={`Opening Balance (${formData.currency})`}
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
                    </ModalBody>

                    <ModalFooter>
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
                    </ModalFooter>
                </form>
            </Modal>

            {/* Account Details Modal */}
            <Modal open={Boolean(viewAccount)} onClose={handleCloseView} size="md" position="center" blur closeOnBackdrop closeOnEsc>
                <ModalHeader
                    title="Account Details"
                    icon="bi-wallet2"
                    onClose={handleCloseView}
                />

                {viewAccount && (
                    <>
                        <ModalBody>
                            <div className="flex items-center gap-3 rounded-lg border border-main-300 bg-main-200/60 p-4">
                                <div className={`w-12 h-12 ${getTypeColor(viewAccount.type)} rounded-lg flex items-center justify-center text-lg`}>
                                    <i className={`bi ${viewAccount.icon}`} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-semibold text-lg truncate">{viewAccount.name}</h4>
                                    <p className="text-sm text-main-500">{accountTypeLabels[viewAccount.type] || viewAccount.type}</p>
                                </div>
                                {getStatusBadge(viewAccount.status)}
                            </div>

                            <dl className="divide-y divide-main-300 rounded-lg border border-main-300">
                                {[
                                    ["Current Balance", viewAccount.balance],
                                    ["Currency", viewAccount.currency],
                                    ["Account Number", viewAccount.accountNumber || "Not provided"],
                                    ["Transactions", String(viewAccount.transactionCount)],
                                    ["Last Transaction", viewAccount.lastTransaction || "No transactions"],
                                    ["Description", viewAccount.description || "No description"],
                                ].map(([label, value]) => (
                                    <div key={label} className="flex items-start justify-between gap-4 px-4 py-3">
                                        <dt className="text-sm text-main-500">{label}</dt>
                                        <dd className="text-sm font-medium text-main-800 text-right">{value}</dd>
                                    </div>
                                ))}
                            </dl>

                            <div className="rounded-lg border border-red-300 bg-red-50 p-4">
                                <div className="flex items-start gap-2 mb-3">
                                    <i className="bi bi-exclamation-triangle text-red-600 mt-0.5" />
                                    <div>
                                        <h5 className="font-semibold text-red-800">Delete account</h5>
                                        <p className="text-xs text-red-700">
                                            Type <strong>{viewAccount.name}</strong> to enable deletion. This action cannot be undone.
                                        </p>
                                    </div>
                                </div>
                                <input
                                    className="w-full px-3 py-2 border border-red-300 rounded-md bg-white text-main-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    value={deleteConfirmation}
                                    onChange={e => setDeleteConfirmation(e.target.value)}
                                    placeholder={viewAccount.name}
                                    autoComplete="off"
                                />
                                <Button
                                    color="error"
                                    size="sm"
                                    className="mt-3 w-full"
                                    onClick={handleDeleteAccount}
                                    disabled={loading || deleteConfirmation !== viewAccount.name}
                                >
                                    {loading ? <i className="bi bi-arrow-clockwise animate-spin mr-2" /> : <i className="bi bi-trash mr-2" />}
                                    Delete Account
                                </Button>
                            </div>
                        </ModalBody>

                        <ModalFooter>
                            <Button type="button" color="neutral" size="sm" variant="outline" onClick={handleCloseView} disabled={loading}>
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </Modal>

            {/* Edit Account Modal */}
            <Modal open={Boolean(editAccount)} onClose={() => setEditAccount(null)} size="md" position="center" blur closeOnBackdrop closeOnEsc>
                <ModalHeader
                    title="Edit Account"
                    icon="bi-pencil-square"
                    onClose={() => setEditAccount(null)}
                />

                <form className="flex flex-col flex-1 min-h-0" onSubmit={handleEditSubmit}>
                    <ModalBody>
                        <TextInput
                            label="Account Name"
                            labelBgColor="bg-main-100"
                            color="primary"
                            size="md"
                            rounded="md"
                            value={editFormData.name}
                            onChange={e => setEditFormData(p => ({ ...p, name: e.target.value }))}
                            required
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-main-700 mb-2">Account Type</label>
                                <select
                                    className="w-full px-3 py-2 border border-main-300 rounded-md bg-main-100 text-main-800 focus:outline-none focus:ring-2 focus:ring-primary"
                                    value={editFormData.type}
                                    onChange={e => setEditFormData(p => ({ ...p, type: e.target.value }))}
                                    required
                                >
                                    {accountTypes.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-main-700 mb-2">Currency</label>
                                <select
                                    className="w-full px-3 py-2 border border-main-300 rounded-md bg-main-100 text-main-800 focus:outline-none focus:ring-2 focus:ring-primary"
                                    value={editFormData.currency}
                                    onChange={e => setEditFormData(p => ({ ...p, currency: e.target.value as CurrencyCode }))}
                                >
                                    <option value="TZS">TZS — Tanzanian Shilling</option>
                                    <option value="USD">USD — US Dollar ($)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-main-700 mb-2">Status</label>
                            <select
                                className="w-full px-3 py-2 border border-main-300 rounded-md bg-main-100 text-main-800 focus:outline-none focus:ring-2 focus:ring-primary"
                                value={editFormData.status}
                                onChange={e => setEditFormData(p => ({ ...p, status: e.target.value as Account["status"] }))}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>

                        <TextInput
                            label="Description (Optional)"
                            labelBgColor="bg-main-100"
                            color="primary"
                            size="md"
                            rounded="md"
                            value={editFormData.description}
                            onChange={e => setEditFormData(p => ({ ...p, description: e.target.value }))}
                        />
                    </ModalBody>

                    <ModalFooter>
                        <Button type="button" color="neutral" size="sm" variant="outline" onClick={() => setEditAccount(null)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" color="primary" size="sm" disabled={loading}>
                            {loading ? <><i className="bi bi-arrow-clockwise animate-spin mr-2" />Saving...</> : <><i className="bi bi-check-lg mr-2" />Save Changes</>}
                        </Button>
                    </ModalFooter>
                </form>
            </Modal>
        </div>
    );
}

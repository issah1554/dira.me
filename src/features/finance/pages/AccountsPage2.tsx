import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AccountCard } from "../../../components/ui/AccountCard";
import { useAccounts } from "../hooks/useAccounts";
import Loader from "../../../components/ui/Loaders";

export const AccountsGridPage: React.FC = () => {
    const { accounts, loading, deleteAccount } = useAccounts();
    const navigate = useNavigate();

    const handleDelete = async (acc: (typeof accounts)[0]) => {
        if (acc.transactionCount > 0) {
            alert(`"${acc.name}" has ${acc.transactionCount} linked transaction(s) and cannot be deleted due to referential integrity rules. You can set the account status to inactive instead.`);
            return;
        }
        if (window.confirm(`Are you sure you want to delete "${acc.name}"?`)) {
            await deleteAccount(acc.id);
        }
    };

    return (
        <main className="min-h-screen bg-main-50 px-4 py-6">
            <div className="mx-auto w-full max-w-6xl">
                {/* Page header */}
                <header className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-main-900">
                            Accounts
                        </h1>
                        <p className="text-sm text-main-500">
                            Overview of your linked accounts.
                        </p>
                    </div>

                    <Link
                        to="/finance/accounts"
                        className="mt-2 inline-flex items-center justify-center rounded-md border border-main-300 bg-main-100 px-3 py-1.5 text-sm font-medium text-main-800 hover:bg-main-200 sm:mt-0"
                    >
                        + Add Account
                    </Link>
                </header>

                {loading && accounts.length === 0 ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader size={40} />
                    </div>
                ) : accounts.length === 0 ? (
                    <div className="text-center py-16 border border-main-300 bg-main-200/40 rounded-lg">
                        <i className="bi bi-wallet2 text-4xl text-main-400 mb-3" />
                        <h4 className="text-lg font-medium text-main-700 mb-1">No accounts found</h4>
                        <p className="text-sm text-main-500 mb-4">You haven't created any financial accounts yet.</p>
                        <Link
                            to="/finance/accounts"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-main-0 text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
                        >
                            <i className="bi bi-plus-lg" /> Add Your First Account
                        </Link>
                    </div>
                ) : (
                    /* Responsive grid of credit-card–ratio cards */
                    <section
                        className={`
                            grid gap-4
                            grid-cols-1      
                            sm:grid-cols-1  
                            md:grid-cols-1 
                            lg:grid-cols-2 
                            xl:grid-cols-3
                        `}
                    >
                        {accounts.map((acc) => (
                            <div
                                key={acc.id}
                                className="
                                    relative w-full
                                    max-w-sm
                                    aspect-85/54   /* ≈ real credit card ratio */
                                "
                            >
                                <div className="absolute inset-0">
                                    <AccountCard
                                        accountName={acc.name}
                                        accountNumber={acc.accountNumber || "—"}
                                        accountType={acc.type}
                                        status={acc.status}
                                        balance={acc.currentBalance}
                                        currency={acc.currency || "TZS"}
                                        className="h-full"
                                        onViewTransactions={() => navigate(`/finance/ledger?account=${acc.id}`)}
                                        onDelete={() => handleDelete(acc)}
                                    />
                                </div>
                            </div>
                        ))}
                    </section>
                )}
            </div>
        </main>
    );
};

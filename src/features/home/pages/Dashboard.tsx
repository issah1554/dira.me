import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useAccounts } from "../../finance/hooks/useAccounts";
import { useTransactions } from "../../finance/hooks/useTransactions";
import { transactionTypeConfig } from "../../finance/services/TransactionService";
import type { TransactionType } from "../../../types/database";

const quickActions = [
    { label: "Add Task", icon: "bi-plus-circle", to: "/todos", color: "bg-primary" },
    { label: "Ledger", icon: "bi-journal-text", to: "/finance/ledger", color: "bg-danger" },
    { label: "Parties", icon: "bi-people", to: "/finance/parties", color: "bg-purple-600" },
    { label: "Accounts", icon: "bi-bank", to: "/finance/accounts", color: "bg-success" },
];

export function Dashboard() {
    const { user } = useAuth();
    const { accounts, summary, formatCurrency } = useAccounts();
    const { data: transactions } = useTransactions();

    const username = useMemo(() => {
        if (!user?.email) return "User";
        const prefix = user.email.split("@")[0];
        return prefix.charAt(0).toUpperCase() + prefix.slice(1);
    }, [user?.email]);

    const { totalIncome, totalExpenses } = useMemo(() => {
        let income = 0;
        let expenses = 0;
        transactions.forEach(t => {
            const isCashIn = t.type === "income" || t.type === "borrow" || t.type === "collection" || t.dc === "cr";
            if (isCashIn) income += t.amount;
            else expenses += t.amount;
        });
        return { totalIncome: income, totalExpenses: expenses };
    }, [transactions]);

    const statsCards = [
        {
            label: "Total Balance",
            value: formatCurrency(summary.totalBalance),
            subtext: `${summary.activeAccounts} active account(s)`,
            icon: "bi-wallet2",
            color: "text-primary",
            bg: "bg-primary/10",
        },
        {
            label: "Total Cash In",
            value: `${totalIncome.toLocaleString()} TZS`,
            subtext: "Income & loans received",
            icon: "bi-arrow-down-left-circle",
            color: "text-emerald-600",
            bg: "bg-emerald-500/10",
        },
        {
            label: "Total Cash Out",
            value: `${totalExpenses.toLocaleString()} TZS`,
            subtext: "Expenses & repayments",
            icon: "bi-arrow-up-right-circle",
            color: "text-rose-600",
            bg: "bg-rose-500/10",
        },
        {
            label: "Transactions",
            value: String(transactions.length),
            subtext: "Total recorded entries",
            icon: "bi-receipt",
            color: "text-blue-600",
            bg: "bg-blue-500/10",
        },
    ];

    return (
        <div className="flex-1 text-main-700">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <p className="text-main-500 text-sm">
                        Welcome back, <span className="text-primary font-medium">{username}</span>!
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {statsCards.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-main-200 rounded-lg shadow-none border border-main-300 p-4 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-main-500">{stat.label}</p>
                                <p className="text-2xl font-bold mt-1 text-main-800">{stat.value}</p>
                                <p className="text-xs mt-1 text-main-400">{stat.subtext}</p>
                            </div>
                            <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                                <i className={`bi ${stat.icon} ${stat.color} text-2xl`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Recent Transactions */}
                <div className="lg:col-span-2 bg-main-200 rounded-lg shadow-none border border-main-300 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Recent Transactions</h3>
                        <Link to="/finance/ledger" className="text-xs text-primary hover:underline font-medium">
                            View all
                        </Link>
                    </div>

                    {transactions.length === 0 ? (
                        <div className="text-center py-12 border border-main-300 bg-main-100/50 rounded-md">
                            <i className="bi bi-journal-x text-3xl text-main-400 mb-2" />
                            <p className="text-sm text-main-500 mb-3">No transactions recorded yet</p>
                            <Link
                                to="/finance/ledger"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded hover:bg-primary/90 transition-colors"
                            >
                                <i className="bi bi-plus-lg" /> Add Entry
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-main-300">
                            {transactions.slice(0, 5).map(tx => {
                                const typeKey = (tx.type as TransactionType) || (tx.dc === "cr" ? "income" : "expense");
                                const cfg = transactionTypeConfig[typeKey] || transactionTypeConfig.expense;
                                const isCashIn = typeKey === "income" || typeKey === "borrow" || typeKey === "collection" || tx.dc === "cr";
                                const isUSD = tx.currency === "USD";
                                const formatted = isUSD ? `$ ${tx.amount.toFixed(2)}` : `${tx.amount.toLocaleString()} TZS`;

                                return (
                                    <div key={tx.id} className="py-2.5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${cfg.badge}`}>
                                                <i className={`bi ${cfg.icon}`} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium text-main-800">
                                                        {tx.notes || tx.category || "Transaction"}
                                                    </p>
                                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-main-300 text-main-600 font-medium capitalize">
                                                        {cfg.label}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-main-500">
                                                    {accounts.find(account => account.id === tx.accountId)?.name || "Unknown account"} • {new Date(tx.date).toLocaleDateString("en-GB")}
                                                </p>
                                            </div>
                                        </div>
                                        <span
                                            className={`text-sm font-semibold ${
                                                isCashIn ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                                            }`}
                                        >
                                            {isCashIn ? "+" : "-"} {formatted}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-main-200 rounded-lg shadow-none border border-main-300 p-5">
                    <h3 className="font-semibold mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {quickActions.map((action, index) => (
                            <Link
                                key={index}
                                to={action.to}
                                className="flex flex-col items-center justify-center p-4 rounded-lg bg-main-100 hover:bg-main-300 transition-colors group"
                            >
                                <div
                                    className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}
                                >
                                    <i className={`bi ${action.icon} text-white text-lg`} />
                                </div>
                                <span className="text-sm font-medium text-main-700">{action.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

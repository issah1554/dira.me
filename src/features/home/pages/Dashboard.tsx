import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useAccounts } from "../../finance/hooks/useAccounts";
import { useTransactions } from "../../finance/hooks/useTransactions";

const quickActions = [
    { label: "Add Task", icon: "bi-plus-circle", to: "/todos", color: "bg-primary" },
    { label: "Ledger", icon: "bi-cash-coin", to: "/finance/ledger", color: "bg-danger" },
    { label: "View Reports", icon: "bi-bar-chart", to: "/reports", color: "bg-info" },
    { label: "Manage Budget", icon: "bi-piggy-bank", to: "/finance/budgets", color: "bg-success" },
];

export function Dashboard() {
    const { user } = useAuth();
    const { summary, formatCurrency } = useAccounts();
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
            if (t.dc === "cr") income += t.amount;
            else if (t.dc === "dr") expenses += t.amount;
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
            label: "Total Income",
            value: `${totalIncome.toLocaleString()} TZS`,
            subtext: "Recorded credits",
            icon: "bi-currency-dollar",
            color: "text-success",
            bg: "bg-success/10",
        },
        {
            label: "Total Expenses",
            value: `${totalExpenses.toLocaleString()} TZS`,
            subtext: "Recorded debits",
            icon: "bi-cash-stack",
            color: "text-danger",
            bg: "bg-danger/10",
        },
        {
            label: "Transactions",
            value: String(transactions.length),
            subtext: "Total recorded entries",
            icon: "bi-receipt",
            color: "text-info",
            bg: "bg-info/10",
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
                            {transactions.slice(0, 5).map(tx => (
                                <div key={tx.id} className="py-2.5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                tx.dc === "cr"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            <i
                                                className={`bi ${
                                                    tx.dc === "cr" ? "bi-arrow-down-left" : "bi-arrow-up-right"
                                                }`}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-main-800">
                                                {tx.notes || tx.category || "Transaction"}
                                            </p>
                                            <p className="text-xs text-main-500">
                                                {tx.account} • {new Date(tx.date).toLocaleDateString("en-GB")}
                                            </p>
                                        </div>
                                    </div>
                                    <span
                                        className={`text-sm font-semibold ${
                                            tx.dc === "cr" ? "text-green-600" : "text-red-600"
                                        }`}
                                    >
                                        {tx.dc === "cr" ? "+" : "-"}{tx.amount.toLocaleString()} TZS
                                    </span>
                                </div>
                            ))}
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

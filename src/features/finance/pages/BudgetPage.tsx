import CollapsibleTable, { type Column } from "../../../components/ui/Table";
import { Button } from "../../../components/ui/Buttons";

/* =======================
   Row type
======================= */

type BudgetRow = {
    id: number;
    category: string;
    account: string;
    planned_amount: number;
    actual_amount: number;
    period: string; // e.g. "Jan 2026"
    status: "on-track" | "over-budget" | "under-budget";
};

/* =======================
   Columns
======================= */

const columns: Column<BudgetRow>[] = [
    {
        key: "category",
        header: "Category",
        sortable: true,
        priority: 10,
    },
    {
        key: "account",
        header: "Account",
        sortable: true,
        priority: 8,
    },
    {
        key: "planned_amount",
        header: "Planned",
        sortable: true,
        priority: 9,
        render: row => (
            <span className="font-semibold text-primary-700">
                {row.planned_amount.toLocaleString()} TZS
            </span>
        ),
    },
    {
        key: "actual_amount",
        header: "Actual",
        sortable: true,
        priority: 9,
        render: row => (
            <span
                className={`font-semibold ${row.actual_amount > row.planned_amount
                        ? "text-danger-600"
                        : "text-success-600"
                    }`}
            >
                {row.actual_amount.toLocaleString()} TZS
            </span>
        ),
    },
    {
        key: "status",
        header: "Status",
        sortable: true,
        priority: 7,
        render: row => (
            <span
                className={`px-2 py-0.5 rounded text-xs font-semibold ${row.status === "on-track"
                        ? "bg-success-100 text-success-700"
                        : row.status === "over-budget"
                            ? "bg-danger-100 text-danger-700"
                            : "bg-warning-100 text-warning-700"
                    }`}
            >
                {row.status}
            </span>
        ),
    },
    {
        key: "period",
        header: "Period",
        sortable: true,
        priority: 6,
    },
    {
        key: "actions",
        header: "Actions",
        sortable: false,
        priority: 9,
        render: () => (
            <div className="flex gap-2">
                <Button size="xs" color="primary">Edit</Button>
                <Button size="xs" color="error">Delete</Button>
            </div>
        ),
    },
];

/* =======================
   Data
======================= */

const budgets: BudgetRow[] = [
    {
        id: 1,
        category: "Rent",
        account: "Bank",
        planned_amount: 800000,
        actual_amount: 800000,
        period: "Jan 2026",
        status: "on-track",
    },
    {
        id: 2,
        category: "Utilities",
        account: "Bank",
        planned_amount: 300000,
        actual_amount: 350000,
        period: "Jan 2026",
        status: "over-budget",
    },
    {
        id: 3,
        category: "Transport",
        account: "Cash",
        planned_amount: 150000,
        actual_amount: 90000,
        period: "Jan 2026",
        status: "under-budget",
    },
    {
        id: 4,
        category: "Food",
        account: "Cash",
        planned_amount: 400000,
        actual_amount: 420000,
        period: "Jan 2026",
        status: "over-budget",
    },
];

/* =======================
   Component
======================= */

export default function BudgetPage() {
    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1.5 border border-main-300 rounded px-2 py-1 bg-main-100">
                        <i className="bi bi-calendar-month text-main-500 text-xs" />
                        <input
                            type="month"
                            defaultValue="2026-01"
                            aria-label="Filter period"
                            className="bg-transparent text-xs text-main focus:outline-none cursor-pointer"
                        />
                    </div>

                    <select className="border border-main-300 rounded px-2 py-1.5 text-sm bg-main-100">
                        <option value="">All Accounts</option>
                        <option>Cash</option>
                        <option>Bank</option>
                    </select>
                </div>

                <div className="flex gap-2">
                    <Button size="sm" color="primary">
                        Add Budget
                    </Button>
                    <Button size="sm" color={"primary"}>
                        Export Excel
                    </Button>
                </div>
            </div>

            {/* Table */}
            <CollapsibleTable
                data={budgets}
                columns={columns}
                rowsPerPage={5}
            />
        </div>
    );
}

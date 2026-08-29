import CollapsibleTable, { type Column } from "../../../components/ui/Table";
import { Button } from "../../../components/ui/Buttons";

/* =======================
   Row type
======================= */

type ObligationRow = {
    id: number;
    account: string;
    counterparty_name: string;
    dc: "dr" | "cr";                 // dr = payable, cr = receivable (NOT shown)
    original_amount: number;
    paid_amount: number;
    start_date: string;
    due_date: string;
    created_at: string;
    status: "open" | "settled" | "overdue";
};

/* =======================
   Columns
======================= */

const columns: Column<ObligationRow>[] = [
    {
        key: "account",
        header: "Account",
        sortable: true,
        priority: 6,
    },
    {
        key: "counterparty_name",
        header: "Counterparty",
        sortable: true,
        priority: 10,
    },
    {
        key: "original_amount",
        header: "Original Amount",
        sortable: true,
        priority: 9,
        render: row => (
            <span
                className={`font-semibold ${row.dc === "dr" ? "text-red-600" : "text-green-600"
                    }`}
            >
                {row.original_amount.toLocaleString()} TZS
            </span>
        ),
    },
    {
        key: "paid_amount",
        header: "Paid Amount",
        sortable: true,
        priority: 8,
        render: row => (
            <span
                className={`font-semibold ${row.dc === "dr" ? "text-red-500" : "text-green-500"
                    }`}
            >
                {row.paid_amount.toLocaleString()} TZS
            </span>
        ),
    },
    {
        key: "start_date",
        header: "Start Date",
        sortable: true,
        priority: 6,
    },
    {
        key: "due_date",
        header: "Due Date",
        sortable: true,
        priority: 6,
    },
    {
        key: "created_at",
        header: "Created At",
        sortable: true,
        priority: 5,
    },
    {
        key: "status",
        header: "Status",
        sortable: true,
        priority: 7,
        render: row => (
            <span
                className={`px-2 py-0.5 rounded text-xs font-semibold ${row.status === "settled"
                        ? "bg-green-100 text-green-700"
                        : row.status === "overdue"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                    }`}
            >
                {row.status}
            </span>
        ),
    },
    {
        key: "actions",
        header: "Actions",
        sortable: false,
        priority: 9,
        render: () => (
            <div className="flex gap-2">
                <Button size="xs" color="primary">View</Button>
                <Button size="xs" color="success">Apply Payment</Button>
            </div>
        ),
    },
];

/* =======================
   Data
======================= */

const obligations: ObligationRow[] = [
    {
        id: 1,
        account: "Bank",
        counterparty_name: "Electricity Company",
        dc: "dr",
        original_amount: 300000,
        paid_amount: 120000,
        start_date: "2026-01-01",
        due_date: "2026-01-10",
        created_at: "2026-01-01",
        status: "open",
    },
    {
        id: 2,
        account: "Bank",
        counterparty_name: "ABC Client Ltd",
        dc: "cr",
        original_amount: 850000,
        paid_amount: 850000,
        start_date: "2026-01-02",
        due_date: "2026-01-15",
        created_at: "2026-01-02",
        status: "open",
    },
    {
        id: 3,
        account: "Cash",
        counterparty_name: "ISP Provider",
        dc: "dr",
        original_amount: 120000,
        paid_amount: 120000,
        start_date: "2025-12-20",
        due_date: "2026-01-05",
        created_at: "2025-12-20",
        status: "overdue",
    },
    {
        id: 4,
        account: "Bank",
        counterparty_name: "Retail Partner",
        dc: "cr",
        original_amount: 500000,
        paid_amount: 0,
        start_date: "2025-12-10",
        due_date: "2025-12-30",
        created_at: "2025-12-10",
        status: "settled",
    },
];

/* =======================
   Component
======================= */

export default function ObligationsPage() {
    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                    <select className="border border-main-300 rounded px-2 py-1.5 text-sm bg-main-100">
                        <option value="">All Status</option>
                        <option value="open">Open</option>
                        <option value="overdue">Overdue</option>
                        <option value="settled">Settled</option>
                    </select>

                    <select className="border border-main-300 rounded px-2 py-1.5 text-sm bg-main-100">
                        <option value="">All Types</option>
                        <option value="dr">Cash Out (Payables)</option>
                        <option value="cr">Cash In (Receivables)</option>
                    </select>

                    <div className="flex items-center gap-1.5 border border-main-300 rounded px-2 py-1 bg-main-100">
                        <i className="bi bi-calendar-range text-main-500 text-xs" />
                        <input
                            type="date"
                            aria-label="From date"
                            className="bg-transparent text-xs text-main focus:outline-none cursor-pointer"
                        />
                        <span className="text-xs text-main-400">—</span>
                        <input
                            type="date"
                            aria-label="To date"
                            className="bg-transparent text-xs text-main focus:outline-none cursor-pointer"
                        />
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button size="sm" color={"primary"}>Export PDF</Button>
                    <Button size="sm" color={"primary"}>Export Excel</Button>
                </div>
            </div>

            {/* Table */}
            <CollapsibleTable
                data={obligations}
                columns={columns}
                rowsPerPage={5}
            />
        </div>
    );
}

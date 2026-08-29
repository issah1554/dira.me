import { useState } from "react";
import { Button } from "../../../components/ui/Buttons";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../../../components/ui/Modal";
import { TextInput } from "../../../components/ui/TextInput";
import { DatePicker } from "../../../components/ui/DatePicker";

type Todo = {
    id: number;
    title: string;
    description: string;
    category: string;
    priority: "low" | "medium" | "high";
    status: "pending" | "in-progress" | "completed";
    dueDate: string;
    createdAt: string;
};

const sampleTodos: Todo[] = [
    { id: 1, title: "Review monthly budget", description: "Check and adjust budget allocations", category: "Finance", priority: "high", status: "pending", dueDate: "2026-01-10", createdAt: "2026-01-05" },
    { id: 2, title: "Pay electricity bill", description: "Due on 15th of the month", category: "Bills", priority: "high", status: "pending", dueDate: "2026-01-15", createdAt: "2026-01-03" },
    { id: 3, title: "Update expense tracker", description: "Add last week's expenses", category: "Finance", priority: "medium", status: "in-progress", dueDate: "2026-01-08", createdAt: "2026-01-02" },
    { id: 4, title: "Plan grocery shopping", description: "Make list and budget", category: "Personal", priority: "medium", status: "pending", dueDate: "2026-01-07", createdAt: "2026-01-04" },
    { id: 5, title: "Review investment portfolio", description: "Check performance and rebalance", category: "Finance", priority: "low", status: "completed", dueDate: "2026-01-05", createdAt: "2026-01-01" },
];

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case "high": return "text-red-600 bg-red-100";
        case "medium": return "text-yellow-600 bg-yellow-100";
        case "low": return "text-green-600 bg-green-100";
        default: return "text-main-600 bg-main-200";
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case "completed": return "text-green-600 bg-green-100";
        case "in-progress": return "text-blue-600 bg-blue-100";
        case "pending": return "text-orange-600 bg-orange-100";
        default: return "text-main-600 bg-main-200";
    }
};

export function TodoList() {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        priority: "medium",
        dueDate: ""
    });

    const handleClose = () => {
        setOpen(false);
        setFormData({ title: "", description: "", category: "", priority: "medium", dueDate: "" });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        handleClose();
    };

    const stats = {
        total: sampleTodos.length,
        pending: sampleTodos.filter(t => t.status === "pending").length,
        inProgress: sampleTodos.filter(t => t.status === "in-progress").length,
        completed: sampleTodos.filter(t => t.status === "completed").length,
    };

    return (
        <div className="flex-1 text-main-700">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text font-bold">My Tasks</h3>
                    <p className="text-sm text-main-500">Manage your daily tasks and todos</p>
                </div>
                <Button color="primary" size="sm" rounded="md" onClick={() => setOpen(true)}>
                    <i className="bi bi-plus-lg mr-2" />
                    Add Task
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-main-200 rounded-lg p-4 border border-main-300">
                    <div className="text-2xl font-bold text-primary">{stats.total}</div>
                    <div className="text-sm text-main-500">Total Tasks</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
                    <div className="text-sm text-main-500">Pending</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                    <div className="text-sm text-main-500">In Progress</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                    <div className="text-sm text-main-500">Completed</div>
                </div>
            </div>

            {/* Todos List */}
            <div className="space-y-3">
                {sampleTodos.map(todo => (
                    <div key={todo.id} className="bg-main-200 rounded-lg p-4 border border-main-300 hover:border-primary/70 transition-all">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h4 className="font-semibold text-lg">{todo.title}</h4>
                                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(todo.priority)}`}>
                                        {todo.priority}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(todo.status)}`}>
                                        {todo.status}
                                    </span>
                                </div>
                                <p className="text-sm text-main-600 mb-3">{todo.description}</p>
                                <div className="flex items-center gap-4 text-xs text-main-500">
                                    <span><i className="bi bi-tag mr-1" />{todo.category}</span>
                                    <span><i className="bi bi-calendar mr-1" />Due: {todo.dueDate}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="text-main-600 hover:text-primary p-2">
                                    <i className="bi bi-pencil" />
                                </button>
                                <button className="text-main-600 hover:text-red-600 p-2">
                                    <i className="bi bi-trash" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Todo Modal */}
            <Modal open={open} onClose={handleClose} size="md" position="center" blur closeOnBackdrop closeOnEsc>
                <ModalHeader
                    title="Add New Task"
                    icon="bi-check-circle"
                    onClose={handleClose}
                />

                <form className="flex flex-col flex-1 min-h-0" onSubmit={handleSubmit}>
                    <ModalBody>
                        <TextInput
                            label="Task Title"
                            labelBgColor="bg-main-100"
                            color="primary"
                            size="md"
                            rounded="md"
                            value={formData.title}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(p => ({ ...p, title: e.target.value }))}
                            required
                        />
                        <TextInput
                            label="Description"
                            labelBgColor="bg-main-100"
                            color="primary"
                            size="md"
                            rounded="md"
                            value={formData.description}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(p => ({ ...p, description: e.target.value }))}
                        />
                        <TextInput
                            label="Category"
                            labelBgColor="bg-main-100"
                            color="primary"
                            size="md"
                            rounded="md"
                            value={formData.category}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(p => ({ ...p, category: e.target.value }))}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Priority</label>
                                <select
                                    className="w-full border border-main-300 rounded-md px-3 py-2 bg-main-100 text-main-800 focus:outline-none focus:ring-2 focus:ring-primary"
                                    value={formData.priority}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData(p => ({ ...p, priority: e.target.value as "low" | "medium" | "high" }))}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <DatePicker
                                label="Due Date"
                                labelBgColor="bg-main-100"
                                color="primary"
                                size="md"
                                rounded="md"
                                value={formData.dueDate}
                                onChange={dueDate => setFormData(p => ({ ...p, dueDate }))}
                                showTodayButton
                            />
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button type="button" color="secondary" size="sm" rounded="md" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" color="primary" size="sm" rounded="md">
                            Add Task
                        </Button>
                    </ModalFooter>
                </form>
            </Modal>
        </div>
    );
}


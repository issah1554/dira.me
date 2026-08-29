import { useState } from "react";
import { Button } from "../../../components/ui/Buttons";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../../../components/ui/Modal";
import { TextInput } from "../../../components/ui/TextInput";

type Category = {
    id: number;
    name: string;
    description: string;
    color: string;
    icon: string;
    taskCount: number;
};

const sampleCategories: Category[] = [
    { id: 1, name: "Finance", description: "Financial tasks and money management", color: "bg-green-500", icon: "bi-wallet2", taskCount: 12 },
    { id: 2, name: "Bills", description: "Utility and subscription payments", color: "bg-red-500", icon: "bi-receipt", taskCount: 8 },
    { id: 3, name: "Personal", description: "Personal errands and activities", color: "bg-blue-500", icon: "bi-person", taskCount: 15 },
    { id: 4, name: "Shopping", description: "Shopping lists and purchases", color: "bg-purple-500", icon: "bi-cart", taskCount: 6 },
    { id: 5, name: "Health", description: "Health and wellness tasks", color: "bg-pink-500", icon: "bi-heart-pulse", taskCount: 4 },
    { id: 6, name: "Work", description: "Work-related tasks", color: "bg-orange-500", icon: "bi-briefcase", taskCount: 20 },
];

export function TodoCategories() {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        color: "bg-blue-500",
        icon: "bi-tag"
    });

    const handleClose = () => {
        setOpen(false);
        setFormData({ name: "", description: "", color: "bg-blue-500", icon: "bi-tag" });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        handleClose();
    };

    return (
        <div className="flex-1 text-main-700">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text font-bold">Task Categories</h3>
                    <p className="text-sm text-main-500">Organize your tasks into categories</p>
                </div>
                <Button color="primary" size="sm" rounded="md" onClick={() => setOpen(true)}>
                    <i className="bi bi-plus-lg mr-2" />
                    Add Category
                </Button>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampleCategories.map(category => (
                    <div key={category.id} className="bg-main-200 rounded-lg p-5 border border-main-300 hover:border-primary/70 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center text-white`}>
                                    <i className={`bi ${category.icon} text-xl`} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">{category.name}</h4>
                                    <p className="text-xs text-main-500">{category.taskCount} tasks</p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button className="text-main-600 hover:text-primary p-1">
                                    <i className="bi bi-pencil" />
                                </button>
                                <button className="text-main-600 hover:text-red-600 p-1">
                                    <i className="bi bi-trash" />
                                </button>
                            </div>
                        </div>
                        <p className="text-sm text-main-600">{category.description}</p>
                    </div>
                ))}
            </div>

            {/* Add Category Modal */}
            <Modal open={open} onClose={handleClose} size="md" position="center" blur closeOnBackdrop closeOnEsc>
                <ModalHeader
                    title="Add New Category"
                    icon="bi-tag"
                    onClose={handleClose}
                />

                <form className="flex flex-col flex-1 min-h-0" onSubmit={handleSubmit}>
                    <ModalBody>
                        <TextInput
                            label="Category Name"
                            labelBgColor="bg-main-100"
                            color="primary"
                            size="md"
                            rounded="md"
                            value={formData.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(p => ({ ...p, name: e.target.value }))}
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
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Color</label>
                                <select
                                    className="w-full border border-main-300 rounded-md px-3 py-2 bg-main-100 text-main-800 focus:outline-none focus:ring-2 focus:ring-primary"
                                    value={formData.color}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData(p => ({ ...p, color: e.target.value }))}
                                >
                                    <option value="bg-blue-500">Blue</option>
                                    <option value="bg-green-500">Green</option>
                                    <option value="bg-red-500">Red</option>
                                    <option value="bg-purple-500">Purple</option>
                                    <option value="bg-orange-500">Orange</option>
                                    <option value="bg-pink-500">Pink</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Icon</label>
                                <select
                                    className="w-full border border-main-300 rounded-md px-3 py-2 bg-main-100 text-main-800 focus:outline-none focus:ring-2 focus:ring-primary"
                                    value={formData.icon}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData(p => ({ ...p, icon: e.target.value }))}
                                >
                                    <option value="bi-tag">Tag</option>
                                    <option value="bi-wallet2">Wallet</option>
                                    <option value="bi-receipt">Receipt</option>
                                    <option value="bi-cart">Cart</option>
                                    <option value="bi-person">Person</option>
                                    <option value="bi-briefcase">Briefcase</option>
                                    <option value="bi-heart-pulse">Health</option>
                                </select>
                            </div>
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button type="button" color="secondary" size="sm" rounded="md" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" color="primary" size="sm" rounded="md">
                            Add Category
                        </Button>
                    </ModalFooter>
                </form>
            </Modal>
        </div>
    );
}

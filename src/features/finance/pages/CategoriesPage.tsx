// src/features/finance/pages/CategoriesPage.tsx
import { useState, useMemo } from "react";
import { Button } from "../../../components/ui/Buttons";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../../../components/ui/Modal";
import { TextInput } from "../../../components/ui/TextInput";
import { Toast } from "../../../components/ui/Toast";
import Loader from "../../../components/ui/Loaders";
import { useCategories } from "../hooks/useCategories";
import { useTransactionTypes } from "../hooks/useTransactionTypes";
import { categoryColorStyles } from "../services/categoryService";
import type { TransactionCategory } from "../../../types/category";
import type { TransactionTypeItem } from "../../../types/transactionType";

const AVAILABLE_ICONS = [
    { value: "bi-tag", label: "Tag" },
    { value: "bi-cash-stack", label: "Cash Stack" },
    { value: "bi-cash-coin", label: "Cash Coin" },
    { value: "bi-wallet2", label: "Wallet" },
    { value: "bi-briefcase", label: "Briefcase" },
    { value: "bi-laptop", label: "Laptop" },
    { value: "bi-egg-fried", label: "Food" },
    { value: "bi-cart", label: "Cart" },
    { value: "bi-bag", label: "Bag" },
    { value: "bi-car-front", label: "Transport" },
    { value: "bi-fuel-pump", label: "Fuel" },
    { value: "bi-house-door", label: "Housing" },
    { value: "bi-lightning-charge", label: "Utilities" },
    { value: "bi-controller", label: "Entertainment" },
    { value: "bi-mortarboard", label: "Education" },
    { value: "bi-people", label: "Family" },
    { value: "bi-gift", label: "Gift" },
    { value: "bi-credit-card", label: "Card/Fees" },
    { value: "bi-receipt", label: "Receipt" },
    { value: "bi-heart-pulse", label: "Health" },
    { value: "bi-shield-check", label: "Insurance" },
    { value: "bi-airplane", label: "Travel" },
    { value: "bi-question-circle", label: "Other" },
];

const AVAILABLE_COLORS = [
    { value: "emerald", label: "Emerald (Green)" },
    { value: "blue", label: "Blue" },
    { value: "teal", label: "Teal" },
    { value: "amber", label: "Amber" },
    { value: "orange", label: "Orange" },
    { value: "indigo", label: "Indigo" },
    { value: "yellow", label: "Yellow" },
    { value: "pink", label: "Pink" },
    { value: "purple", label: "Purple" },
    { value: "sky", label: "Sky Blue" },
    { value: "rose", label: "Rose" },
    { value: "red", label: "Red" },
    { value: "gray", label: "Gray" },
    { value: "primary", label: "Theme Primary" },
];

export default function CategoriesPage() {
    const [activeTab, setActiveTab] = useState<"categories" | "types">("categories");

    // Category hook state
    const {
        categories,
        loading: loadingCategories,
        createCategory,
        updateCategory,
        deleteCategory,
    } = useCategories();

    // Type hook state
    const {
        types,
        loading: loadingTypes,
        createType,
        updateType,
        deleteType,
    } = useTransactionTypes();

    const [searchQuery, setSearchQuery] = useState("");

    // Modal state for Categories
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<TransactionCategory | null>(null);
    const [categoryForm, setCategoryForm] = useState({
        name: "",
        description: "",
        icon: "bi-tag",
        color: "primary",
    });

    // Modal state for Types
    const [typeModalOpen, setTypeModalOpen] = useState(false);
    const [editingType, setEditingType] = useState<TransactionTypeItem | null>(null);
    const [typeForm, setTypeForm] = useState({
        code: "",
        label: "",
        dc: "dr" as "dr" | "cr",
        icon: "bi-arrow-left-right",
        color: "primary",
        description: "",
    });

    /* =========================================================================
       Category Handlers
       ========================================================================= */

    const handleOpenAddCategory = () => {
        setEditingCategory(null);
        setCategoryForm({
            name: "",
            description: "",
            icon: "bi-tag",
            color: "primary",
        });
        setCategoryModalOpen(true);
    };

    const handleOpenEditCategory = (cat: TransactionCategory) => {
        setEditingCategory(cat);
        setCategoryForm({
            name: cat.name,
            description: cat.description || "",
            icon: cat.icon || "bi-tag",
            color: cat.color || "primary",
        });
        setCategoryModalOpen(true);
    };

    const handleCloseCategoryModal = () => {
        setCategoryModalOpen(false);
        setEditingCategory(null);
    };

    const handleSubmitCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryForm.name.trim()) {
            Toast.fire({ icon: "error", title: "Category name is required" });
            return;
        }

        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, categoryForm);
                Toast.fire({ icon: "success", title: "Category updated successfully" });
            } else {
                await createCategory(categoryForm);
                Toast.fire({ icon: "success", title: "Category created successfully" });
            }
            handleCloseCategoryModal();
        } catch {
            Toast.fire({ icon: "error", title: "Failed to save category" });
        }
    };

    const handleDeleteCategory = async (cat: TransactionCategory) => {
        if (window.confirm(`Are you sure you want to delete the category "${cat.name}"?`)) {
            try {
                await deleteCategory(cat.id);
                Toast.fire({ icon: "success", title: "Category deleted" });
            } catch {
                Toast.fire({ icon: "error", title: "Failed to delete category" });
            }
        }
    };

    /* =========================================================================
       Type Handlers
       ========================================================================= */

    const handleOpenAddType = () => {
        setEditingType(null);
        setTypeForm({
            code: "",
            label: "",
            dc: "dr",
            icon: "bi-arrow-left-right",
            color: "primary",
            description: "",
        });
        setTypeModalOpen(true);
    };

    const handleOpenEditType = (typeItem: TransactionTypeItem) => {
        setEditingType(typeItem);
        setTypeForm({
            code: typeItem.code,
            label: typeItem.label,
            dc: typeItem.dc,
            icon: typeItem.icon || "bi-arrow-left-right",
            color: typeItem.color || "primary",
            description: typeItem.description || "",
        });
        setTypeModalOpen(true);
    };

    const handleCloseTypeModal = () => {
        setTypeModalOpen(false);
        setEditingType(null);
    };

    const handleSubmitType = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!typeForm.label.trim()) {
            Toast.fire({ icon: "error", title: "Type label is required" });
            return;
        }

        try {
            if (editingType) {
                await updateType(editingType.id, {
                    label: typeForm.label,
                    dc: typeForm.dc,
                    icon: typeForm.icon,
                    color: typeForm.color,
                    description: typeForm.description,
                });
                Toast.fire({ icon: "success", title: "Transaction type updated" });
            } else {
                const code = typeForm.code.trim() || typeForm.label.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
                await createType({
                    code,
                    label: typeForm.label,
                    dc: typeForm.dc,
                    icon: typeForm.icon,
                    color: typeForm.color,
                    description: typeForm.description,
                });
                Toast.fire({ icon: "success", title: "Transaction type created" });
            }
            handleCloseTypeModal();
        } catch {
            Toast.fire({ icon: "error", title: "Failed to save transaction type" });
        }
    };

    const handleDeleteType = async (typeItem: TransactionTypeItem) => {
        if (window.confirm(`Are you sure you want to delete transaction type "${typeItem.label}"?`)) {
            try {
                await deleteType(typeItem.id);
                Toast.fire({ icon: "success", title: "Transaction type removed" });
            } catch {
                Toast.fire({ icon: "error", title: "Failed to delete transaction type" });
            }
        }
    };

    /* =========================================================================
       Filtered Data
       ========================================================================= */

    const filteredCategories = useMemo(() => {
        if (!searchQuery.trim()) return categories;
        const q = searchQuery.toLowerCase();
        return categories.filter(
            c => c.name.toLowerCase().includes(q) || (c.description && c.description.toLowerCase().includes(q))
        );
    }, [categories, searchQuery]);

    const filteredTypes = useMemo(() => {
        if (!searchQuery.trim()) return types;
        const q = searchQuery.toLowerCase();
        return types.filter(
            t =>
                t.label.toLowerCase().includes(q) ||
                t.code.toLowerCase().includes(q) ||
                (t.description && t.description.toLowerCase().includes(q))
        );
    }, [types, searchQuery]);

    const isLoading = (activeTab === "categories" && loadingCategories && categories.length === 0) ||
                      (activeTab === "types" && loadingTypes && types.length === 0);

    return (
        <div className="flex-1 text-main-700 space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold text-main-900 flex items-center gap-2">
                        <i className="bi bi-tags text-primary" />
                        Categories & Transaction Types
                    </h3>
                </div>

                <div className="flex items-center gap-2">
                    {activeTab === "categories" ? (
                        <Button color="primary" size="sm" onClick={handleOpenAddCategory}>
                            <i className="bi bi-plus-lg mr-1.5" /> Add Category
                        </Button>
                    ) : (
                        <Button color="primary" size="sm" onClick={handleOpenAddType}>
                            <i className="bi bi-plus-lg mr-1.5" /> Add Type
                        </Button>
                    )}
                </div>
            </div>

            {/* Navigation Tabs & Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-main-200/50 p-2.5 rounded-xl border border-main-300">
                <div className="flex items-center gap-1.5 bg-main-100 p-1 rounded-lg border border-main-300">
                    <button
                        onClick={() => {
                            setActiveTab("categories");
                            setSearchQuery("");
                        }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                            activeTab === "categories"
                                ? "bg-primary text-main-0 shadow-sm"
                                : "text-main-600 hover:text-main-900"
                        }`}
                    >
                        <i className="bi bi-tag" />
                        Categories
                        <span
                            className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                                activeTab === "categories" ? "bg-main-0/20 text-main-0" : "bg-main-300 text-main-700"
                            }`}
                        >
                            {categories.length}
                        </span>
                    </button>

                    <button
                        onClick={() => {
                            setActiveTab("types");
                            setSearchQuery("");
                        }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                            activeTab === "types"
                                ? "bg-primary text-main-0 shadow-sm"
                                : "text-main-600 hover:text-main-900"
                        }`}
                    >
                        <i className="bi bi-arrow-left-right" />
                        Transaction Types
                        <span
                            className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                                activeTab === "types" ? "bg-main-0/20 text-main-0" : "bg-main-300 text-main-700"
                            }`}
                        >
                            {types.length}
                        </span>
                    </button>
                </div>

                <div className="relative flex-1 max-w-sm min-w-50">
                    <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-main-400 text-xs" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder={`Search ${activeTab === "categories" ? "categories..." : "types..."}`}
                        className="w-full pl-8 pr-7 py-1.5 text-xs bg-main-100 border border-main-300 rounded-lg text-main placeholder:text-main-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-main-400 hover:text-main-700"
                        >
                            <i className="bi bi-x text-sm" />
                        </button>
                    )}
                </div>
            </div>

            {/* Content Section */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader size={45} />
                </div>
            ) : activeTab === "categories" ? (
                /* Categories Grid */
                filteredCategories.length === 0 ? (
                    <div className="text-center py-16 border border-main-300 bg-main-200/40 rounded-xl">
                        <i className="bi bi-tag text-4xl text-main-400 mb-2" />
                        <h4 className="text-base font-semibold text-main-700">No categories found</h4>
                        <p className="text-xs text-main-500 mb-4">
                            {categories.length === 0
                                ? "No transaction categories available."
                                : "Try clearing your search query."}
                        </p>
                        <Button color="primary" size="sm" onClick={handleOpenAddCategory}>
                            <i className="bi bi-plus-lg mr-1" /> Add Category
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5">
                        {filteredCategories.map(cat => {
                            const colorKey = cat.color || "primary";
                            const style = categoryColorStyles[colorKey] || categoryColorStyles.primary;

                            return (
                                <div
                                    key={cat.id}
                                    className="bg-main-200/70 rounded-xl border border-main-300 p-4 hover:border-primary/60 hover:shadow-sm transition-all flex flex-col justify-between group"
                                >
                                    <div>
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div className="flex items-center gap-2.5">
                                                <div
                                                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${style.bg}`}
                                                >
                                                    <i className={`bi ${cat.icon || "bi-tag"} text-base`} />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-sm text-main-900">{cat.name}</h4>
                                                    {cat.isSystem && (
                                                        <span className="text-[10px] text-main-400 font-medium">Standard</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleOpenEditCategory(cat)}
                                                    className="p-1 rounded text-main-500 hover:text-primary hover:bg-main-300 transition-colors"
                                                    title="Edit Category"
                                                >
                                                    <i className="bi bi-pencil text-xs" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCategory(cat)}
                                                    className="p-1 rounded text-main-500 hover:text-danger-600 hover:bg-danger-50 transition-colors"
                                                    title="Delete Category"
                                                >
                                                    <i className="bi bi-trash text-xs" />
                                                </button>
                                            </div>
                                        </div>

                                        <p className="text-xs text-main-600 line-clamp-2 mt-1">
                                            {cat.description || "No description or examples provided."}
                                        </p>
                                    </div>

                                    <div className="mt-3 pt-2.5 border-t border-main-300/60 flex items-center justify-between text-[11px] text-main-400">
                                        <span className={`px-2 py-0.2 rounded-full border text-[10px] font-semibold capitalize ${style.badge}`}>
                                            {cat.color || "Default"}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )
            ) : (
                /* Transaction Types Grid */
                filteredTypes.length === 0 ? (
                    <div className="text-center py-16 border border-main-300 bg-main-200/40 rounded-xl">
                        <i className="bi bi-arrow-left-right text-4xl text-main-400 mb-2" />
                        <h4 className="text-base font-semibold text-main-700">No transaction types found</h4>
                        <p className="text-xs text-main-500 mb-4">Try clearing your search query.</p>
                        <Button color="primary" size="sm" onClick={handleOpenAddType}>
                            <i className="bi bi-plus-lg mr-1" /> Add Type
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5">
                        {filteredTypes.map(typeItem => {
                            const isCashIn = typeItem.dc === "cr";

                            return (
                                <div
                                    key={typeItem.id}
                                    className="bg-main-200/70 rounded-xl border border-main-300 p-4 hover:border-primary/60 hover:shadow-sm transition-all flex flex-col justify-between group"
                                >
                                    <div>
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div className="flex items-center gap-2.5">
                                                <div
                                                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${typeItem.badge}`}
                                                >
                                                    <i className={`bi ${typeItem.icon} text-base`} />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-sm text-main-900">{typeItem.label}</h4>
                                                    <span className="text-[10px] text-main-400 font-mono">
                                                        {typeItem.code}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleOpenEditType(typeItem)}
                                                    className="p-1 rounded text-main-500 hover:text-primary hover:bg-main-300 transition-colors"
                                                    title="Edit Type"
                                                >
                                                    <i className="bi bi-pencil text-xs" />
                                                </button>
                                                {!typeItem.isSystem && (
                                                    <button
                                                        onClick={() => handleDeleteType(typeItem)}
                                                        className="p-1 rounded text-main-500 hover:text-danger-600 hover:bg-danger-50 transition-colors"
                                                        title="Delete Type"
                                                    >
                                                        <i className="bi bi-trash text-xs" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <p className="text-xs text-main-600 line-clamp-2 mt-1">
                                            {typeItem.description || "No description provided."}
                                        </p>
                                    </div>

                                    <div className="mt-3 pt-2.5 border-t border-main-300/60 flex items-center justify-between text-[11px]">
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                isCashIn
                                                    ? "bg-success-100 text-success-800"
                                                    : "bg-danger-100 text-danger-800"
                                            }`}
                                        >
                                            {isCashIn ? "Credit (Cash In)" : "Debit (Cash Out)"}
                                        </span>

                                        {typeItem.isSystem && (
                                            <span className="text-[10px] text-main-400 font-medium">Core System</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )
            )}

            {/* Category Add/Edit Modal */}
            <Modal open={categoryModalOpen} onClose={handleCloseCategoryModal} size="md" position="center" blur closeOnBackdrop closeOnEsc>
                <ModalHeader
                    title={editingCategory ? "Edit Category" : "Add Transaction Category"}
                    icon={editingCategory ? "bi-pencil-square" : "bi-tag"}
                    onClose={handleCloseCategoryModal}
                />

                <form onSubmit={handleSubmitCategory} className="flex flex-col flex-1 min-h-0">
                    <ModalBody>
                        <TextInput
                            label="Category Name"
                            labelBgColor="bg-main-100"
                            value={categoryForm.name}
                            onChange={e => setCategoryForm(p => ({ ...p, name: e.target.value }))}
                            placeholder="e.g. Food, Transport, Housing, Freelance"
                            required
                            color="primary"
                            size="md"
                        />

                        <TextInput
                            label="Examples & Description"
                            labelBgColor="bg-main-100"
                            value={categoryForm.description}
                            onChange={e => setCategoryForm(p => ({ ...p, description: e.target.value }))}
                            placeholder="e.g. Fuel, bus, taxi, parking fees"
                            helperText="Add examples so you can quickly search and remember what belongs here"
                            color="primary"
                            size="md"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-main mb-1">Icon</label>
                                <select
                                    value={categoryForm.icon}
                                    onChange={e => setCategoryForm(p => ({ ...p, icon: e.target.value }))}
                                    className="w-full border border-main-300 rounded-lg px-3 py-2 text-sm bg-main-100 text-main focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                                >
                                    {AVAILABLE_ICONS.map(ic => (
                                        <option key={ic.value} value={ic.value}>
                                            {ic.label} ({ic.value})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-main mb-1">Color Badge</label>
                                <select
                                    value={categoryForm.color}
                                    onChange={e => setCategoryForm(p => ({ ...p, color: e.target.value }))}
                                    className="w-full border border-main-300 rounded-lg px-3 py-2 text-sm bg-main-100 text-main focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                                >
                                    {AVAILABLE_COLORS.map(c => (
                                        <option key={c.value} value={c.value}>
                                            {c.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="p-3 bg-main-200/60 rounded-lg border border-main-300 mt-2 flex items-center gap-3">
                            <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                    categoryColorStyles[categoryForm.color]?.bg || "bg-primary/10 text-primary"
                                }`}
                            >
                                <i className={`bi ${categoryForm.icon || "bi-tag"} text-lg`} />
                            </div>
                            <div>
                                <h5 className="font-semibold text-sm text-main-900">{categoryForm.name || "Preview Name"}</h5>
                                <p className="text-xs text-main-500">{categoryForm.description || "Preview description"}</p>
                            </div>
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button color="neutral" variant="outline" size="sm" onClick={handleCloseCategoryModal}>
                            Cancel
                        </Button>
                        <Button color="primary" size="sm" type="submit">
                            {editingCategory ? "Save Changes" : "Create Category"}
                        </Button>
                    </ModalFooter>
                </form>
            </Modal>

            {/* Type Add/Edit Modal */}
            <Modal open={typeModalOpen} onClose={handleCloseTypeModal} size="md" position="center" blur closeOnBackdrop closeOnEsc>
                <ModalHeader
                    title={editingType ? "Edit Transaction Type" : "Add Custom Transaction Type"}
                    icon={editingType ? "bi-pencil-square" : "bi-arrow-left-right"}
                    onClose={handleCloseTypeModal}
                />

                <form onSubmit={handleSubmitType} className="flex flex-col flex-1 min-h-0">
                    <ModalBody>
                        <TextInput
                            label="Type Label"
                            labelBgColor="bg-main-100"
                            value={typeForm.label}
                            onChange={e => setTypeForm(p => ({ ...p, label: e.target.value }))}
                            placeholder="e.g. Investment, Grant, Dividend, Fine"
                            required
                            color="primary"
                            size="md"
                        />

                        {!editingType && (
                            <TextInput
                                label="Type Code / Slug"
                                labelBgColor="bg-main-100"
                                value={typeForm.code}
                                onChange={e => setTypeForm(p => ({ ...p, code: e.target.value }))}
                                placeholder="e.g. investment, grant"
                                helperText="Identifier used in internal records (letters, numbers, underscore)"
                                color="primary"
                                size="md"
                            />
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-main mb-1">Fund Flow (Debit / Credit)</label>
                                <select
                                    value={typeForm.dc}
                                    onChange={e => setTypeForm(p => ({ ...p, dc: e.target.value as "dr" | "cr" }))}
                                    className="w-full border border-main-300 rounded-lg px-3 py-2 text-sm bg-main-100 text-main focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                                >
                                    <option value="cr">Credit (Cash In / Money Received)</option>
                                    <option value="dr">Debit (Cash Out / Money Spent)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-main mb-1">Color Theme</label>
                                <select
                                    value={typeForm.color}
                                    onChange={e => setTypeForm(p => ({ ...p, color: e.target.value }))}
                                    className="w-full border border-main-300 rounded-lg px-3 py-2 text-sm bg-main-100 text-main focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                                >
                                    {AVAILABLE_COLORS.map(c => (
                                        <option key={c.value} value={c.value}>
                                            {c.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-main mb-1">Icon</label>
                            <select
                                value={typeForm.icon}
                                onChange={e => setTypeForm(p => ({ ...p, icon: e.target.value }))}
                                className="w-full border border-main-300 rounded-lg px-3 py-2 text-sm bg-main-100 text-main focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                            >
                                {AVAILABLE_ICONS.map(ic => (
                                    <option key={ic.value} value={ic.value}>
                                        {ic.label} ({ic.value})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <TextInput
                            label="Description"
                            labelBgColor="bg-main-100"
                            value={typeForm.description}
                            onChange={e => setTypeForm(p => ({ ...p, description: e.target.value }))}
                            placeholder="Explain what this transaction type represents"
                            color="primary"
                            size="md"
                        />
                    </ModalBody>

                    <ModalFooter>
                        <Button color="neutral" variant="outline" size="sm" onClick={handleCloseTypeModal}>
                            Cancel
                        </Button>
                        <Button color="primary" size="sm" type="submit">
                            {editingType ? "Save Changes" : "Create Type"}
                        </Button>
                    </ModalFooter>
                </form>
            </Modal>
        </div>
    );
}

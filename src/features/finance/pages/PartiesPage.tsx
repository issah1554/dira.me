import { useState, useMemo } from "react";
import { Button } from "../../../components/ui/Buttons";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../../../components/ui/Modal";
import { TextInput } from "../../../components/ui/TextInput";
import { Toast } from "../../../components/ui/Toast";
import Loader from "../../../components/ui/Loaders";
import { useParties } from "../hooks/useParties";
import { partyTypeIcons, partyTypeLabels, partyTypeColors } from "../services/partyService";
import type { Party, PartyType } from "../../../types/party";

const partyTypes: { value: PartyType; label: string }[] = [
    { value: "person", label: "Person / Individual" },
    { value: "company", label: "Company / Business" },
    { value: "employer", label: "Employer" },
    { value: "customer", label: "Customer / Client" },
    { value: "merchant", label: "Merchant / Vendor" },
    { value: "bank", label: "Bank / Financial Institution" },
    { value: "government", label: "Government / Tax Authority" },
    { value: "other", label: "Other" },
];

export default function PartiesPage() {
    const { parties, loading, error, createParty, updateParty, deleteParty } = useParties();

    const [open, setOpen] = useState(false);
    const [editingParty, setEditingParty] = useState<Party | null>(null);

    const [filterType, setFilterType] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");

    const [formData, setFormData] = useState({
        name: "",
        type: "person" as PartyType,
        phone: "",
        email: "",
        notes: "",
    });

    const handleOpenAdd = () => {
        setEditingParty(null);
        setFormData({
            name: "",
            type: "person",
            phone: "",
            email: "",
            notes: "",
        });
        setOpen(true);
    };

    const handleOpenEdit = (party: Party) => {
        setEditingParty(party);
        setFormData({
            name: party.name,
            type: party.type,
            phone: party.phone || "",
            email: party.email || "",
            notes: party.notes || "",
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingParty(null);
        setFormData({
            name: "",
            type: "person",
            phone: "",
            email: "",
            notes: "",
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            Toast.fire({ icon: "error", title: "Party name is required" });
            return;
        }

        try {
            if (editingParty) {
                await updateParty(editingParty.id, formData);
                Toast.fire({ icon: "success", title: "Party updated successfully" });
            } else {
                await createParty(formData);
                Toast.fire({ icon: "success", title: "Party added successfully" });
            }
            handleClose();
        } catch {
            Toast.fire({ icon: "error", title: "Operation failed" });
        }
    };

    const handleDelete = async (party: Party) => {
        if (window.confirm(`Are you sure you want to delete "${party.name}"?`)) {
            try {
                await deleteParty(party.id);
                Toast.fire({ icon: "success", title: "Party removed" });
            } catch {
                Toast.fire({ icon: "error", title: "Failed to delete party" });
            }
        }
    };

    const filteredParties = useMemo(() => {
        return parties.filter(p => {
            if (filterType && p.type !== filterType) return false;
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const matchName = p.name.toLowerCase().includes(q);
                const matchPhone = p.phone?.toLowerCase().includes(q);
                const matchEmail = p.email?.toLowerCase().includes(q);
                const matchNotes = p.notes?.toLowerCase().includes(q);
                if (!matchName && !matchPhone && !matchEmail && !matchNotes) return false;
            }
            return true;
        });
    }, [parties, filterType, searchQuery]);

    if (loading && parties.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-100">
                <Loader size={50} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-danger-600 bg-danger-50 rounded-lg">
                Error: {error}
                <Button onClick={() => window.location.reload()} className="mt-2" color="success" size="lg">
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="flex-1 text-main-700 space-y-6">
            {/* Page Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold text-main-900 flex items-center gap-2">
                        <i className="bi bi-people text-primary" />
                        Parties & Counterparties
                    </h3>
                    <p className="text-sm text-main-500">
                        Manage people, businesses, merchants, employers, and entities you transact with
                    </p>
                </div>

                <Button color="primary" size="sm" rounded="md" onClick={handleOpenAdd}>
                    <i className="bi bi-plus-lg mr-2" />
                    Add Party
                </Button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center gap-3 bg-main-200/50 p-3 rounded-lg border border-main-300">
                <div className="relative flex-1 min-w-[200px]">
                    <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-main-400 text-sm" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search by name, phone, email, notes..."
                        className="w-full pl-9 pr-3 py-1.5 text-sm bg-main-100 border border-main-300 rounded-md text-main focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <select
                    value={filterType}
                    onChange={e => setFilterType(e.target.value)}
                    className="border border-main-300 rounded-md px-3 py-1.5 text-sm bg-main-100 text-main focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                >
                    <option value="">All Party Types ({parties.length})</option>
                    {partyTypes.map(t => {
                        const count = parties.filter(p => p.type === t.value).length;
                        return (
                            <option key={t.value} value={t.value}>
                                {t.label} ({count})
                            </option>
                        );
                    })}
                </select>
            </div>

            {/* Parties Grid */}
            {filteredParties.length === 0 ? (
                <div className="text-center py-16 border border-main-300 bg-main-200/40 rounded-lg">
                    <i className="bi bi-person-x text-4xl text-main-400 mb-3" />
                    <h4 className="text-lg font-medium text-main-700 mb-1">
                        {parties.length === 0 ? "No counterparties created yet" : "No matching parties found"}
                    </h4>
                    <p className="text-sm text-main-500 mb-4">
                        {parties.length === 0
                            ? "Add people, companies, merchants, employers, or institutions you send money to or receive money from."
                            : "Try clearing search filters."}
                    </p>
                    {parties.length === 0 && (
                        <Button color="primary" size="md" onClick={handleOpenAdd}>
                            <i className="bi bi-plus-lg mr-2" /> Add Your First Party
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredParties.map(party => {
                        const colors = partyTypeColors[party.type] || partyTypeColors.other;
                        const icon = partyTypeIcons[party.type] || "bi-person";
                        const label = partyTypeLabels[party.type] || party.type;

                        return (
                            <div
                                key={party.id}
                                className="bg-main-200/60 rounded-lg border border-main-300 p-5 hover:ring-primary/60 hover:ring-2 transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
                                                <i className={`bi ${icon} ${colors.text} text-lg`} />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-main-900">{party.name}</h4>
                                                <span className={`inline-block text-[11px] px-2 py-0.5 rounded-full font-medium mt-0.5 ${colors.badge}`}>
                                                    {label}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Details */}
                                    <div className="space-y-1.5 text-xs text-main-600 mt-3 pt-3 border-t border-main-300/70">
                                        {party.phone ? (
                                            <div className="flex items-center gap-2">
                                                <i className="bi bi-telephone text-main-400" />
                                                <a href={`tel:${party.phone}`} className="hover:text-primary transition-colors">
                                                    {party.phone}
                                                </a>
                                            </div>
                                        ) : null}

                                        {party.email ? (
                                            <div className="flex items-center gap-2">
                                                <i className="bi bi-envelope text-main-400" />
                                                <a href={`mailto:${party.email}`} className="hover:text-primary transition-colors truncate">
                                                    {party.email}
                                                </a>
                                            </div>
                                        ) : null}

                                        {party.notes ? (
                                            <div className="flex items-start gap-2 pt-1 text-main-500 italic">
                                                <i className="bi bi-sticky text-main-400 mt-0.5" />
                                                <span className="line-clamp-2">{party.notes}</span>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>

                                {/* Card Actions */}
                                <div className="flex gap-2 mt-4 pt-3 border-t border-main-300">
                                    <Button
                                        color="neutral"
                                        size="xs"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => handleOpenEdit(party)}
                                    >
                                        <i className="bi bi-pencil mr-1" /> Edit
                                    </Button>
                                    <Button
                                        color="neutral"
                                        size="xs"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => handleDelete(party)}
                                    >
                                        <i className="bi bi-trash mr-1" /> Delete
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add / Edit Party Modal */}
            <Modal open={open} onClose={handleClose} size="md" position="center" blur closeOnBackdrop closeOnEsc>
                <ModalHeader
                    title={editingParty ? "Edit Party" : "Add New Counterparty"}
                    icon={editingParty ? "bi-pencil-square" : "bi-person-plus"}
                    onClose={handleClose}
                />

                <form className="flex flex-col flex-1 min-h-0" onSubmit={handleSubmit}>
                    <ModalBody>
                        <TextInput
                            label="Party / Entity Name"
                            labelBgColor="bg-main-100"
                            color="primary"
                            size="md"
                            rounded="md"
                            value={formData.name}
                            onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                            required
                            placeholder="e.g., John Doe, Apple, Electricity Co, Bank"
                        />

                        <div>
                            <label className="block text-sm font-medium text-main mb-1">
                                Party Type <span className="text-danger-500">*</span>
                            </label>
                            <select
                                className="w-full px-3 py-2 border border-main-300 rounded-md bg-main-100 text-main focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer text-sm"
                                value={formData.type}
                                onChange={e => setFormData(p => ({ ...p, type: e.target.value as PartyType }))}
                                required
                            >
                                {partyTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <TextInput
                                label="Phone Number"
                                labelBgColor="bg-main-100"
                                color="primary"
                                size="md"
                                rounded="md"
                                type="tel"
                                value={formData.phone}
                                onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                                placeholder="+255 700 000 000"
                            />

                            <TextInput
                                label="Email Address"
                                labelBgColor="bg-main-100"
                                color="primary"
                                size="md"
                                rounded="md"
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                                placeholder="name@domain.com"
                            />
                        </div>

                        <TextInput
                            label="Notes / Remarks"
                            labelBgColor="bg-main-100"
                            color="primary"
                            size="md"
                            rounded="md"
                            value={formData.notes}
                            onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                            placeholder="Account number, address, or relationship notes"
                        />
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            type="button"
                            color="neutral"
                            size="sm"
                            variant="outline"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            color="primary"
                            size="sm"
                        >
                            <i className="bi bi-check-lg mr-1.5" />
                            {editingParty ? "Save Changes" : "Create Party"}
                        </Button>
                    </ModalFooter>
                </form>
            </Modal>
        </div>
    );
}

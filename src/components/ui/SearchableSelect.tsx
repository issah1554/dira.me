// src/components/ui/SearchableSelect.tsx
import React, { useState, useRef, useEffect, useMemo } from "react";

export interface SearchableOption {
    value: string;
    label: string;
    subtext?: string;
    icon?: string;
    badge?: string;
    badgeClass?: string;
    color?: string;
    group?: string;
}

export interface SearchableSelectProps {
    label?: string;
    labelBgColor?: string;
    placeholder?: string;
    value: string | null;
    onChange: (value: string | null, option?: SearchableOption | null) => void;
    options: SearchableOption[];
    allowCustom?: boolean;
    onAddNew?: () => void;
    addNewText?: string;
    disabled?: boolean;
    required?: boolean;
    clearable?: boolean;
    error?: string;
    helperText?: string;
    size?: "sm" | "md" | "lg";
    className?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
    label,
    placeholder = "Select or search...",
    value,
    onChange,
    options,
    allowCustom = false,
    onAddNew,
    addNewText,
    disabled = false,
    required = false,
    clearable = true,
    error,
    helperText,
    size = "md",
    className = "",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listboxRef = useRef<HTMLUListElement>(null);

    const selectedOption = useMemo(() => {
        if (!value) return null;
        return options.find(o => o.value === value) || { value, label: value };
    }, [value, options]);

    // Filter options by search query
    const filteredOptions = useMemo(() => {
        if (!searchQuery.trim()) return options;
        const q = searchQuery.toLowerCase();
        return options.filter(
            o =>
                o.label.toLowerCase().includes(q) ||
                (o.subtext && o.subtext.toLowerCase().includes(q)) ||
                (o.badge && o.badge.toLowerCase().includes(q))
        );
    }, [options, searchQuery]);

    // Handle outside click to close
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setSearchQuery("");
                setHighlightedIndex(-1);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Scroll highlighted item into view
    useEffect(() => {
        if (highlightedIndex >= 0 && listboxRef.current) {
            const item = listboxRef.current.children[highlightedIndex] as HTMLElement;
            if (item) {
                item.scrollIntoView({ block: "nearest" });
            }
        }
    }, [highlightedIndex]);

    const handleSelectOption = (opt: SearchableOption) => {
        onChange(opt.value, opt);
        setIsOpen(false);
        setSearchQuery("");
        setHighlightedIndex(-1);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(null, null);
        setSearchQuery("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (disabled) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            if (!isOpen) {
                setIsOpen(true);
            } else {
                setHighlightedIndex(prev => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
            }
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (isOpen) {
                setHighlightedIndex(prev => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
            }
        } else if (e.key === "Enter") {
            if (isOpen) {
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
                    handleSelectOption(filteredOptions[highlightedIndex]);
                } else if (allowCustom && searchQuery.trim()) {
                    onChange(searchQuery.trim(), { value: searchQuery.trim(), label: searchQuery.trim() });
                    setIsOpen(false);
                    setSearchQuery("");
                }
            } else {
                setIsOpen(true);
            }
        } else if (e.key === "Escape") {
            setIsOpen(false);
            setSearchQuery("");
        }
    };

    const sizeClasses = {
        sm: "py-1.5 px-2.5 text-xs min-h-[34px]",
        md: "py-2 px-3 text-sm min-h-[40px]",
        lg: "py-2.5 px-3.5 text-base min-h-[46px]",
    }[size];

    return (
        <div ref={containerRef} className={`relative w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-main mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            {/* Display / Trigger Field */}
            <div
                tabIndex={disabled ? -1 : 0}
                role="combobox"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                onClick={() => {
                    if (!disabled) setIsOpen(prev => !prev);
                }}
                onKeyDown={handleKeyDown}
                className={`
                    w-full flex items-center justify-between gap-2 rounded-lg border bg-main-100 text-main transition-all cursor-pointer select-none
                    ${sizeClasses}
                    ${error ? "border-red-500 ring-1 ring-red-500" : isOpen ? "border-primary ring-2 ring-primary/30" : "border-main-300 hover:border-main-400"}
                    ${disabled ? "opacity-60 cursor-not-allowed bg-main-200" : ""}
                `}
            >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    {selectedOption ? (
                        <div className="flex items-center gap-2 truncate flex-1 min-w-0">
                            {selectedOption.icon && (
                                <i className={`bi ${selectedOption.icon} text-main-500 text-base shrink-0`} />
                            )}
                            <span className="font-medium text-main-800 truncate text-sm">
                                {selectedOption.label}
                            </span>
                            {selectedOption.badge && (
                                <span
                                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                                        selectedOption.badgeClass || "bg-main-300 text-main-700"
                                    }`}
                                >
                                    {selectedOption.badge}
                                </span>
                            )}
                        </div>
                    ) : (
                        <span className="text-main-400 text-sm truncate">{placeholder}</span>
                    )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                    {clearable && selectedOption && !disabled && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="text-main-400 hover:text-red-500 p-0.5 rounded transition-colors"
                            aria-label="Clear selection"
                        >
                            <i className="bi bi-x text-base" />
                        </button>
                    )}
                    <i className={`bi bi-chevron-down text-xs text-main-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </div>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 mt-1 w-full rounded-lg border border-main-300 bg-main-100 dark:bg-main-200 shadow-xl overflow-hidden animate-fade-in flex flex-col max-h-72">
                    {/* Search Input */}
                    <div className="p-2 border-b border-main-300 bg-main-200/50 flex items-center gap-2">
                        <i className="bi bi-search text-main-400 text-xs ml-1" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchQuery}
                            onChange={e => {
                                setSearchQuery(e.target.value);
                                setHighlightedIndex(0);
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="Type to search..."
                            className="w-full bg-transparent text-sm text-main placeholder:text-main-400 focus:outline-none"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="text-main-400 hover:text-main-700 p-1 text-xs"
                            >
                                <i className="bi bi-x" />
                            </button>
                        )}
                    </div>

                    {/* Options List */}
                    <ul
                        ref={listboxRef}
                        role="listbox"
                        className="overflow-y-auto flex-1 divide-y divide-main-300/40 p-1"
                    >
                        {filteredOptions.length === 0 ? (
                            <li className="p-3 text-center text-xs text-main-500 italic">
                                No matching options found
                                {allowCustom && searchQuery.trim() && (
                                    <div className="mt-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onChange(searchQuery.trim(), { value: searchQuery.trim(), label: searchQuery.trim() });
                                                setIsOpen(false);
                                                setSearchQuery("");
                                            }}
                                            className="px-2.5 py-1 bg-primary text-white text-xs rounded hover:bg-primary/90 font-medium cursor-pointer"
                                        >
                                            Use &quot;{searchQuery}&quot;
                                        </button>
                                    </div>
                                )}
                            </li>
                        ) : (
                            filteredOptions.map((opt, index) => {
                                const isSelected = opt.value === value;
                                const isHighlighted = index === highlightedIndex;

                                return (
                                    <li
                                        key={opt.value}
                                        role="option"
                                        aria-selected={isSelected}
                                        onClick={() => handleSelectOption(opt)}
                                        onMouseEnter={() => setHighlightedIndex(index)}
                                        className={`
                                            flex items-center justify-between gap-2 px-3 py-2 rounded-md text-xs cursor-pointer transition-colors
                                            ${isSelected ? "bg-primary/15 text-primary font-semibold" : isHighlighted ? "bg-main-200 text-main-900" : "text-main-700 hover:bg-main-200"}
                                        `}
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                            {opt.icon && (
                                                <div className="w-6 h-6 rounded flex items-center justify-center bg-main-300/60 shrink-0">
                                                    <i className={`bi ${opt.icon} text-xs text-main-600`} />
                                                </div>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="truncate text-sm font-medium">{opt.label}</span>
                                                    {opt.badge && (
                                                        <span
                                                            className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                                                                opt.badgeClass || "bg-main-300 text-main-700"
                                                            }`}
                                                        >
                                                            {opt.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                {opt.subtext && (
                                                    <p className="text-[11px] text-main-500 truncate mt-0.5">
                                                        {opt.subtext}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {isSelected && (
                                            <i className="bi bi-check-lg text-primary text-sm shrink-0" />
                                        )}
                                    </li>
                                );
                            })
                        )}
                    </ul>

                    {/* Footer Action (e.g. Add New) */}
                    {onAddNew && (
                        <div className="p-2 border-t border-main-300 bg-main-200/60">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsOpen(false);
                                    onAddNew();
                                }}
                                className="w-full flex items-center justify-center gap-1.5 py-1 px-2.5 rounded text-xs font-medium text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                            >
                                <i className="bi bi-plus-circle" />
                                {addNewText || "Add New"}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            {helperText && !error && <p className="text-xs text-main-500 mt-1">{helperText}</p>}
        </div>
    );
};

export default SearchableSelect;

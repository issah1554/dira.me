import React, { useId, useRef, useState } from "react";

export interface TimePickerProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "onChange"> {
    label?: string;
    labelBgColor?: string;
    helperText?: string;
    color?: "primary" | "secondary" | "accent" | "neutral" | "success" | "warning" | "error" | "info" | "light" | "dark";
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
    rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
    required?: boolean;
    showNowButton?: boolean;
}

export function TimePicker({
    label,
    labelBgColor,
    helperText,
    color = "primary",
    size = "md",
    rounded = "sm",
    value = "",
    onChange,
    disabled = false,
    required = false,
    showNowButton = false,
    id,
    name,
    className = "",
    ...rest
}: TimePickerProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const inputRef = useRef<HTMLInputElement>(null);

    const [isFocused, setIsFocused] = useState(false);
    const [touched, setTouched] = useState(false);
    const [invalid, setInvalid] = useState(false);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        setTouched(true);
        setInvalid(!e.currentTarget.validity.valid);
    };

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        onChange?.(e.target.value);
        if (touched) {
            setInvalid(!e.currentTarget.validity.valid);
        }
    };

    const handleOpenPicker = () => {
        if (disabled) return;
        if (inputRef.current) {
            if (typeof inputRef.current.showPicker === "function") {
                inputRef.current.showPicker();
            } else {
                inputRef.current.focus();
            }
        }
    };

    const handleSetNow = (e: React.MouseEvent) => {
        e.stopPropagation();
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        onChange?.(`${hours}:${minutes}`);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange?.("");
    };

    const effectiveColor = invalid ? "error" : color;

    const roundedClasses = {
        none: { input: "rounded-none", label: "rounded-none" },
        sm: { input: "rounded", label: "rounded-sm" },
        md: { input: "rounded-md", label: "rounded-md" },
        lg: { input: "rounded-lg", label: "rounded-lg" },
        xl: { input: "rounded-xl", label: "rounded-xl" },
        full: { input: "rounded-full", label: "rounded-full" },
    };

    const sizes = {
        xs: "text-xs px-2 py-1.5",
        sm: "text-sm px-3 py-2",
        md: "text-base px-4 py-2.5",
        lg: "text-lg px-5 py-3",
        xl: "text-xl px-6 py-3.5",
        "2xl": "text-2xl px-7 py-4",
    };

    const colorClasses = {
        primary: {
            input: "bg-transparent border border-primary text-main placeholder-primary/60 focus:ring-primary",
            label: labelBgColor ?? "bg-main-0",
            text: "text-primary",
            icon: "text-primary",
        },
        secondary: {
            input: "bg-transparent border border-secondary text-main placeholder-secondary/60 focus:ring-secondary",
            label: labelBgColor ?? "bg-main-0",
            text: "text-secondary",
            icon: "text-secondary",
        },
        accent: {
            input: "bg-transparent border border-accent text-main placeholder-accent/60 focus:ring-accent",
            label: labelBgColor ?? "bg-main-0",
            text: "text-accent",
            icon: "text-accent",
        },
        neutral: {
            input: "bg-transparent border border-main text-main placeholder-main/60 focus:ring-main",
            label: labelBgColor ?? "bg-main-0",
            text: "text-main",
            icon: "text-main-500",
        },
        success: {
            input: "bg-transparent border border-success text-main placeholder-success/60 focus:ring-success",
            label: labelBgColor ?? "bg-main-0",
            text: "text-success",
            icon: "text-success",
        },
        warning: {
            input: "bg-transparent border border-warning text-main placeholder-warning/60 focus:ring-warning",
            label: labelBgColor ?? "bg-main-0",
            text: "text-warning",
            icon: "text-warning",
        },
        error: {
            input: "bg-transparent border border-danger text-main placeholder-danger/60 focus:ring-danger",
            label: labelBgColor ?? "bg-main-0",
            text: "text-danger",
            icon: "text-danger",
        },
        info: {
            input: "bg-transparent border border-info text-main placeholder-info/60 focus:ring-info",
            label: labelBgColor ?? "bg-main-0",
            text: "text-info",
            icon: "text-info",
        },
        light: {
            input: "bg-transparent border border-main-200 text-main placeholder-main-400 focus:ring-main-300",
            label: labelBgColor ?? "bg-main-0",
            text: "text-main-700",
            icon: "text-main-500",
        },
        dark: {
            input: "bg-transparent border border-main-800 text-main placeholder-main-500 focus:ring-main-700",
            label: labelBgColor ?? "bg-main-0",
            text: "text-main-900",
            icon: "text-main-700",
        },
    };

    const inputClasses = colorClasses[effectiveColor].input;
    const labelBgClass = colorClasses[effectiveColor].label;
    const textClasses = colorClasses[effectiveColor].text;
    const iconClass = colorClasses[effectiveColor].icon;

    const shouldShowLabelBg = isFocused || !!value || true;
    const labelClasses = shouldShowLabelBg
        ? `${labelBgClass} ${roundedClasses[rounded].label}`
        : "bg-transparent";

    return (
        <div className={`flex flex-col gap-1 items-start text-left w-full my-3 ${className}`}>
            <div className="relative w-full flex items-center">
                <input
                    {...rest}
                    ref={inputRef}
                    id={inputId}
                    name={name}
                    type="time"
                    required={required}
                    value={value}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={disabled}
                    aria-invalid={invalid}
                    aria-describedby={helperText ? `${inputId}-help` : undefined}
                    className={`peer font-sans shadow-none focus:outline-none focus:ring-2 transition disabled:opacity-60 disabled:cursor-not-allowed ${roundedClasses[rounded].input} ${sizes[size]} ${inputClasses} w-full pr-10 cursor-pointer`}
                />

                {/* Trailing Controls (Clock icon, Clear button) */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    {value && !disabled && (
                        <button
                            type="button"
                            onClick={handleClear}
                            title="Clear time"
                            className="text-main-400 hover:text-main-700 transition-colors p-0.5"
                        >
                            <i className="bi bi-x-circle-fill text-xs" />
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={handleOpenPicker}
                        disabled={disabled}
                        title="Pick time"
                        className={`${iconClass} hover:opacity-80 transition-opacity p-0.5 cursor-pointer`}
                    >
                        <i className="bi bi-clock text-sm" />
                    </button>
                </div>

                {label && (
                    <label
                        htmlFor={inputId}
                        className={`
                            absolute left-3 px-1
                            pointer-events-none
                            transition-all duration-200
                            origin-left
                            -translate-y-1/2 scale-75 top-0 z-10
                            ${labelClasses}
                            ${textClasses}
                        `}
                    >
                        {label}
                        {required && (
                            <span className="ml-0.5 text-danger">*</span>
                        )}
                    </label>
                )}
            </div>

            <div className="flex items-center justify-between w-full px-1">
                {helperText && (
                    <p
                        id={`${inputId}-help`}
                        className={`text-xs ml-1 ${textClasses}`}
                    >
                        {helperText}
                    </p>
                )}
                {showNowButton && !disabled && (
                    <button
                        type="button"
                        onClick={handleSetNow}
                        className="text-xs text-primary hover:underline ml-auto font-medium cursor-pointer"
                    >
                        Set to Now
                    </button>
                )}
            </div>
        </div>
    );
}

export default TimePicker;

import React from "react";

interface TextInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "pattern" | "required"> {
    label?: string;
    labelBgColor?: string;
    helperText?: string;
    color: "primary" | "secondary" | "accent" | "neutral" | "success" | "warning" | "error" | "info" | "light" | "dark";
    size: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
    rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
    type?: React.HTMLInputTypeAttribute;
    placeholder?: string;
    value?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    disabled?: boolean;
    id?: string;
    name?: string;
    pattern?: string;
    required?: boolean;
}

export function TextInput({
    label,
    labelBgColor,
    helperText,
    color,
    size,
    rounded = "sm",
    type = "text",
    placeholder,
    value,
    onChange,
    disabled = false,
    id,
    name,
    pattern,
    required,
    ...rest
}: TextInputProps) {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    const [touched, setTouched] = React.useState(false);
    const [invalid, setInvalid] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        setTouched(true);

        const value = e.currentTarget.value;
        const emailRegex = pattern
            ? new RegExp(pattern)
            : /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

        if (type === "email") {
            setInvalid(!emailRegex.test(value));
            return;
        }

        if (type === "password") {
            setInvalid(value.length < 8);
            return;
        }

        setInvalid(!e.currentTarget.validity.valid);
    };

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        onChange?.(e);
        if (touched) {
            setInvalid(!e.currentTarget.validity.valid);
        }
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

    const baseClasses =
        "peer font-sans shadow-none focus:outline-none focus:ring-2 transition disabled:opacity-60 disabled:cursor-not-allowed";

    const colorClasses = {
        primary: {
            input: "bg-transparent border border-primary text-primary placeholder-primary/60 focus:ring-primary",
            label: `${labelBgColor ?? "bg-white"} dark:bg-gray-900`,
            text: "text-primary"
        },
        secondary: {
            input: "bg-transparent border border-secondary text-secondary placeholder-secondary/60 focus:ring-secondary",
            label: `${labelBgColor ?? "bg-white"} dark:bg-gray-900`,
            text: "text-secondary"
        },
        accent: {
            input: "bg-transparent border border-accent text-accent placeholder-accent/60 focus:ring-accent",
            label: `${labelBgColor ?? "bg-white"} dark:bg-gray-900`,
            text: "text-accent"
        },
        neutral: {
            input: "bg-transparent border border-main text-main placeholder-main/60 focus:ring-main",
            label: `${labelBgColor ?? "bg-white"} dark:bg-gray-900`,
            text: "text-main"
        },
        success: {
            input: "bg-transparent border border-success text-success placeholder-success/60 focus:ring-success",
            label: `${labelBgColor ?? "bg-white"} dark:bg-gray-900`,
            text: "text-success"
        },
        warning: {
            input: "bg-transparent border border-warning text-warning placeholder-warning/60 focus:ring-warning",
            label: `${labelBgColor ?? "bg-white"} dark:bg-gray-900`,
            text: "text-warning"
        },
        error: {
            input: "bg-transparent border border-danger text-danger placeholder-danger/60 focus:ring-danger",
            label: `${labelBgColor ?? "bg-white"} dark:bg-gray-900`,
            text: "text-danger"
        },
        info: {
            input: "bg-transparent border border-info text-info placeholder-info/60 focus:ring-info",
            label: `${labelBgColor ?? "bg-white"} dark:bg-gray-900`,
            text: "text-info"
        },
        light: {
            input: "bg-transparent border border-light text-light placeholder-light/60 focus:ring-light",
            label: `${labelBgColor ?? "bg-white"} dark:bg-gray-900`,
            text: "text-light"
        },
        dark: {
            input: "bg-transparent border border-dark text-dark placeholder-dark/60 focus:ring-dark",
            label: `${labelBgColor ?? "bg-white"} dark:bg-gray-900`,
            text: "text-dark"
        },
    };

    const inputClasses = colorClasses[effectiveColor].input;
    const labelBgClass = colorClasses[effectiveColor].label;
    const textClasses = colorClasses[effectiveColor].text;

    const isDateType = type === "date" || type === "datetime-local" || type === "time" || type === "month";
    // Always show background when floating
    const shouldShowLabelBg = isFocused || !!value || isDateType;
    const labelClasses = shouldShowLabelBg ? `${labelBgClass} ${roundedClasses[rounded].label}` : "bg-transparent";


    return (
        <div className="flex flex-col gap-1 items-start text-left w-full my-3">
            <div className="relative w-full">
                <input
                    {...rest}
                    id={inputId}
                    name={name}
                    type={type}
                    pattern={pattern}
                    required={required}
                    placeholder={label ? (isFocused ? placeholder : "") : placeholder} value={value}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={disabled}
                    aria-invalid={invalid}
                    aria-describedby={helperText ? `${inputId}-help` : undefined}
                    className={`${baseClasses} ${roundedClasses[rounded].input} ${sizes[size]} ${inputClasses} w-full `}
                />

                {label && (
                    <label
                        htmlFor={inputId}
                        className={`
                            absolute left-3 px-1
                            pointer-events-none
                            transition-all duration-200
                            origin-left
                            ${shouldShowLabelBg
                                ? "-translate-y-1/2 scale-75 top-0 z-10"
                                : "top-1/2 -translate-y-1/2 scale-100"}
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

            {helperText && (
                <p
                    id={`${inputId}-help`}
                    className={`text-xs ml-2 ${textClasses}`}
                >
                    {helperText}
                </p>
            )}
        </div>
    );
}
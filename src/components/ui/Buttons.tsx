import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    color: "primary" | "secondary" | "accent" | "neutral" | "success" | "warning" | "error" | "info" | "light" | "dark";
    size: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
    variant?: "solid" | "outline" | "text";
    rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
}

export function Button({
    color,
    size,
    variant = "solid",
    rounded = "sm",
    className = "",
    children,
    type,
    ...props
}: ButtonProps) {
    const roundedClasses = {
        none: "rounded-none",
        sm: "rounded",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
    };

    const baseClasses =
        "font-sans font-medium  inline-flex items-center justify-center gap-2 focus:outline-none  transition disabled:opacity-50 disabled:cursor-not-allowed";

    const sizes = {
        xs: "text-xs px-2 py-1",
        sm: "text-sm px-3 py-1.5",
        md: "text-base px-4 py-2",
        lg: "text-lg px-5 py-2.5",
        xl: "text-xl px-6 py-3",
        "2xl": "text-2xl px-7 py-3.5",
    };

    const colorClasses = {
        primary: {
            solid: "bg-primary text-main-0 hover:bg-primary/90 focus:ring-primary",
            outline: "border border-primary text-primary bg-transparent hover:bg-primary/10 focus:ring-primary",
            text: "text-primary bg-transparent hover:bg-primary/10 focus:ring-primary",
        },
        secondary: {
            solid: "bg-secondary text-main-0 hover:bg-secondary/90 focus:ring-secondary",
            outline: "border border-secondary text-secondary bg-transparent hover:bg-secondary/10 focus:ring-secondary",
            text: "text-secondary bg-transparent hover:bg-secondary/10 focus:ring-secondary",
        },
        accent: {
            solid: "bg-accent text-main-0 hover:bg-accent/90 focus:ring-accent",
            outline: "border border-accent text-accent bg-transparent hover:bg-accent/10 focus:ring-accent",
            text: "text-accent bg-transparent hover:bg-accent/10 focus:ring-accent",
        },
        neutral: {
            solid: "bg-main text-main-0 hover:bg-main/90 focus:ring-main",
            outline: "border border-main text-main bg-transparent hover:bg-main/10 focus:ring-main",
            text: "text-main bg-transparent hover:bg-main/10 focus:ring-main",
        },
        success: {
            solid: "bg-success text-main-0 hover:bg-success/90 focus:ring-success",
            outline: "border border-success text-success bg-transparent hover:bg-success/10 focus:ring-success",
            text: "text-success bg-transparent hover:bg-success/10 focus:ring-success",
        },
        warning: {
            solid: "bg-warning text-main-0 hover:bg-warning/90 focus:ring-warning",
            outline: "border border-warning text-warning bg-transparent hover:bg-warning/10 focus:ring-warning",
            text: "text-warning bg-transparent hover:bg-warning/10 focus:ring-warning",
        },
        error: {
            solid: "bg-danger text-main-0 hover:bg-danger/90 focus:ring-danger",
            outline: "border border-danger text-danger bg-transparent hover:bg-danger/10 focus:ring-danger",
            text: "text-danger bg-transparent hover:bg-danger/10 focus:ring-danger",
        },
        info: {
            solid: "bg-info text-main-0 hover:bg-info/90 focus:ring-info",
            outline: "border border-info text-info bg-transparent hover:bg-info/10 focus:ring-info",
            text: "text-info bg-transparent hover:bg-info/10 focus:ring-info",
        },
        light: {
            solid: "bg-main-100 text-main-900 hover:bg-main-200 focus:ring-main-300",
            outline: "border border-main-200 text-main-800 bg-transparent hover:bg-main-100 focus:ring-main-300",
            text: "text-main-800 bg-transparent hover:bg-main-100 focus:ring-main-300",
        },
        dark: {
            solid: "bg-main-900 text-main-50 hover:bg-main-800 focus:ring-main-700",
            outline: "border border-main-800 text-main-900 bg-transparent hover:bg-main-800/10 focus:ring-main-700",
            text: "text-main-900 bg-transparent hover:bg-main-800/10 focus:ring-main-700",
        },
    };

    const classes = [
        baseClasses,
        roundedClasses[rounded],
        sizes[size],
        colorClasses[color][variant],
        className,
    ].join(" ");

    return (
        <button
            {...props}
            type={type ?? "button"}
            className={classes}
        >
            {children}
        </button>
    );
}

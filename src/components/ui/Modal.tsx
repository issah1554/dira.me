import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

/* =======================
   Types
======================= */

export type ModalPosition =
  | "center"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;

  size?: "sm" | "md" | "lg" | "xl" | "full";
  position?: ModalPosition;

  blur?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;

  className?: string; // modal panel
  backdropClassName?: string;
};

export type ModalHeaderProps = {
  title?: ReactNode;
  icon?: string;
  onClose?: () => void;
  children?: ReactNode;
  className?: string;
};

export type ModalBodyProps = {
  children: ReactNode;
  className?: string;
};

export type ModalFooterProps = {
  children: ReactNode;
  className?: string;
};

/* =======================
   Config
======================= */

const sizeClasses: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "w-full h-full max-w-none",
};

const positionClasses: Record<ModalPosition, string> = {
  center: "items-center justify-center p-4 sm:p-6",
  top: "items-start justify-center p-4 sm:p-6",
  bottom: "items-end justify-center p-4 sm:p-6",
  left: "items-center justify-start p-4 sm:p-6",
  right: "items-center justify-end p-4 sm:p-6",
  "top-left": "items-start justify-start p-4 sm:p-6",
  "top-right": "items-start justify-end p-4 sm:p-6",
  "bottom-left": "items-end justify-start p-4 sm:p-6",
  "bottom-right": "items-end justify-end p-4 sm:p-6",
};

/* =======================
   Subcomponents
======================= */

export function ModalHeader({
  title,
  icon,
  onClose,
  children,
  className = "",
}: ModalHeaderProps) {
  return (
    <div
      className={`flex items-center justify-between px-6 py-4 border-b border-main-300 shrink-0 text-main-800 dark:text-main-100 ${className}`}
    >
      {children || (
        <>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {icon && <i className={`bi ${icon}`} />}
            {title}
          </h3>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-main-500 hover:text-main-800 dark:hover:text-main-200 transition-colors rounded-md cursor-pointer"
              aria-label="Close modal"
            >
              <i className="bi bi-x-lg text-sm" />
            </button>
          )}
        </>
      )}
    </div>
  );
}

export function ModalBody({ children, className = "" }: ModalBodyProps) {
  return (
    <div className={`p-6 flex-1 overflow-y-auto min-h-0 space-y-4 ${className}`}>
      {children}
    </div>
  );
}

export function ModalFooter({ children, className = "" }: ModalFooterProps) {
  return (
    <div
      className={`flex items-center justify-end gap-3 px-6 py-4 border-t border-main-300 shrink-0 bg-main-100/90  backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}

/* =======================
   Main Modal Component
======================= */

export function Modal({
  open,
  onClose,
  children,
  size = "md",
  position = "center",
  blur = true,
  closeOnBackdrop = true,
  closeOnEsc = true,
  className = "",
  backdropClassName = "",
}: ModalProps) {
  /* ESC handling */
  useEffect(() => {
    if (!open || !closeOnEsc) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, closeOnEsc, onClose]);

  /* Scroll lock */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex ${positionClasses[position]}`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 ${
          blur ? "backdrop-blur-sm" : ""
        } ${backdropClassName}`}
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      {/* Panel with viewport containment and vertical flex */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-10 w-full max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)] flex flex-col rounded-xl bg-main-100 dark:bg-gray-900 shadow-2xl border border-main-300 dark:border-gray-800 overflow-hidden ${sizeClasses[size]} ${className}`}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

export default Modal;

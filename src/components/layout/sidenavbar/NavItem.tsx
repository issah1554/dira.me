import { useState, useEffect, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSideNavCollapsed } from "./SideNavBarLayout";
import { useSidebar } from "../../../contexts/SidebarContext";

export type NavItemProps = {
    label: string;
    icon?: ReactNode;
    to?: string;
    subItems?: NavItemProps[];
    badge?: number;
    depth?: number;
    className?: string;
    onClick?: () => void;
};

export function NavItem({
    label,
    icon,
    to,
    subItems,
    badge,
    depth = 0,
    className = "",
    onClick,
}: NavItemProps) {
    const isCollapsed = useSideNavCollapsed();
    const { closeMobileSidebar } = useSidebar();
    const isSubItem = depth > 0;
    const location = useLocation();
    const hasSubItems = !!subItems?.length;
    const [isOpen, setIsOpen] = useState(false);

    const isActive = to && location.pathname === to;
    const isChildActive =
        hasSubItems && subItems!.some(i => i.to === location.pathname);

    useEffect(() => {
        if (isChildActive) setIsOpen(true);
    }, [isChildActive]);

    // Close submenus when collapsed
    useEffect(() => {
        if (isCollapsed) setIsOpen(false);
    }, [isCollapsed]);

    const handleClick = () => {
        if (hasSubItems && !isCollapsed) {
            setIsOpen(v => !v);
        }
        if (onClick) {
            onClick();
        }
        if (to && !hasSubItems) {
            closeMobileSidebar();
        }
    };

    const paddingLeft = isCollapsed ? 0 : 12 + depth * 20;

    const content = (
        <div
            className={`relative flex items-center px-1 py-2 text-sm cursor-pointer text-main-600 hover:text-primary ${className}
                ${isActive || isChildActive ? "text-primary bg-main-300" : ""} ${isOpen && hasSubItems ? "bg-main-300" : ""}
                hover:bg-main-300
                ${isCollapsed ? 'justify-center' : 'justify-between'}
            `}
            style={{ paddingLeft }}
            onClick={handleClick}
            title={isCollapsed ? label : undefined}
        >
            {/* Highlight bar */}
            {(isOpen && hasSubItems) && !isCollapsed && (
                <span
                    className="absolute top-0 bottom-0 left-px w-px bg-primary"
                />
            )}

            {(isActive || isChildActive) && (
                <span
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
                />
            )}

            <div className={`flex items-center gap-2 relative z-10 ${isCollapsed ? '' : 'truncate'}`}>
                {icon && <span className={isCollapsed ? 'text-lg' : ''}>{icon}</span>}
                {!isCollapsed && <span className="truncate">{label}</span>}
            </div>

            {!isCollapsed && badge && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-main-300 z-10 text-primary">
                    {badge}
                </span>
            )}

            {/* Badge indicator when collapsed */}
            {isCollapsed && badge && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary"></span>
            )}

            {!isCollapsed && hasSubItems && (
                <span className="text-xs float-end">
                    {isOpen ? <i className="bi bi-chevron-up" /> : <i className="bi bi-chevron-right" />}
                </span>
            )}

            {isSubItem && !isCollapsed && (
                <span
                    className="absolute left-px top-0 bottom-0 w-px bg-primary"
                />
            )}
        </div>
    );

    return (
        <div className="relative">
            {to && !hasSubItems ? (
                <Link to={to} onClick={closeMobileSidebar}>
                    {content}
                </Link>
            ) : (
                content
            )}

            {hasSubItems && isOpen && !isCollapsed && (
                <div className="bg-main-300">
                    {subItems!.map((item, i) => (
                        <NavItem key={i} {...item} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}

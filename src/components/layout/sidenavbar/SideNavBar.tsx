import {
    SideNavLayout,
    SideNavHeader,
    SideNavMain,
    SideNavFooter,
    useSideNavCollapsed,
    useSideNavPin,
} from "./SideNavBarLayout";

import { NavItems } from "./NavItems";
import { NavItem } from "./NavItem";

function SidebarHeader() {
    const isCollapsed = useSideNavCollapsed();
    const { isPinned, togglePin } = useSideNavPin();

    return (
        <div className={`py-4 flex items-center text-xl font-bold text-primary transition-all duration-300 ${isCollapsed ? 'justify-center px-1' : 'gap-2 px-3'}`}>
            <i className="bi bi-compass text-primary" />
            {!isCollapsed && (
                <>
                    <span className="whitespace-nowrap overflow-hidden flex-1">Dira.Me</span>
                    <button
                        onClick={togglePin}
                        className={`ml-auto p-1 transition-colors cursor-pointer w-8 h-8 rounded-full flex items-center justify-center
                            ${isPinned
                                ? 'text-accent hover:bg-accent/10'
                                : 'text-main-500 hover:text-main-700 hover:bg-main-300'
                            }`}
                        title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
                    >
                        <i className={`bi ${isPinned ? 'bi-pin-fill animation-zoom-in' : 'bi-pin-angle animation-zoom-in'} text-sm`} />
                    </button>
                </>
            )}
        </div>
    );
}

function SidebarFooter() {
    const isCollapsed = useSideNavCollapsed();

    return (
        <div className={`py-3 space-y-1 ${isCollapsed ? 'px-1' : 'px-3'}`}>
            <NavItem
                className="rounded-md"
                label="Help & Support"
                to="/help"
                icon={<i className="bi bi-question-circle" />}
            />
            <NavItem
                className="rounded-md"
                label="Logout"
                icon={<i className="bi bi-box-arrow-right" />}
            />
        </div>
    );
}

export function Sidebar() {
    return (
        <SideNavLayout>

            <SideNavHeader sticky={true}>
                <SidebarHeader />
            </SideNavHeader>

            <SideNavMain>
                <div className="py-4 space-y-3">
                    <NavItems
                        items={[
                            { label: "Dashboard", to: "/home", icon: <i className="bi bi-house" /> },
                            {
                                label: "Tasks",
                                icon: <i className="bi bi-check-circle" />,
                                subItems: [
                                    { label: "My Tasks", to: "/todos", icon: <i className="bi bi-list-task" /> },
                                    { label: "Categories", to: "/todos/categories", icon: <i className="bi bi-tag" /> },
                                ],
                            },
                            {
                                label: "Finance",
                                icon: <i className="bi bi-wallet2" />,
                                subItems: [
                                    { label: "Transactions", to: "/finance/ledger", icon: <i className="bi bi-journal-text" /> },
                                    { label: "Parties", to: "/finance/parties", icon: <i className="bi bi-people" /> },
                                    { label: "Accounts", to: "/finance/accounts", icon: <i className="bi bi-bank" /> },
                                    { label: "Obligations", to: "/finance/obligations", icon: <i className="bi bi-receipt" /> },
                                    { label: "Budgets", to: "/finance/budgets", icon: <i className="bi bi-piggy-bank" /> },
                                ],
                            },
                            { label: "Reports", to: "/reports", icon: <i className="bi bi-bar-chart" /> },
                            { label: "Settings", to: "/settings", icon: <i className="bi bi-gear-wide" /> },
                        ]}
                    />
                </div>
            </SideNavMain>

            <SideNavFooter sticky={true}>
                <SidebarFooter />
            </SideNavFooter>

        </SideNavLayout>
    );
}

import { useState } from "react";
import { Button } from "../../components/ui/Buttons";

type NotificationType = "all" | "unread" | "sales" | "system" | "users";

interface Notification {
    id: number;
    title: string;
    message: string;
    type: "sales" | "system" | "users" | "inventory";
    time: string;
    read: boolean;
    icon: string;
    iconBg: string;
}

const sampleNotifications: Notification[] = [
    { id: 1, title: "New Order Received", message: "Order #INV-001 from John Doe for $125.50", type: "sales", time: "2 min ago", read: false, icon: "bi-cart-check", iconBg: "bg-success/10 text-success" },
    { id: 2, title: "Low Stock Alert", message: "Premium Notebook is running low (5 items left)", type: "inventory", time: "15 min ago", read: false, icon: "bi-exclamation-triangle", iconBg: "bg-warning/10 text-warning" },
    { id: 3, title: "New User Registered", message: "Jane Smith created a new account", type: "users", time: "1 hour ago", read: false, icon: "bi-person-plus", iconBg: "bg-info/10 text-info" },
    { id: 4, title: "Payment Received", message: "Payment of $350.00 received from ABC Corp", type: "sales", time: "2 hours ago", read: true, icon: "bi-credit-card", iconBg: "bg-success/10 text-success" },
    { id: 5, title: "System Update", message: "System maintenance scheduled for tonight at 2 AM", type: "system", time: "3 hours ago", read: true, icon: "bi-gear", iconBg: "bg-primary/10 text-primary" },
    { id: 6, title: "Order Shipped", message: "Order #INV-003 has been shipped to Mike Johnson", type: "sales", time: "5 hours ago", read: true, icon: "bi-truck", iconBg: "bg-info/10 text-info" },
    { id: 7, title: "Role Updated", message: "User permissions updated for Sarah Wilson", type: "users", time: "1 day ago", read: true, icon: "bi-shield-check", iconBg: "bg-primary/10 text-primary" },
    { id: 8, title: "Backup Completed", message: "Daily database backup completed successfully", type: "system", time: "1 day ago", read: true, icon: "bi-cloud-check", iconBg: "bg-success/10 text-success" },
];

const filterTabs: { key: NotificationType; label: string; icon: string }[] = [
    { key: "all", label: "All", icon: "bi-bell" },
    { key: "unread", label: "Unread", icon: "bi-envelope" },
    { key: "sales", label: "Sales", icon: "bi-cart" },
    { key: "users", label: "Users", icon: "bi-people" },
    { key: "system", label: "System", icon: "bi-gear" },
];

export function Notifications() {
    const [notifications, setNotifications] = useState(sampleNotifications);
    const [activeFilter, setActiveFilter] = useState<NotificationType>("all");

    const filteredNotifications = notifications.filter(n => {
        if (activeFilter === "all") return true;
        if (activeFilter === "unread") return !n.read;
        return n.type === activeFilter;
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const markAsRead = (id: number) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const deleteNotification = (id: number) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    return (
        <div className="flex-1 text-main-700">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text font-bold">Notifications</h3>
                    <p className="text-sm text-main-500">{unreadCount} unread notifications</p>
                </div>
                <div className="flex gap-2">
                    <Button color="neutral" size="sm" variant="outline" rounded="md" onClick={markAllAsRead}>
                        <i className="bi bi-check-all mr-2" />
                        Mark All as Read
                    </Button>
                    <Button color="primary" size="sm" rounded="md">
                        <i className="bi bi-gear mr-2" />
                        Settings
                    </Button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {filterTabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveFilter(tab.key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                            ${activeFilter === tab.key
                                ? "bg-primary text-main-50"
                                : "bg-main-100 hover:bg-main-200 text-main-600"
                            }`}
                    >
                        <i className={`bi ${tab.icon}`} />
                        {tab.label}
                        {tab.key === "unread" && unreadCount > 0 && (
                            <span className="bg-danger text-main-0 text-xs px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Notifications List */}
            <div className="bg-main-200 rounded-lg border border-main-300">
                {filteredNotifications.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-main-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="bi bi-bell-slash text-main-400 text-2xl" />
                        </div>
                        <p className="text-main-500">No notifications found</p>
                    </div>
                ) : (
                    <div className="divide-y divide-main-200">
                        {filteredNotifications.map(notification => (
                            <div
                                key={notification.id}
                                className={`flex items-start gap-4 p-4 hover:bg-main-300 transition-colors ${!notification.read ? "bg-primary/10" : ""}`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notification.iconBg}`}>
                                    <i className={`bi ${notification.icon}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className={`font-medium ${!notification.read ? "text-main-800" : "text-main-600"}`}>
                                                {notification.title}
                                                {!notification.read && (
                                                    <span className="inline-block w-2 h-2 bg-primary rounded-full ml-2" />
                                                )}
                                            </p>
                                            <p className="text-sm text-main-500 mt-0.5">{notification.message}</p>
                                        </div>
                                        <span className="text-xs text-main-400 whitespace-nowrap">{notification.time}</span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-2">
                                        {!notification.read && (
                                            <button
                                                onClick={() => markAsRead(notification.id)}
                                                className="text-xs text-primary hover:underline"
                                            >
                                                Mark as read
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteNotification(notification.id)}
                                            className="text-xs text-danger hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}


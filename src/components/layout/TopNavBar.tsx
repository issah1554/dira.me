import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useNetwork } from "../../contexts/NetworkContext";
import Avatar from "../ui/Avatar";

interface TopNavProps {
    toggleSidebar: () => void;
    isMobile: boolean;
}

export default function TopNav({ toggleSidebar, isMobile }: TopNavProps) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { toggleTheme } = useTheme();
    const { isOnline, isSyncing, pendingCount, lastSyncedAt, syncNow } = useNetwork();

    const [open, setOpen] = useState<"notif" | "msg" | "profile" | null>(null);
    const navRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on click outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(e.target as Node)) {
                setOpen(null);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/auth/login");
    };

    return (
        <nav
            ref={navRef}
            className="h-14 sm:h-16 border-none border-main-200 bg-main-100 sticky top-0 z-30"
        >
            <div className="h-full px-2 sm:px-4 flex items-center justify-between">
                {/* Sidebar toggle - visible on mobile */}
                <button
                    onClick={toggleSidebar}
                    aria-label="Toggle sidebar"
                    className={`text-main-500 hover:text-main-700 ${isMobile ? 'block' : 'hidden'}`}
                >
                    <i className="bi bi-list text-2xl" />
                </button>

                {/* Spacer for desktop when sidebar toggle is hidden */}
                {!isMobile && <div />}

                {/* Right section */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Offline & Sync Status Indicator */}
                    {!isOnline ? (
                        <div
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                            title="You are currently offline. Changes are saved locally and will automatically sync when connection returns."
                        >
                            <i className="bi bi-wifi-off text-amber-600 dark:text-amber-400" />
                            <span className="hidden sm:inline">Offline</span>
                            {pendingCount > 0 && (
                                <span className="bg-amber-600 text-white text-[10px] font-semibold px-1.5 py-0.2 rounded-full">
                                    {pendingCount}
                                </span>
                            )}
                        </div>
                    ) : isSyncing ? (
                        <div
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                            title="Syncing changes with cloud..."
                        >
                            <i className="bi bi-arrow-repeat animate-spin text-primary" />
                            <span className="hidden sm:inline">Syncing...</span>
                        </div>
                    ) : pendingCount > 0 ? (
                        <button
                            onClick={syncNow}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 cursor-pointer transition-colors"
                            title="Click to synchronize pending changes with cloud"
                        >
                            <i className="bi bi-cloud-arrow-up" />
                            <span>Sync ({pendingCount})</span>
                        </button>
                    ) : (
                        <button
                            onClick={syncNow}
                            className="text-emerald-600 dark:text-emerald-400 hover:opacity-80 transition-opacity cursor-pointer p-1"
                            title={lastSyncedAt ? `Synced with cloud (last: ${lastSyncedAt.toLocaleTimeString()})` : "Synced with cloud"}
                            aria-label="Cloud sync status"
                        >
                            <i className="bi bi-cloud-check text-lg" />
                        </button>
                    )}

                    {/* Fullscreen toggle */}
                    <button
                        onClick={(e) => {
                            const icon = e.currentTarget.querySelector("i");
                            if (!document.fullscreenElement) {
                                document.documentElement.requestFullscreen();
                                icon?.classList.replace("bi-fullscreen", "bi-fullscreen-exit");
                            } else {
                                document.exitFullscreen();
                                icon?.classList.replace("bi-fullscreen-exit", "bi-fullscreen");
                            }
                        }}
                        className="text-main-500 hover:text-primary-700 cursor-pointer"
                        aria-label="Toggle fullscreen"
                    >
                        <i className="bi bi-fullscreen text-xl" />
                    </button>

                    {/* Theme toggle */}
                    <button
                        onClick={toggleTheme}
                        className="text-main-500 hover:text-main-700 cursor-pointer"
                        aria-label="Toggle theme"
                    >
                        <i className="bi bi-circle-half text-xl" />
                    </button>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setOpen(open === "notif" ? null : "notif")}
                            className="relative text-main-500 hover:text-main-700 cursor-pointer"
                        >
                            <i className="bi bi-bell text-xl" />
                            <span className="absolute -top-1 -right-2 text-[10px] px-1.5 rounded-full bg-red-600 text-white">
                                3
                            </span>
                        </button>

                        {open === "notif" && (
                            <div className="absolute right-0 mt-2 w-64 bg-main-200 border border-main-300 rounded-sm shadow-none shadow-main-300 text-main-700 text-sm z-50">
                                <div className="px-4 py-2 font-semibold">Notifications</div>
                                <div className="border-t border-main-300">
                                    <div className="px-4 py-2 hover:bg-main-300">
                                        New user registered
                                    </div>
                                    <div className="px-4 py-2 hover:bg-main-300">
                                        Backup completed
                                    </div>
                                    <div className="px-4 py-2 hover:bg-main-300">
                                        Payment received
                                    </div>
                                </div>
                                <Link
                                    to="/notifications"
                                    className="block text-center px-4 py-2 border-t hover:border border-main-300 hover:border-primary-300 text-primary-700 hover:bg-primary-200 rounded-b-sm"
                                >
                                    View all
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Profile */}
                    <div className="relative">
                        <button
                            onClick={() => setOpen(open === "profile" ? null : "profile")}
                            className="focus:outline-none cursor-pointer "
                        >
                            <Avatar alt={user?.email ?? "User"} size={32} />
                        </button>

                        {open === "profile" && (
                            <div className="absolute right-0 mt-2 w-40 bg-main-200 border border-main-300 rounded-md shadow-lg text-sm z-50">
                                <div className="px-4 py-4 text-center border-b border-main-300">
                                    <Avatar alt={user?.email ?? "User"} size={48} />
                                    <div className="mt-2 font-semibold">{user?.email?.split("@")[0] ?? "User"}</div>
                                    <div className="text-xs text-main-500">{user?.email ?? "user@example.com"}</div>
                                </div>

                                <Link
                                    to="/settings"
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-main-300"
                                >
                                    <i className="bi bi-gear" /> Settings
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 w-full text-danger-600 border-t hover:border border-main-300 hover:bg-danger-100 hover:border-danger-300 rounded-b-sm"
                                >
                                    <i className="bi bi-box-arrow-right" /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

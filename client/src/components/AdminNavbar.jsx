import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Package,
    CalendarCheck,
    CreditCard,
    Star,
    FileText,
    UserCircle,
    LogOut,
    Menu,
    X,
    ShieldCheck
} from "lucide-react";
import { logoutUser } from "../services/authService";
import toast from "react-hot-toast";

function AdminNavbar() {

    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const menuItems = [
        {
            name: "Dashboard",
            path: "/admin/dashboard",
            icon: LayoutDashboard
        },
        {
            name: "Users",
            path: "/admin/users",
            icon: Users
        },
        {
            name: "Items",
            path: "/admin/items",
            icon: Package
        },
        {
            name: "Bookings",
            path: "/admin/bookings",
            icon: CalendarCheck
        },
        {
            name: "Payments",
            path: "/admin/payments",
            icon: CreditCard
        },
        {
            name: "Reviews",
            path: "/admin/reviews",
            icon: Star
        },
        {
            name: "Audit Logs",
            path: "/admin/audit-logs",
            icon: FileText
        }
    ];

    const handleLogout = async () => {

        try {
            await logoutUser();

            toast.success("Logged out successfully");

            navigate("/login");

        } catch (error) {

            toast.error("Logout failed");

        }
    };

    return (
        <>
            {/* ================= DESKTOP SIDEBAR ================= */}
            <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block">

                {/* Logo */}
                <div className="flex h-20 items-center gap-3 border-b border-slate-200 px-6">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                        <ShieldCheck size={22} />
                    </div>

                    <div>
                        <h1 className="text-lg font-bold text-slate-900">
                            LocalRent
                        </h1>

                        <p className="text-xs font-medium text-blue-600">
                            ADMIN PANEL
                        </p>
                    </div>

                </div>

                {/* Navigation */}
                <nav className="space-y-1 px-4 py-6">

                    {menuItems.map((item) => {

                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                                        isActive
                                            ? "bg-blue-50 text-blue-600"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    }`
                                }
                            >
                                <Icon size={19} />
                                {item.name}
                            </NavLink>
                        );
                    })}

                </nav>

                {/* Bottom section */}
                <div className="absolute bottom-0 left-0 w-full border-t border-slate-200 p-4">

                    <button
                        onClick={() => navigate("/admin/profile")}
                        className="mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                    >
                        <UserCircle size={19} />
                        Admin Profile
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                        <LogOut size={19} />
                        Logout
                    </button>

                </div>

            </aside>


            {/* ================= MOBILE HEADER ================= */}
            <header className="sticky top-0 z-40 border-b border-slate-200 bg-white lg:hidden">

                <div className="flex h-16 items-center justify-between px-4">

                    <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                            <ShieldCheck size={19} />
                        </div>

                        <div>
                            <p className="font-bold text-slate-900">
                                LocalRent
                            </p>

                            <p className="text-[10px] font-semibold text-blue-600">
                                ADMIN PANEL
                            </p>
                        </div>

                    </div>

                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>

                </div>


                {/* Mobile menu */}
                {mobileOpen && (

                    <div className="border-t border-slate-200 bg-white px-4 py-4">

                        <nav className="space-y-1">

                            {menuItems.map((item) => {

                                const Icon = item.icon;

                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setMobileOpen(false)}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
                                                isActive
                                                    ? "bg-blue-50 text-blue-600"
                                                    : "text-slate-600 hover:bg-slate-50"
                                            }`
                                        }
                                    >
                                        <Icon size={19} />
                                        {item.name}
                                    </NavLink>
                                );
                            })}

                            <button
                                onClick={() => {
                                    setMobileOpen(false);
                                    navigate("/admin/profile");
                                }}
                                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600"
                            >
                                <UserCircle size={19} />
                                Admin Profile
                            </button>

                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600"
                            >
                                <LogOut size={19} />
                                Logout
                            </button>

                        </nav>

                    </div>

                )}

            </header>
        </>
    );
}

export default AdminNavbar;
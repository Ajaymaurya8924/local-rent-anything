import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Users,
    Package,
    CalendarCheck,
    IndianRupee,
    Clock3,
    CheckCircle2,
    XCircle,
    Ban,
    RefreshCcw,
    AlertTriangle,
    UserPlus,
    ArrowRight,
    ShieldCheck
} from "lucide-react";

import AdminNavbar from "../components/AdminNavbar";
import api from "../api/axios";
import toast from "react-hot-toast";

const AdminDashboard = () => {
    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    // =====================================================
    // FETCH ADMIN DASHBOARD DATA
    // =====================================================

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);

                const response = await api.get(
                    "/admin/dashboard"
                );

                console.log(
                    "Admin Dashboard Response:",
                    response?.data
                );

                setDashboard(
                    response?.data?.data || null
                );
            } catch (error) {
                console.error(
                    "Admin dashboard error:",
                    error
                );

                toast.error(
                    error?.response?.data?.message ||
                    "Unable to load admin dashboard"
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    // =====================================================
    // LOADING SCREEN
    // =====================================================

    if (loading) {
        return (
            <>
                <AdminNavbar />

                <div className="min-h-screen bg-slate-50 lg:pl-64">
                    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

                        <div className="h-8 w-72 animate-pulse rounded-lg bg-slate-200" />

                        <div className="mt-2 h-4 w-96 animate-pulse rounded bg-slate-200" />

                        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {[1, 2, 3, 4].map((item) => (
                                <div
                                    key={item}
                                    className="h-32 animate-pulse rounded-2xl bg-slate-200"
                                />
                            ))}
                        </div>

                        <div className="mt-6 grid gap-6 lg:grid-cols-2">
                            <div className="h-72 animate-pulse rounded-2xl bg-slate-200" />
                            <div className="h-72 animate-pulse rounded-2xl bg-slate-200" />
                        </div>

                    </main>
                </div>
            </>
        );
    }

    // =====================================================
    // IMPORTANT:
    // Backend returns:
    //
    // summary
    // bookingStatus
    // rentals
    // recentUsers
    // recentBookings
    //
    // NOT "statistics"
    // =====================================================

    const summary = dashboard?.summary || {};
    const bookingStatus = dashboard?.bookingStatus || {};
    const rentals = dashboard?.rentals || {};

    const recentUsers = dashboard?.recentUsers || [];
    const recentBookings = dashboard?.recentBookings || [];

    return (
        <>
            {/* Separate admin navigation */}
            <AdminNavbar />

            <div className="min-h-screen bg-slate-50 lg:pl-64">

                <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

                    {/* ================= HEADER ================= */}

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                        <div>

                            <div className="flex items-center gap-2">

                                <ShieldCheck
                                    size={22}
                                    className="text-blue-600"
                                />

                                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                                    Admin Panel
                                </p>

                            </div>

                            <h1 className="mt-1 text-3xl font-bold text-slate-900">
                                Admin Dashboard
                            </h1>

                            <p className="mt-2 text-slate-500">
                                Monitor users, items, bookings and platform activity.
                            </p>

                        </div>

                    </div>


                    {/* ================= SUMMARY ================= */}

                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                        <SummaryCard
                            icon={<Users size={21} />}
                            title="Total Users"
                            value={summary.totalUsers || 0}
                            onClick={() =>
                                navigate("/admin/users")
                            }
                        />

                        <SummaryCard
                            icon={<Package size={21} />}
                            title="Total Items"
                            value={summary.totalItems || 0}
                            onClick={() =>
                                navigate("/admin/items")
                            }
                        />

                        <SummaryCard
                            icon={<CalendarCheck size={21} />}
                            title="Total Bookings"
                            value={summary.totalBookings || 0}
                            onClick={() =>
                                navigate("/admin/bookings")
                            }
                        />

                        <SummaryCard
                            icon={<IndianRupee size={21} />}
                            title="Total Revenue"
                            value={`₹${Number(
                                summary.totalRevenue || 0
                            ).toLocaleString("en-IN")}`}
                            onClick={() =>
                                navigate("/admin/payments")
                            }
                        />

                    </div>


                    {/* ================= BOOKING STATUS ================= */}

                    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                        <div>

                            <h2 className="font-bold text-slate-900">
                                Booking Overview
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Current booking status across the platform
                            </p>

                        </div>


                        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                            <StatusCard
                                icon={<Clock3 size={19} />}
                                label="Pending"
                                value={bookingStatus.pending || 0}
                                iconClass="bg-amber-50 text-amber-600"
                                onClick={() =>
                                    navigate(
                                        "/admin/bookings?status=pending"
                                    )
                                }
                            />

                            <StatusCard
                                icon={<CheckCircle2 size={19} />}
                                label="Accepted"
                                value={bookingStatus.accepted || 0}
                                iconClass="bg-green-50 text-green-600"
                                onClick={() =>
                                    navigate(
                                        "/admin/bookings?status=accepted"
                                    )
                                }
                            />

                            <StatusCard
                                icon={<XCircle size={19} />}
                                label="Rejected"
                                value={bookingStatus.rejected || 0}
                                iconClass="bg-red-50 text-red-600"
                                onClick={() =>
                                    navigate(
                                        "/admin/bookings?status=rejected"
                                    )
                                }
                            />

                            <StatusCard
                                icon={<Ban size={19} />}
                                label="Cancelled"
                                value={bookingStatus.cancelled || 0}
                                iconClass="bg-slate-100 text-slate-600"
                                onClick={() =>
                                    navigate(
                                        "/admin/bookings?status=cancelled"
                                    )
                                }
                            />

                        </div>

                    </div>


                    {/* ================= RENTAL STATUS ================= */}

                    <div className="mt-6 grid gap-6 lg:grid-cols-3">

                        <RentalCard
                            icon={<CalendarCheck size={21} />}
                            title="Active Rentals"
                            value={rentals.active || 0}
                            description="Currently rented items"
                            className="bg-blue-50 text-blue-600"
                            onClick={() =>
                                navigate(
                                    "/admin/bookings?status=active"
                                )
                            }
                        />

                        <RentalCard
                            icon={<RefreshCcw size={21} />}
                            title="Returned"
                            value={rentals.returned || 0}
                            description="Successfully returned rentals"
                            className="bg-green-50 text-green-600"
                            onClick={() =>
                                navigate(
                                    "/admin/bookings?status=returned"
                                )
                            }
                        />

                        <RentalCard
                            icon={<AlertTriangle size={21} />}
                            title="Overdue"
                            value={rentals.overdue || 0}
                            description="Rentals past return date"
                            className="bg-red-50 text-red-600"
                            onClick={() =>
                                navigate(
                                    "/admin/bookings?status=overdue"
                                )
                            }
                        />

                    </div>


                    {/* ================= RECENT USERS ================= */}

                    <div className="mt-6 grid gap-6 lg:grid-cols-2">

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                            <div className="flex items-center justify-between">

                                <div>

                                    <h2 className="font-bold text-slate-900">
                                        Recent Users
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Recently registered users
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/admin/users")
                                    }
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition hover:bg-blue-600 hover:text-white"
                                >
                                    <UserPlus size={19} />
                                </button>

                            </div>


                            <div className="mt-5 divide-y divide-slate-100">

                                {recentUsers.length === 0 ? (

                                    <EmptyState text="No users found" />

                                ) : (

                                    recentUsers.map((user) => (

                                        <button
                                            type="button"
                                            key={user._id}
                                            onClick={() =>
                                                navigate("/admin/users")
                                            }
                                            className="flex w-full items-center justify-between gap-3 py-4 text-left transition hover:bg-slate-50"
                                        >

                                            <div className="flex min-w-0 items-center gap-3">

                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-semibold text-blue-600">

                                                    {user.fullName
                                                        ?.charAt(0)
                                                        ?.toUpperCase() || "U"}

                                                </div>

                                                <div className="min-w-0">

                                                    <p className="truncate text-sm font-semibold text-slate-800">
                                                        {user.fullName}
                                                    </p>

                                                    <p className="truncate text-xs text-slate-400">
                                                        {user.email}
                                                    </p>

                                                </div>

                                            </div>

                                            <span className="shrink-0 text-xs text-slate-400">
                                                {formatDate(user.createdAt)}
                                            </span>

                                        </button>

                                    ))

                                )}

                            </div>


                            {recentUsers.length > 0 && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/admin/users")
                                    }
                                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                >
                                    View All Users
                                    <ArrowRight size={16} />
                                </button>

                            )}

                        </div>


                        {/* ================= RECENT BOOKINGS ================= */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                            <div className="flex items-center justify-between">

                                <div>

                                    <h2 className="font-bold text-slate-900">
                                        Recent Bookings
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Latest booking activity
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/admin/bookings")
                                    }
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition hover:bg-blue-600 hover:text-white"
                                >
                                    <CalendarCheck size={19} />
                                </button>

                            </div>


                            <div className="mt-5 divide-y divide-slate-100">

                                {recentBookings.length === 0 ? (

                                    <EmptyState text="No bookings found" />

                                ) : (

                                    recentBookings.map((booking) => (

                                        <button
                                            type="button"
                                            key={booking._id}
                                            onClick={() =>
                                                navigate("/admin/bookings")
                                            }
                                            className="flex w-full items-center justify-between gap-3 py-4 text-left transition hover:bg-slate-50"
                                        >

                                            <div className="min-w-0">

                                                <p className="truncate text-sm font-semibold text-slate-800">
                                                    {booking.item?.title || "Item"}
                                                </p>

                                                <p className="mt-1 truncate text-xs text-slate-400">
                                                    {booking.renter?.fullName || "User"}
                                                </p>

                                            </div>


                                            <div className="text-right">

                                                <p className="text-sm font-semibold text-slate-800">
                                                    ₹{Number(
                                                        booking.totalAmount || 0
                                                    ).toLocaleString("en-IN")}
                                                </p>

                                                <span
                                                    className={`mt-1 inline-block rounded-lg px-2 py-1 text-[10px] font-semibold uppercase ${
                                                        booking.status === "accepted"
                                                            ? "bg-green-50 text-green-700"
                                                            : booking.status === "pending"
                                                                ? "bg-amber-50 text-amber-700"
                                                                : booking.status === "rejected"
                                                                    ? "bg-red-50 text-red-700"
                                                                    : "bg-slate-100 text-slate-600"
                                                    }`}
                                                >
                                                    {booking.status}
                                                </span>

                                            </div>

                                        </button>

                                    ))

                                )}

                            </div>


                            {recentBookings.length > 0 && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/admin/bookings")
                                    }
                                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                >
                                    View All Bookings
                                    <ArrowRight size={16} />
                                </button>

                            )}

                        </div>

                    </div>


                    {/* ================= QUICK ACTION ================= */}

                    <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-6">

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                            <div>

                                <h2 className="font-bold text-blue-900">
                                    System Activity
                                </h2>

                                <p className="mt-1 text-sm text-blue-700">
                                    View complete audit logs and platform activity.
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/admin/audit-logs")
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                Audit Logs
                                <ArrowRight size={16} />
                            </button>

                        </div>

                    </div>

                </main>

            </div>
        </>
    );
};


/*
 * Top dashboard summary card.
 * Clicking the card opens the related admin section.
 */
const SummaryCard = ({
    icon,
    title,
    value,
    onClick
}) => {

    return (
        <button
            type="button"
            onClick={onClick}
            className="group w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
        >

            <div className="flex items-start justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                    {icon}
                </div>

                <ArrowRight
                    size={18}
                    className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
                />

            </div>

            <p className="mt-5 text-sm font-medium text-slate-500">
                {title}
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
                {value}
            </p>

        </button>
    );
};


/*
 * Booking status card.
 */
const StatusCard = ({
    icon,
    label,
    value,
    iconClass,
    onClick
}) => {

    return (
        <button
            type="button"
            onClick={onClick}
            className="group w-full rounded-xl border border-slate-100 bg-slate-50 p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-sm"
        >

            <div className="flex items-center justify-between gap-3">

                <div className="flex items-center gap-3">

                    <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
                    >
                        {icon}
                    </div>

                    <div>

                        <p className="text-xs font-medium text-slate-500">
                            {label}
                        </p>

                        <p className="text-xl font-bold text-slate-900">
                            {value}
                        </p>

                    </div>

                </div>

                <ArrowRight
                    size={17}
                    className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
                />

            </div>

        </button>
    );
};


/*
 * Rental status card.
 */
const RentalCard = ({
    icon,
    title,
    value,
    description,
    className,
    onClick
}) => {

    return (
        <button
            type="button"
            onClick={onClick}
            className="group w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
        >

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    <p className="mt-1 text-3xl font-bold text-slate-900">
                        {value}
                    </p>

                </div>

                <div className="flex items-center gap-2">

                    <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${className}`}
                    >
                        {icon}
                    </div>

                    <ArrowRight
                        size={17}
                        className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
                    />

                </div>

            </div>

            <p className="mt-4 text-xs text-slate-400">
                {description}
            </p>

        </button>
    );
};


/*
 * Empty state for recent lists.
 */
const EmptyState = ({ text }) => {

    return (
        <div className="py-8 text-center">

            <p className="text-sm text-slate-400">
                {text}
            </p>

        </div>
    );
};


/*
 * Format dates consistently.
 */
const formatDate = (date) => {

    if (!date) return "";

    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
};


export default AdminDashboard;
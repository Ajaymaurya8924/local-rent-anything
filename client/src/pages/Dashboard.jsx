import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Package,
    CalendarCheck,
    Clock3,
    Inbox,
    Wallet,
    ArrowDownLeft,
    ArrowUpRight,
    CalendarDays,
    Activity,
    Plus,
    Search,
    ChevronRight
} from "lucide-react";

import Navbar from "../components/Navbar";
import { getMyItems } from "../services/itemService";
import {
    getMyBookings,
    getReceivedBookings
} from "../services/bookingService";

import toast from "react-hot-toast";

const Dashboard = () => {
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [myBookings, setMyBookings] = useState([]);
    const [receivedBookings, setReceivedBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load all dashboard data from existing APIs.
    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);

                const [
                    itemsResponse,
                    bookingsResponse,
                    receivedResponse
                ] = await Promise.all([
                    getMyItems(),
                    getMyBookings(),
                    getReceivedBookings()
                ]);

                setItems(
                    itemsResponse?.data?.items ||
                    itemsResponse?.items ||
                    []
                );

                setMyBookings(
                    bookingsResponse?.data?.bookings ||
                    bookingsResponse?.bookings ||
                    []
                );

                setReceivedBookings(
                    receivedResponse?.data?.bookings ||
                    receivedResponse?.bookings ||
                    []
                );
            } catch (error) {
                console.error("Dashboard error:", error);

                toast.error(
                    error?.response?.data?.message ||
                    "Unable to load dashboard"
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    // Items currently rented out by the user.
    const rentedItems = useMemo(() => {
        return items.filter(
            (item) =>
                item.status === "rented" ||
                item.isAvailable === false
        );
    }, [items]);

    // Booking requests received for user's items.
    const pendingRequests = useMemo(() => {
        return receivedBookings.filter(
            (booking) => booking.status === "pending"
        );
    }, [receivedBookings]);

    // User's currently active rentals.
    const activeRentals = useMemo(() => {
        return myBookings.filter(
            (booking) =>
                booking.status === "accepted" &&
                booking.paymentStatus === "paid" &&
                booking.returnStatus !== "returned"
        );
    }, [myBookings]);

    // Upcoming returns.
    const upcomingReturns = useMemo(() => {
        return activeRentals
            .filter((booking) => booking.endDate)
            .sort(
                (a, b) =>
                    new Date(a.endDate) -
                    new Date(b.endDate)
            )
            .slice(0, 4);
    }, [activeRentals]);

    // Total money earned from user's rented items.
    const totalEarnings = useMemo(() => {
        return receivedBookings
            .filter(
                (booking) =>
                    booking.status === "accepted" &&
                    booking.paymentStatus === "paid"
            )
            .reduce(
                (total, booking) =>
                    total + Number(booking.totalAmount || 0),
                0
            );
    }, [receivedBookings]);

    // Total amount spent by the user on rentals.
    const totalSpent = useMemo(() => {
        return myBookings
            .filter(
                (booking) =>
                    booking.paymentStatus === "paid"
            )
            .reduce(
                (total, booking) =>
                    total + Number(booking.totalAmount || 0),
                0
            );
    }, [myBookings]);

    // Available items.
    const availableItems = items.filter(
        (item) =>
            item.status !== "rented" &&
            item.isAvailable !== false
    ).length;

    const formatDate = (date) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
    };

    const getItemTitle = (booking) => {
        return (
            booking?.item?.title ||
            booking?.item?.name ||
            "Rental Item"
        );
    };

    const getReturnLabel = (booking) => {
        if (!booking.endDate) return "No date";

        const today = new Date();
        const endDate = new Date(booking.endDate);

        if (endDate < today) {
            return "Overdue";
        }

        return formatDate(booking.endDate);
    };

    if (loading) {
        return (
            <>
                <Navbar />

                <div className="min-h-screen bg-slate-50">
                    <div className="mx-auto max-w-7xl px-4 py-8">
                        <div className="h-8 w-64 animate-pulse rounded-lg bg-slate-200" />

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
                            <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
                            <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-slate-50">
                <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

                    {/* ================= HEADER ================= */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                                Dashboard
                            </p>

                            <h1 className="mt-1 text-3xl font-bold text-slate-900">
                                Welcome back 👋
                            </h1>

                            <p className="mt-2 text-slate-500">
                                Here's what's happening with your rentals and items.
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate("/items")}
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                <Search size={17} />
                                Explore
                            </button>

                            <button
                                onClick={() => navigate("/add-item")}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                            >
                                <Plus size={17} />
                                Add Item
                            </button>
                        </div>
                    </div>

                    {/* ================= SUMMARY CARDS ================= */}
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                        <SummaryCard
                            icon={<Package size={21} />}
                            title="My Items"
                            value={items.length}
                            subtitle={`${availableItems} available`}
                            onClick={() => navigate("/my-items")}
                        />

                        <SummaryCard
                            icon={<CalendarCheck size={21} />}
                            title="My Bookings"
                            value={myBookings.length}
                            subtitle={`${activeRentals.length} active rentals`}
                            onClick={() => navigate("/my-bookings")}
                        />

                        <SummaryCard
                            icon={<Clock3 size={21} />}
                            title="Active Rentals"
                            value={activeRentals.length}
                            subtitle="Currently with you"
                            onClick={() => navigate("/my-bookings")}
                        />

                        <SummaryCard
                            icon={<Inbox size={21} />}
                            title="Pending Requests"
                            value={pendingRequests.length}
                            subtitle="Waiting for your response"
                            onClick={() => navigate("/received-bookings")}
                        />

                    </div>

                    {/* ================= OWNER + RENTER ================= */}
                    <div className="mt-6 grid gap-6 lg:grid-cols-2">

                        {/* Owner overview */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="font-bold text-slate-900">
                                        My Items
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Overview of items you own
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <Package size={21} />
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-3 gap-3">
                                <MiniStat
                                    label="Total"
                                    value={items.length}
                                />

                                <MiniStat
                                    label="Available"
                                    value={availableItems}
                                />

                                <MiniStat
                                    label="Rented"
                                    value={rentedItems.length}
                                />
                            </div>

                            <button
                                onClick={() => navigate("/my-items")}
                                className="mt-5 flex w-full items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
                            >
                                View My Items
                                <ChevronRight size={17} />
                            </button>
                        </div>

                        {/* Renter overview */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="font-bold text-slate-900">
                                        My Rentals
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Your current rental activity
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                    <CalendarCheck size={21} />
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-3 gap-3">
                                <MiniStat
                                    label="Total"
                                    value={myBookings.length}
                                />

                                <MiniStat
                                    label="Active"
                                    value={activeRentals.length}
                                />

                                <MiniStat
                                    label="Returned"
                                    value={
                                        myBookings.filter(
                                            (booking) =>
                                                booking.returnStatus === "returned"
                                        ).length
                                    }
                                />
                            </div>

                            <button
                                onClick={() => navigate("/my-bookings")}
                                className="mt-5 flex w-full items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
                            >
                                View My Bookings
                                <ChevronRight size={17} />
                            </button>
                        </div>
                    </div>

                    {/* ================= MONEY ================= */}
                    <div className="mt-6 grid gap-6 lg:grid-cols-2">

                        <MoneyCard
                            icon={<ArrowDownLeft size={21} />}
                            title="Total Earnings"
                            subtitle="From your rented items"
                            amount={totalEarnings}
                            type="earning"
                        />

                        <MoneyCard
                            icon={<ArrowUpRight size={21} />}
                            title="Total Spent"
                            subtitle="On items rented by you"
                            amount={totalSpent}
                            type="spent"
                        />

                    </div>

                    {/* ================= UPCOMING RETURNS ================= */}
                    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="font-bold text-slate-900">
                                    Upcoming Returns
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Items you need to return
                                </p>
                            </div>

                            <CalendarDays
                                size={21}
                                className="text-blue-600"
                            />
                        </div>

                        {upcomingReturns.length === 0 ? (
                            <div className="mt-6 rounded-xl bg-slate-50 p-6 text-center">
                                <p className="text-sm font-medium text-slate-600">
                                    No upcoming returns
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                    You're all clear for now.
                                </p>
                            </div>
                        ) : (
                            <div className="mt-5 divide-y divide-slate-100">
                                {upcomingReturns.map((booking) => (
                                    <div
                                        key={booking._id}
                                        className="flex items-center justify-between gap-4 py-4"
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                <Package size={18} />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-slate-800">
                                                    {getItemTitle(booking)}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    Booking return
                                                </p>
                                            </div>
                                        </div>

                                        <span className="shrink-0 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                                            {getReturnLabel(booking)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ================= RECENT ACTIVITY ================= */}
                    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="font-bold text-slate-900">
                                    Recent Activity
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Keep track of your account activity
                                </p>
                            </div>

                            <Activity
                                size={21}
                                className="text-blue-600"
                            />
                        </div>

                        <div className="mt-5 flex items-center justify-between rounded-xl bg-blue-50 p-4">
                            <div>
                                <p className="text-sm font-semibold text-blue-900">
                                    View complete activity history
                                </p>

                                <p className="mt-1 text-xs text-blue-700">
                                    Check your bookings, payments, items and other actions.
                                </p>
                            </div>

                            <button
                                onClick={() => navigate("/activity")}
                                className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                            >
                                View
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>

                </main>
            </div>
        </>
    );
};


/*
 * Small reusable summary card.
 */
const SummaryCard = ({
    icon,
    title,
    value,
    subtitle,
    onClick
}) => {
    return (
        <button
            onClick={onClick}
            className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
        >
            <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    {icon}
                </div>

                <ChevronRight
                    size={17}
                    className="text-slate-300 transition group-hover:text-blue-600"
                />
            </div>

            <p className="mt-5 text-sm font-medium text-slate-500">
                {title}
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
                {value}
            </p>

            <p className="mt-1 text-xs text-slate-400">
                {subtitle}
            </p>
        </button>
    );
};


/*
 * Small stat used inside owner/renter cards.
 */
const MiniStat = ({ label, value }) => {
    return (
        <div className="rounded-xl bg-slate-50 p-3 text-center">
            <p className="text-lg font-bold text-slate-900">
                {value}
            </p>

            <p className="mt-1 text-xs text-slate-500">
                {label}
            </p>
        </div>
    );
};


/*
 * Money overview card.
 */
const MoneyCard = ({
    icon,
    title,
    subtitle,
    amount,
    type
}) => {
    const earning = type === "earning";

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-bold text-slate-900">
                        {title}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        {subtitle}
                    </p>
                </div>

                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                        earning
                            ? "bg-green-50 text-green-600"
                            : "bg-orange-50 text-orange-600"
                    }`}
                >
                    {icon}
                </div>
            </div>

            <p className="mt-6 text-3xl font-bold text-slate-900">
                ₹{amount.toLocaleString("en-IN")}
            </p>
        </div>
    );
};

export default Dashboard;
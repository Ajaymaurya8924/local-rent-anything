import React, { useEffect, useState } from "react";
import {
    CalendarDays,
    Search,
    RotateCcw,
    Package,
    ShoppingBag,
    CreditCard,
    Star,
    User,
    LogIn,
    CheckCircle2,
    XCircle,
    Ban,
    RefreshCcw,
    KeyRound,
    UserRoundPen
} from "lucide-react";

import { getMyAuditLogs } from "../services/auditLogService";
import toast from "react-hot-toast";


import Navbar from "../components/Navbar";


/*
 * Icon based on audit action.
 */
const getActionIcon = (action) => {

    const icons = {
        REGISTER: User,
        LOGIN: LogIn,
        LOGOUT: LogIn,
        PROFILE_UPDATED: UserRoundPen,
        PASSWORD_CHANGED: KeyRound,

        ITEM_CREATED: Package,
        ITEM_UPDATED: Package,
        ITEM_DELETED: Package,

        BOOKING_CREATED: ShoppingBag,
        BOOKING_ACCEPTED: CheckCircle2,
        BOOKING_REJECTED: XCircle,
        BOOKING_CANCELLED: Ban,
        BOOKING_RETURNED: RefreshCcw,

        PAYMENT_SUCCESS: CreditCard,
        PAYMENT_FAILED: CreditCard,

        REVIEW_CREATED: Star
    };

    return icons[action] || CalendarDays;
};


/*
 * Convert action name into readable text.
 *
 * BOOKING_ACCEPTED
 * becomes
 * Booking Accepted
 */
const formatAction = (action) => {

    return action
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) =>
            char.toUpperCase()
        );
};


/*
 * Format date/time for UI.
 */
const formatDateTime = (date) => {

    return new Date(date).toLocaleString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit"
        }
    );
};


const ActivityHistory = () => {

    const [logs, setLogs] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [date, setDate] =
        useState("");

    const [fromDate, setFromDate] =
        useState("");

    const [toDate, setToDate] =
        useState("");


    /*
     * Load activity history.
     */
    const loadLogs = async (
        filters = {}
    ) => {

        try {

            setLoading(true);

            const response =
                await getMyAuditLogs(
                    filters
                );

            setLogs(
                response?.logs || []
            );

        } catch (error) {

            console.error(
                "Activity history error:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Unable to load activity history"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadLogs();

    }, []);


    /*
     * Search exact date.
     */
    const handleSingleDateSearch = () => {

        if (!date) {

            toast.error(
                "Please select a date"
            );

            return;
        }

        // Clear range filters
        setFromDate("");
        setToDate("");

        loadLogs({
            date
        });
    };


    /*
     * Search date range.
     */
    const handleRangeSearch = () => {

        if (!fromDate || !toDate) {

            toast.error(
                "Please select both dates"
            );

            return;
        }

        if (fromDate > toDate) {

            toast.error(
                "From date cannot be after To date"
            );

            return;
        }

        // Clear exact date
        setDate("");

        loadLogs({
            from: fromDate,
            to: toDate
        });
    };


    /*
     * Quick filter - Today.
     */
    const handleToday = () => {

        const today =
            new Date()
                .toISOString()
                .split("T")[0];

        setDate(today);
        setFromDate("");
        setToDate("");

        loadLogs({
            date: today
        });
    };


    /*
     * Quick filter - Last 7 days.
     */
    const handleLast7Days = () => {

        const today =
            new Date();

        const past =
            new Date();

        past.setDate(
            today.getDate() - 6
        );

        const from =
            past.toISOString()
                .split("T")[0];

        const to =
            today.toISOString()
                .split("T")[0];

        setDate("");
        setFromDate(from);
        setToDate(to);

        loadLogs({
            from,
            to
        });
    };


    /*
     * Quick filter - Last 30 days.
     */
    const handleLast30Days = () => {

        const today =
            new Date();

        const past =
            new Date();

        past.setDate(
            today.getDate() - 29
        );

        const from =
            past.toISOString()
                .split("T")[0];

        const to =
            today.toISOString()
                .split("T")[0];

        setDate("");
        setFromDate(from);
        setToDate(to);

        loadLogs({
            from,
            to
        });
    };


    /*
     * Reset all filters.
     */
    const handleReset = () => {

        setDate("");
        setFromDate("");
        setToDate("");

        loadLogs();
    };


    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-slate-50">

                {/* ================= HEADER ================= */}

                <div className="border-b border-slate-200 bg-white">

                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

                        <div className="flex flex-col gap-2">

                            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                                Account Activity
                            </p>

                            <h1 className="text-3xl font-bold text-slate-900">
                                My Activity History
                            </h1>

                            <p className="text-slate-500">
                                View everything you have done on Local Rent Anything.
                            </p>

                        </div>

                    </div>

                </div>


                <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

                    {/* ================= FILTER CARD ================= */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex items-center gap-2">

                            <Search
                                size={20}
                                className="text-blue-600"
                            />

                            <h2 className="font-bold text-slate-900">
                                Filter Activity
                            </h2>

                        </div>


                        {/* Quick filters */}

                        <div className="mt-5 flex flex-wrap gap-2">

                            <button
                                onClick={handleToday}
                                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                Today
                            </button>

                            <button
                                onClick={handleLast7Days}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Last 7 Days
                            </button>

                            <button
                                onClick={handleLast30Days}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Last 30 Days
                            </button>

                            <button
                                onClick={handleReset}
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                            >
                                <RotateCcw size={15} />
                                Reset
                            </button>

                        </div>


                        {/* Exact date */}

                        <div className="mt-6 grid gap-4 lg:grid-cols-3">

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Specific Date
                                </label>

                                <div className="flex gap-2">

                                    <div className="relative flex-1">

                                        <CalendarDays
                                            size={17}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) =>
                                                setDate(e.target.value)
                                            }
                                            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />

                                    </div>

                                    <button
                                        onClick={
                                            handleSingleDateSearch
                                        }
                                        className="rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800"
                                    >
                                        Search
                                    </button>

                                </div>

                            </div>


                            {/* From date */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    From Date
                                </label>

                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) =>
                                        setFromDate(
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />

                            </div>


                            {/* To date */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    To Date
                                </label>

                                <div className="flex gap-2">

                                    <input
                                        type="date"
                                        value={toDate}
                                        onChange={(e) =>
                                            setToDate(
                                                e.target.value
                                            )
                                        }
                                        className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />

                                    <button
                                        onClick={
                                            handleRangeSearch
                                        }
                                        className="rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800"
                                    >
                                        Search
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* ================= RESULT HEADER ================= */}

                    <div className="mt-8 flex items-center justify-between">

                        <div>

                            <h2 className="text-xl font-bold text-slate-900">
                                Activity
                            </h2>

                            {!loading && (
                                <p className="mt-1 text-sm text-slate-500">
                                    {logs.length}{" "}
                                    {logs.length === 1
                                        ? "activity"
                                        : "activities"}{" "}
                                    found
                                </p>
                            )}

                        </div>

                    </div>


                    {/* ================= LOADING ================= */}

                    {loading && (

                        <div className="mt-5 space-y-4">

                            {[1, 2, 3, 4].map(
                                (item) => (

                                    <div
                                        key={item}
                                        className="h-24 animate-pulse rounded-2xl bg-slate-200"
                                    />

                                )
                            )}

                        </div>

                    )}


                    {/* ================= EMPTY ================= */}

                    {!loading &&
                        logs.length === 0 && (

                            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

                                <CalendarDays
                                    size={42}
                                    className="mx-auto text-slate-400"
                                />

                                <h3 className="mt-4 text-lg font-bold text-slate-900">
                                    No activity found
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    There is no activity matching your selected date or range.
                                </p>

                            </div>
                        )}


                    {/* ================= ACTIVITY LIST ================= */}

                    {!loading &&
                        logs.length > 0 && (

                            <div className="mt-5 space-y-3">

                                {logs.map((log) => {

                                    const Icon =
                                        getActionIcon(
                                            log.action
                                        );

                                    return (

                                        <div
                                            key={log._id}
                                            className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
                                        >

                                            {/* Icon */}

                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                                                <Icon
                                                    size={20}
                                                />

                                            </div>


                                            {/* Content */}

                                            <div className="min-w-0 flex-1">

                                                <div className="flex flex-col justify-between gap-1 sm:flex-row">

                                                    <h3 className="font-bold text-slate-900">
                                                        {formatAction(
                                                            log.action
                                                        )}
                                                    </h3>

                                                    <span className="shrink-0 text-xs text-slate-400">
                                                        {formatDateTime(
                                                            log.createdAt
                                                        )}
                                                    </span>

                                                </div>

                                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                                    {log.description}
                                                </p>


                                                {/* Metadata */}

                                                {log.metadata &&
                                                    Object.keys(
                                                        log.metadata
                                                    ).length > 0 && (

                                                        <div className="mt-3 flex flex-wrap gap-2">

                                                            {log.metadata.itemTitle && (

                                                                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                                                    Item:{" "}
                                                                    {
                                                                        log.metadata.itemTitle
                                                                    }
                                                                </span>

                                                            )}

                                                            {log.metadata.amount !==
                                                                undefined && (

                                                                    <span className="rounded-lg bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                                                                        ₹
                                                                        {
                                                                            log.metadata.amount
                                                                        }
                                                                    </span>

                                                                )}

                                                            {log.metadata.rating && (

                                                                <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                                                                    <Star
                                                                        size={
                                                                            12
                                                                        }
                                                                        className="fill-amber-400 text-amber-400"
                                                                    />
                                                                    {
                                                                        log.metadata.rating
                                                                    }/5
                                                                </span>

                                                            )}

                                                        </div>

                                                    )}

                                            </div>

                                        </div>

                                    );

                                })}

                            </div>
                        )}

                </main>

            </div>

        </>
    );
};

export default ActivityHistory;
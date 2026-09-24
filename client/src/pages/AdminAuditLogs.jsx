import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Search,
    RefreshCw,
    ClipboardList,
     ArrowLeft,
    User,
    Calendar,
    FileText,
    Activity
} from "lucide-react";

import AdminNavbar from "../components/AdminNavbar";
import api from "../api/axios";
import toast from "react-hot-toast";


function AdminAuditLogs() {
  const navigate = useNavigate();
    const [logs, setLogs] = useState([]);

    const [search, setSearch] = useState("");

    const [action, setAction] =
        useState("all");

    const [entityType, setEntityType] =
        useState("all");

    const [loading, setLoading] =
        useState(true);


    // =====================================================
    // FETCH AUDIT LOGS
    // =====================================================

    const fetchLogs = async (
        searchValue = search,
        actionValue = action,
        entityValue = entityType
    ) => {

        try {

            setLoading(true);

            const params =
                new URLSearchParams();

            if (searchValue.trim()) {

                params.append(
                    "search",
                    searchValue.trim()
                );
            }

            if (
                actionValue &&
                actionValue !== "all"
            ) {

                params.append(
                    "action",
                    actionValue
                );
            }

            if (
                entityValue &&
                entityValue !== "all"
            ) {

                params.append(
                    "entityType",
                    entityValue
                );
            }

            const response =
                await api.get(
                    `/audit-logs/all?${params.toString()}`
                );

            const data =
                response?.data?.data;

            setLogs(
                data?.logs || []
            );

        } catch (error) {

            console.error(
                "Admin Audit Logs Error:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Failed to load audit logs"
            );

        } finally {

            setLoading(false);
        }
    };


    // Initial load
    useEffect(() => {

        fetchLogs(
            "",
            "all",
            "all"
        );

    }, []);


    // Live search
    useEffect(() => {

        const timer =
            setTimeout(() => {

                fetchLogs(
                    search,
                    action,
                    entityType
                );

            }, 300);

        return () =>
            clearTimeout(timer);

    }, [search]);


    // Action filter
    const handleActionChange = (
        value
    ) => {

        setAction(value);

        fetchLogs(
            search,
            value,
            entityType
        );
    };


    // Entity filter
    const handleEntityChange = (
        value
    ) => {

        setEntityType(value);

        fetchLogs(
            search,
            action,
            value
        );
    };


    // Refresh
    const handleRefresh = () => {

        fetchLogs(
            search,
            action,
            entityType
        );
    };


    // Clear search
    const clearSearch = () => {

        setSearch("");
    };


    // Format date
    const formatDate = (date) => {

        if (!date) return "—";

        return new Date(date).toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    };


    // Action badge
    const getActionClass = (value) => {

        if (
            value?.includes("SUCCESS") ||
            value?.includes("CREATED") ||
            value === "REGISTER" ||
            value === "LOGIN"
        ) {
            return "bg-emerald-50 text-emerald-700 border-emerald-200";
        }

        if (
            value?.includes("FAILED") ||
            value?.includes("DELETED") ||
            value?.includes("REJECTED")
        ) {
            return "bg-red-50 text-red-700 border-red-200";
        }

        if (
            value?.includes("UPDATED") ||
            value?.includes("ACCEPTED") ||
            value?.includes("RETURNED")
        ) {
            return "bg-blue-50 text-blue-700 border-blue-200";
        }

        return "bg-slate-50 text-slate-700 border-slate-200";
    };


    // =====================================================
    // ACTION OPTIONS
    // =====================================================

    const actionOptions = [
        "REGISTER",
        "LOGIN",
        "LOGOUT",
        "PROFILE_UPDATED",
        "PASSWORD_CHANGED",
        "ITEM_CREATED",
        "ITEM_UPDATED",
        "ITEM_DELETED",
        "BOOKING_CREATED",
        "BOOKING_ACCEPTED",
        "BOOKING_REJECTED",
        "BOOKING_CANCELLED",
        "BOOKING_RETURNED",
        "PAYMENT_SUCCESS",
        "PAYMENT_FAILED",
        "REVIEW_CREATED"
    ];


    // =====================================================
    // ENTITY OPTIONS
    // =====================================================

    const entityOptions = [
        "USER",
        "ITEM",
        "BOOKING",
        "PAYMENT",
        "REVIEW"
    ];


    return (
        <div className="min-h-screen bg-slate-50">

            <AdminNavbar />

            <main className="lg:pl-64">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="border-b border-slate-200 bg-white">

                    <div className="px-4 py-6 sm:px-6 lg:px-8">
                        
                        <button
                            onClick={() =>
                                navigate("/admin/dashboard")
                            }
                            className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
                        >

                            <ArrowLeft size={16} />

                            Back to Dashboard

                        </button>


                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                            <div className="flex items-center gap-3">

                                <div className="rounded-xl bg-blue-50 p-3">

                                    <ClipboardList
                                        size={24}
                                        className="text-blue-600"
                                    />

                                </div>

                                <div>

                                    <h1 className="text-2xl font-bold text-slate-900">
                                        Audit Logs
                                    </h1>

                                    <p className="text-sm text-slate-500">
                                        Monitor important activities across the platform
                                    </p>

                                </div>

                            </div>


                            <button
                                onClick={handleRefresh}
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >

                                <RefreshCw
                                    size={17}
                                    className={
                                        loading
                                            ? "animate-spin"
                                            : ""
                                    }
                                />

                                Refresh

                            </button>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="px-4 py-6 sm:px-6 lg:px-8">

                    {/* =================================================
                        SEARCH + FILTERS
                    ================================================= */}

                    <div className="rounded-xl border border-slate-200 bg-white p-4">

                        <div className="flex flex-col gap-3">

                            {/* Search */}

                            <div className="relative">

                                <Search
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Search user, email, action, entity or description..."
                                    className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />

                                {search && (

                                    <button
                                        onClick={
                                            clearSearch
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                                    >
                                        ×
                                    </button>

                                )}

                            </div>


                            {/* Filters */}

                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

                                {/* Action */}

                                <select
                                    value={action}
                                    onChange={(e) =>
                                        handleActionChange(
                                            e.target.value
                                        )
                                    }
                                    className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >

                                    <option value="all">
                                        All Actions
                                    </option>

                                    {actionOptions.map(
                                        (item) => (

                                            <option
                                                key={item}
                                                value={item}
                                            >
                                                {item.replace(
                                                    /_/g,
                                                    " "
                                                )}
                                            </option>

                                        )
                                    )}

                                </select>


                                {/* Entity */}

                                <select
                                    value={entityType}
                                    onChange={(e) =>
                                        handleEntityChange(
                                            e.target.value
                                        )
                                    }
                                    className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >

                                    <option value="all">
                                        All Entity Types
                                    </option>

                                    {entityOptions.map(
                                        (item) => (

                                            <option
                                                key={item}
                                                value={item}
                                            >
                                                {item}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        LOG COUNT
                    ================================================= */}

                    <div className="mt-5 flex items-center gap-2">

                        <Activity
                            size={17}
                            className="text-blue-600"
                        />

                        <p className="text-sm font-semibold text-slate-700">

                            {logs.length}{" "}
                            {logs.length === 1
                                ? "activity"
                                : "activities"}

                        </p>

                    </div>


                    {/* =================================================
                        LOG LIST
                    ================================================= */}

                    <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">

                        {loading ? (

                            <div className="flex min-h-[350px] items-center justify-center">

                                <div className="text-center">

                                    <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

                                    <p className="text-sm text-slate-500">
                                        Loading audit logs...
                                    </p>

                                </div>

                            </div>

                        ) : logs.length === 0 ? (

                            <div className="flex min-h-[350px] items-center justify-center">

                                <div className="text-center">

                                    <ClipboardList
                                        size={42}
                                        className="mx-auto mb-3 text-slate-300"
                                    />

                                    <h3 className="font-semibold text-slate-700">
                                        No audit logs found
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Try changing your search or filters.
                                    </p>

                                </div>

                            </div>

                        ) : (

                            <div className="divide-y divide-slate-100">

                                {logs.map(
                                    (log) => (

                                        <div
                                            key={log._id}
                                            className="p-5 transition hover:bg-slate-50"
                                        >

                                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                                                {/* Main */}

                                                <div className="min-w-0 flex-1">

                                                    <div className="flex flex-wrap items-center gap-2">

                                                        {/* Action */}

                                                        <span
                                                            className={`rounded-full border px-3 py-1 text-xs font-bold ${getActionClass(
                                                                log.action
                                                            )}`}
                                                        >
                                                            {log.action?.replace(
                                                                /_/g,
                                                                " "
                                                            )}
                                                        </span>


                                                        {/* Entity */}

                                                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                                                            {log.entityType}
                                                        </span>

                                                    </div>


                                                    {/* Description */}

                                                    <p className="mt-3 text-sm font-medium leading-6 text-slate-800">
                                                        {log.description}
                                                    </p>


                                                    {/* User */}

                                                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">

                                                        <div className="flex items-center gap-2">

                                                            <User
                                                                size={15}
                                                                className="text-blue-500"
                                                            />

                                                            <div>

                                                                <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                                                    User
                                                                </span>

                                                                <p className="text-sm font-semibold text-slate-700">
                                                                    {log.user?.fullName ||
                                                                        "Unknown User"}
                                                                </p>

                                                            </div>

                                                        </div>


                                                        <div className="flex items-center gap-2">

                                                            <FileText
                                                                size={15}
                                                                className="text-slate-400"
                                                            />

                                                            <div>

                                                                <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                                                    Email
                                                                </span>

                                                                <p className="text-sm text-slate-600">
                                                                    {log.user?.email ||
                                                                        "—"}
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </div>


                                                    {/* Metadata */}

                                                    {log.metadata &&
                                                        Object.keys(
                                                            log.metadata
                                                        ).length > 0 && (

                                                            <div className="mt-4 rounded-lg bg-slate-50 p-3">

                                                                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                                                                    Metadata
                                                                </p>

                                                                <div className="flex flex-wrap gap-2">

                                                                    {Object.entries(
                                                                        log.metadata
                                                                    ).map(
                                                                        ([key, value]) => (

                                                                            <span
                                                                                key={key}
                                                                                className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600"
                                                                            >

                                                                                <span className="font-semibold">
                                                                                    {key}:
                                                                                </span>{" "}

                                                                                {typeof value ===
                                                                                "object"
                                                                                    ? JSON.stringify(
                                                                                        value
                                                                                    )
                                                                                    : String(
                                                                                        value
                                                                                    )}

                                                                            </span>

                                                                        )
                                                                    )}

                                                                </div>

                                                            </div>

                                                        )}

                                                </div>


                                                {/* Date */}

                                                <div className="flex shrink-0 items-center gap-2 text-sm text-slate-500">

                                                    <Calendar
                                                        size={16}
                                                        className="text-slate-400"
                                                    />

                                                    {formatDate(
                                                        log.createdAt
                                                    )}

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </div>

            </main>

        </div>
    );
}

export default AdminAuditLogs;
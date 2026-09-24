import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import {
    Search,
    RefreshCw,
    CreditCard,
    IndianRupee,
    CheckCircle,
    ArrowLeft,
    Clock,
    XCircle,
    Package,
    User,
    Calendar,
    Copy
} from "lucide-react";

import AdminNavbar from "../components/AdminNavbar";
import api from "../api/axios";
import toast from "react-hot-toast";


function AdminPayments() {

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();


    const [payments, setPayments] = useState([]);

    const [statistics, setStatistics] = useState({
        totalPayments: 0,
        paidPayments: 0,
        pendingPayments: 0,
        failedPayments: 0,
        totalRevenue: 0
    });

    const [search, setSearch] = useState("");

    const [paymentStatus, setPaymentStatus] =
        useState(
            searchParams.get("paymentStatus") || "all"
        );

    const [loading, setLoading] = useState(true);


    // ============================================================
    // PREVENT DUPLICATE INITIAL SEARCH REQUEST
    // ============================================================
    // Initial fetchPayments() already runs when the page loads.
    // This ref prevents the search useEffect from making another
    // API request immediately on the first render.
    // ============================================================

    const isFirstSearchRender = useRef(true);


    // ============================================================
    // FETCH PAYMENTS
    // ============================================================

    const fetchPayments = async (
        searchValue = search,
        statusValue = paymentStatus
    ) => {

        try {

            setLoading(true);


            const params = new URLSearchParams();


            // SEARCH

            if (searchValue.trim()) {

                params.append(
                    "search",
                    searchValue.trim()
                );

            }


            // PAYMENT STATUS

            if (
                statusValue &&
                statusValue !== "all"
            ) {

                params.append(
                    "paymentStatus",
                    statusValue
                );

            }


            const response = await api.get(
                `/admin/dashboard/payments?${params.toString()}`
            );


            const data =
                response?.data?.data;


            setPayments(
                data?.payments || []
            );


            setStatistics(
                data?.statistics || {
                    totalPayments: 0,
                    paidPayments: 0,
                    pendingPayments: 0,
                    failedPayments: 0,
                    totalRevenue: 0
                }
            );

        } catch (error) {

            console.error(
                "Admin Payments Error:",
                error
            );


            toast.error(
                error?.response?.data?.message ||
                "Failed to load payments"
            );

        } finally {

            setLoading(false);

        }
    };


    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {

        fetchPayments(
            "",
            searchParams.get("paymentStatus") || "all"
        );

    }, []);


    // ============================================================
    // LIVE SEARCH
    // ============================================================
    //
    // 300ms debounce.
    //
    // First render is skipped because initial load is already
    // handled by the effect above.
    // ============================================================

    useEffect(() => {

        // Skip first render

        if (isFirstSearchRender.current) {

            isFirstSearchRender.current = false;

            return;

        }


        const timer = setTimeout(() => {

            fetchPayments(
                search,
                paymentStatus
            );

        }, 300);


        return () => clearTimeout(timer);

    }, [search]);


    // ============================================================
    // STATUS CHANGE
    // ============================================================

    const handleStatusChange = (status) => {

        setPaymentStatus(status);

        fetchPayments(
            search,
            status
        );
    };


    // ============================================================
    // CLEAR SEARCH
    // ============================================================

    const clearSearch = () => {

        setSearch("");

    };


    // ============================================================
    // REFRESH
    // ============================================================

    const handleRefresh = () => {

        fetchPayments(
            search,
            paymentStatus
        );

    };


    // ============================================================
    // COPY ID
    // ============================================================

    const copyId = async (value) => {

        if (!value) return;


        try {

            await navigator.clipboard.writeText(
                value
            );

            toast.success("ID copied");

        } catch (error) {

            toast.error(
                "Unable to copy ID"
            );

        }
    };


    // ============================================================
    // FORMAT DATE
    // ============================================================

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


    // ============================================================
    // PAYMENT STATUS STYLING
    // ============================================================

    const getPaymentClass = (status) => {

        if (status === "paid") {

            return "bg-emerald-50 text-emerald-700 border-emerald-200";

        }


        if (status === "failed") {

            return "bg-red-50 text-red-700 border-red-200";

        }


        return "bg-amber-50 text-amber-700 border-amber-200";
    };


    return (

        <div className="min-h-screen bg-slate-50">

            <AdminNavbar />


            <main className="lg:pl-64">


                {/* =====================================================
                    HEADER
                ===================================================== */}

                <div className="border-b border-slate-200 bg-white">

                    <div className="px-4 py-6 sm:px-6 lg:px-8">


                        <button
                            onClick={() =>
                                navigate(
                                    "/admin/dashboard"
                                )
                            }
                            className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
                        >

                            <ArrowLeft size={16} />

                            Back to Dashboard

                        </button>


                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                            <div>

                                <div className="flex items-center gap-3">

                                    <div className="rounded-xl bg-blue-50 p-3">

                                        <CreditCard
                                            size={24}
                                            className="text-blue-600"
                                        />

                                    </div>


                                    <div>

                                        <h1 className="text-2xl font-bold text-slate-900">
                                            Payments
                                        </h1>

                                        <p className="text-sm text-slate-500">
                                            Monitor all rental payments
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* REFRESH */}

                            <button
                                onClick={handleRefresh}
                                disabled={loading}
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
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


                {/* =====================================================
                    CONTENT
                ===================================================== */}

                <div className="px-4 py-6 sm:px-6 lg:px-8">


                    {/* =================================================
                        STATISTICS
                    ================================================= */}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">


                        {/* REVENUE */}

                        <div className="rounded-xl border border-slate-200 bg-white p-5">

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-sm font-medium text-slate-500">
                                        Total Revenue
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-slate-900">

                                        ₹
                                        {Number(
                                            statistics.totalRevenue || 0
                                        ).toLocaleString(
                                            "en-IN"
                                        )}

                                    </p>

                                </div>


                                <div className="rounded-lg bg-emerald-50 p-3">

                                    <IndianRupee
                                        size={22}
                                        className="text-emerald-600"
                                    />

                                </div>

                            </div>

                        </div>


                        {/* TOTAL PAYMENTS */}

                        <div className="rounded-xl border border-slate-200 bg-white p-5">

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-sm font-medium text-slate-500">
                                        Total Payments
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-slate-900">
                                        {statistics.totalPayments}
                                    </p>

                                </div>


                                <div className="rounded-lg bg-blue-50 p-3">

                                    <CreditCard
                                        size={22}
                                        className="text-blue-600"
                                    />

                                </div>

                            </div>

                        </div>


                        {/* PAID */}

                        <div className="rounded-xl border border-slate-200 bg-white p-5">

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-sm font-medium text-slate-500">
                                        Paid
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-emerald-600">
                                        {statistics.paidPayments}
                                    </p>

                                </div>


                                <div className="rounded-lg bg-emerald-50 p-3">

                                    <CheckCircle
                                        size={22}
                                        className="text-emerald-600"
                                    />

                                </div>

                            </div>

                        </div>


                        {/* PENDING */}

                        <div className="rounded-xl border border-slate-200 bg-white p-5">

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-sm font-medium text-slate-500">
                                        Pending
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-amber-600">
                                        {statistics.pendingPayments}
                                    </p>

                                </div>


                                <div className="rounded-lg bg-amber-50 p-3">

                                    <Clock
                                        size={22}
                                        className="text-amber-600"
                                    />

                                </div>

                            </div>

                        </div>


                        {/* FAILED */}

                        <div className="rounded-xl border border-slate-200 bg-white p-5">

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-sm font-medium text-slate-500">
                                        Failed
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-red-600">
                                        {statistics.failedPayments}
                                    </p>

                                </div>


                                <div className="rounded-lg bg-red-50 p-3">

                                    <XCircle
                                        size={22}
                                        className="text-red-600"
                                    />

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        SEARCH + FILTER
                    ================================================= */}

                    <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">

                        <div className="flex flex-col gap-3 lg:flex-row">


                            {/* SEARCH */}

                            <div className="relative flex-1">

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
                                    placeholder="Search item, renter, owner, payment ID..."
                                    className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />


                                {search && (

                                    <button
                                        onClick={clearSearch}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                                    >
                                        ×
                                    </button>

                                )}

                            </div>


                            {/* STATUS FILTER */}

                            <div className="flex flex-wrap gap-2">

                                {[
                                    ["all", "All"],
                                    ["paid", "Paid"],
                                    ["pending", "Pending"],
                                    ["failed", "Failed"]
                                ].map(
                                    ([value, label]) => (

                                        <button
                                            key={value}
                                            onClick={() =>
                                                handleStatusChange(
                                                    value
                                                )
                                            }
                                            className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                                                paymentStatus === value
                                                    ? "bg-blue-600 text-white"
                                                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                            }`}
                                        >

                                            {label}

                                        </button>

                                    )
                                )}

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        TABLE
                    ================================================= */}

                    <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">


                        {loading ? (

                            <div className="flex min-h-[300px] items-center justify-center">

                                <div className="text-center">

                                    <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

                                    <p className="text-sm text-slate-500">
                                        Loading payments...
                                    </p>

                                </div>

                            </div>

                        ) : payments.length === 0 ? (

                            <div className="flex min-h-[300px] items-center justify-center">

                                <div className="text-center">

                                    <CreditCard
                                        size={40}
                                        className="mx-auto mb-3 text-slate-300"
                                    />

                                    <h3 className="font-semibold text-slate-700">
                                        No payments found
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Try changing your search or filter.
                                    </p>

                                </div>

                            </div>

                        ) : (

                            <div className="overflow-x-auto">

                                <table className="w-full min-w-[1200px]">

                                    <thead className="border-b border-slate-200 bg-slate-50">

                                        <tr>

                                            <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                                Item
                                            </th>

                                            <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                                Renter
                                            </th>

                                            <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                                Owner
                                            </th>

                                            <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                                Amount
                                            </th>

                                            <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                                Payment
                                            </th>

                                            <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                                Payment IDs
                                            </th>

                                            <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                                Paid At
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody className="divide-y divide-slate-100">

                                        {payments.map(
                                            (payment) => (

                                                <tr
                                                    key={
                                                        payment._id
                                                    }
                                                    className="transition hover:bg-slate-50"
                                                >


                                                    {/* ITEM */}

                                                    <td className="px-5 py-4">

                                                        <div className="flex items-center gap-3">

                                                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">

                                                                {payment.item?.images?.[0] ? (

                                                                    <img
                                                                        src={
                                                                            payment.item.images[0]
                                                                        }
                                                                        alt={
                                                                            payment.item.title
                                                                        }
                                                                        className="h-full w-full object-cover"
                                                                    />

                                                                ) : (

                                                                    <div className="flex h-full w-full items-center justify-center">

                                                                        <Package
                                                                            size={20}
                                                                            className="text-slate-400"
                                                                        />

                                                                    </div>

                                                                )}

                                                            </div>


                                                            <div>

                                                                <p className="font-semibold text-slate-900">

                                                                    {payment.item?.title ||
                                                                        "Unknown Item"}

                                                                </p>

                                                                <p className="text-xs text-slate-500">

                                                                    {payment.item?.category ||
                                                                        "—"}

                                                                </p>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* RENTER */}

                                                    <td className="px-5 py-4">

                                                        <div className="flex items-center gap-2">

                                                            <User
                                                                size={16}
                                                                className="text-slate-400"
                                                            />

                                                            <div>

                                                                <p className="text-sm font-semibold text-slate-800">

                                                                    {payment.renter?.fullName ||
                                                                        "—"}

                                                                </p>

                                                                <p className="text-xs text-slate-500">

                                                                    {payment.renter?.email ||
                                                                        "—"}

                                                                </p>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* OWNER */}

                                                    <td className="px-5 py-4">

                                                        <div>

                                                            <p className="text-sm font-semibold text-slate-800">

                                                                {payment.owner?.fullName ||
                                                                    "—"}

                                                            </p>

                                                            <p className="text-xs text-slate-500">

                                                                {payment.owner?.email ||
                                                                    "—"}

                                                            </p>

                                                        </div>

                                                    </td>


                                                    {/* AMOUNT */}

                                                    <td className="px-5 py-4">

                                                        <p className="font-bold text-slate-900">

                                                            ₹
                                                            {Number(
                                                                payment.totalAmount ||
                                                                0
                                                            ).toLocaleString(
                                                                "en-IN"
                                                            )}

                                                        </p>

                                                        <p className="text-xs text-slate-500">

                                                            {payment.totalDays ||
                                                                0}{" "}
                                                            days

                                                        </p>

                                                    </td>


                                                    {/* PAYMENT STATUS */}

                                                    <td className="px-5 py-4">

                                                        <span
                                                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getPaymentClass(
                                                                payment.paymentStatus
                                                            )}`}
                                                        >

                                                            {payment.paymentStatus ===
                                                                "paid" && (

                                                                <CheckCircle
                                                                    size={13}
                                                                />

                                                            )}


                                                            {payment.paymentStatus ===
                                                                "pending" && (

                                                                <Clock
                                                                    size={13}
                                                                />

                                                            )}


                                                            {payment.paymentStatus ===
                                                                "failed" && (

                                                                <XCircle
                                                                    size={13}
                                                                />

                                                            )}


                                                            {payment.paymentStatus ||
                                                                "unknown"}

                                                        </span>

                                                    </td>


                                                    {/* PAYMENT IDS */}

                                                    <td className="px-5 py-4">

                                                        <div className="space-y-2">


                                                            {/* ORDER ID */}

                                                            <div className="flex items-center gap-2">

                                                                <span className="text-[11px] font-semibold text-slate-400">
                                                                    ORDER
                                                                </span>

                                                                <span className="max-w-[160px] truncate text-xs text-slate-600">

                                                                    {payment.razorpayOrderId ||
                                                                        "—"}

                                                                </span>


                                                                {payment.razorpayOrderId && (

                                                                    <button
                                                                        onClick={() =>
                                                                            copyId(
                                                                                payment.razorpayOrderId
                                                                            )
                                                                        }
                                                                        className="text-slate-400 hover:text-blue-600"
                                                                    >

                                                                        <Copy
                                                                            size={13}
                                                                        />

                                                                    </button>

                                                                )}

                                                            </div>


                                                            {/* PAYMENT ID */}

                                                            <div className="flex items-center gap-2">

                                                                <span className="text-[11px] font-semibold text-slate-400">
                                                                    PAYMENT
                                                                </span>

                                                                <span className="max-w-[160px] truncate text-xs text-slate-600">

                                                                    {payment.paymentId ||
                                                                        "—"}

                                                                </span>


                                                                {payment.paymentId && (

                                                                    <button
                                                                        onClick={() =>
                                                                            copyId(
                                                                                payment.paymentId
                                                                            )
                                                                        }
                                                                        className="text-slate-400 hover:text-blue-600"
                                                                    >

                                                                        <Copy
                                                                            size={13}
                                                                        />

                                                                    </button>

                                                                )}

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* PAID AT */}

                                                    <td className="px-5 py-4">

                                                        <div className="flex items-center gap-2">

                                                            <Calendar
                                                                size={16}
                                                                className="text-slate-400"
                                                            />

                                                            <span className="text-sm text-slate-600">

                                                                {payment.paidAt
                                                                    ? formatDate(
                                                                        payment.paidAt
                                                                    )
                                                                    : "Not paid"}

                                                            </span>

                                                        </div>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </div>

            </main>

        </div>
    );
}


export default AdminPayments;
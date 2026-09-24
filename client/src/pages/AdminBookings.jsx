import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
    Search,
    CalendarDays,
    RefreshCw,
    ArrowLeft,
    User,
    Package,
    CreditCard,
    RotateCcw
} from "lucide-react";

import AdminNavbar from "../components/AdminNavbar";
import api from "../api/axios";
import { toast } from "react-hot-toast";


function AdminBookings() {

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();


    const [bookings, setBookings] = useState([]);

    const [search, setSearch] = useState("");

    const [status, setStatus] = useState(
        searchParams.get("status") || "all"
    );

    const [loading, setLoading] = useState(true);


    // ============================================================
    // PREVENT DUPLICATE INITIAL SEARCH REQUEST
    // ============================================================
    // Initial fetchBookings() already runs when the page loads.
    // This ref prevents the search useEffect from making another
    // API request immediately on the first render.
    // ============================================================

    const isFirstSearchRender = useRef(true);


    // ============================================================
    // FETCH BOOKINGS
    // ============================================================

    const fetchBookings = async (
        searchValue = "",
        statusValue = "all"
    ) => {

        try {

            setLoading(true);

            const params = {};


            // Search

            if (searchValue.trim()) {

                params.search = searchValue.trim();

            }


            // Status

            if (
                statusValue &&
                statusValue !== "all"
            ) {

                params.status = statusValue;

            }


            const response = await api.get(
                "/admin/dashboard/bookings",
                {
                    params
                }
            );


            setBookings(
                response?.data?.data?.bookings || []
            );

        } catch (error) {

            console.error(
                "Fetch admin bookings error:",
                error
            );


            toast.error(
                error?.response?.data?.message ||
                "Failed to load bookings"
            );

        } finally {

            setLoading(false);

        }
    };


    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {

        fetchBookings(
            "",
            searchParams.get("status") || "all"
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

            fetchBookings(
                search,
                status
            );

        }, 300);


        return () => clearTimeout(timer);

    }, [search]);


    // ============================================================
    // STATUS CHANGE
    // ============================================================

    const handleStatusChange = (value) => {

        setStatus(value);

        fetchBookings(
            search,
            value
        );
    };


    // ============================================================
    // CLEAR SEARCH
    // ============================================================

    const handleClearSearch = () => {

        setSearch("");

    };


    // ============================================================
    // DATE FORMAT
    // ============================================================

    const formatDate = (date) => {

        if (!date) {
            return "N/A";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };


    // ============================================================
    // BOOKING STATUS BADGE
    // ============================================================

    const getStatusClass = (value) => {

        const classes = {

            pending:
                "bg-yellow-50 text-yellow-700",

            accepted:
                "bg-green-50 text-green-700",

            rejected:
                "bg-red-50 text-red-700",

            cancelled:
                "bg-slate-100 text-slate-600"

        };


        return (
            classes[value] ||
            "bg-slate-100 text-slate-600"
        );
    };


    // ============================================================
    // PAYMENT BADGE
    // ============================================================

    const getPaymentClass = (value) => {

        const classes = {

            paid:
                "bg-green-50 text-green-700",

            pending:
                "bg-yellow-50 text-yellow-700",

            failed:
                "bg-red-50 text-red-700"

        };


        return (
            classes[value] ||
            "bg-slate-100 text-slate-600"
        );
    };


    // ============================================================
    // RETURN BADGE
    // ============================================================

    const getReturnClass = (value) => {

        const classes = {

            pending:
                "bg-yellow-50 text-yellow-700",

            returned:
                "bg-green-50 text-green-700",

            overdue:
                "bg-red-50 text-red-700"

        };


        return (
            classes[value] ||
            "bg-slate-100 text-slate-600"
        );
    };


    return (

        <div className="min-h-screen bg-slate-50 lg:pl-64">

            <AdminNavbar />


            <main className="p-4 sm:p-6 lg:p-8">


                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    <div>

                        <button
                            onClick={() =>
                                navigate("/admin/dashboard")
                            }
                            className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
                        >

                            <ArrowLeft size={16} />

                            Back to Dashboard

                        </button>


                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">

                                <CalendarDays size={23} />

                            </div>


                            <div>

                                <h1 className="text-2xl font-bold text-slate-800">
                                    Bookings
                                </h1>

                                <p className="text-sm text-slate-500">
                                    Manage all rental bookings
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* REFRESH */}

                    <button
                        onClick={() =>
                            fetchBookings(
                                search,
                                status
                            )
                        }
                        disabled={loading}
                        className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
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


                {/* ==================================================
                    SEARCH
                ================================================== */}

                <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">

                    <div className="flex items-center gap-2">

                        <Search
                            size={19}
                            className="text-slate-400"
                        />


                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search item, renter or owner..."
                            className="w-full bg-transparent py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                        />


                        {loading && search && (

                            <RefreshCw
                                size={17}
                                className="animate-spin text-blue-500"
                            />

                        )}


                        {search && !loading && (

                            <button
                                onClick={handleClearSearch}
                                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100"
                            >
                                Clear
                            </button>

                        )}

                    </div>

                </div>


                {/* ==================================================
                    STATUS FILTERS
                ================================================== */}

                <div className="mb-6 flex gap-2 overflow-x-auto pb-1">

                    {[
                        ["all", "All"],
                        ["pending", "Pending"],
                        ["accepted", "Accepted"],
                        ["rejected", "Rejected"],
                        ["cancelled", "Cancelled"],
                        ["active", "Active"],
                        ["returned", "Returned"],
                        ["overdue", "Overdue"]
                    ].map(
                        ([value, label]) => (

                            <button
                                key={value}
                                onClick={() =>
                                    handleStatusChange(value)
                                }
                                className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
                                    status === value
                                        ? "bg-blue-600 text-white"
                                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                }`}
                            >

                                {label}

                            </button>

                        )
                    )}

                </div>


                {/* ==================================================
                    BOOKINGS TABLE
                ================================================== */}

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">


                    <div className="border-b border-slate-200 px-5 py-4">

                        <h2 className="font-semibold text-slate-800">
                            Booking Records
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            All rental transactions on the platform
                        </p>

                    </div>


                    {loading ? (

                        <div className="flex min-h-[350px] items-center justify-center">

                            <div className="text-center">

                                <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

                                <p className="mt-3 text-sm text-slate-500">
                                    Loading bookings...
                                </p>

                            </div>

                        </div>

                    ) : bookings.length === 0 ? (

                        <div className="flex min-h-[350px] flex-col items-center justify-center">

                            <CalendarDays
                                size={45}
                                className="text-slate-300"
                            />

                            <h3 className="mt-3 font-semibold text-slate-700">
                                No bookings found
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                No bookings match the selected filters.
                            </p>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[1450px]">

                                <thead className="bg-slate-50">

                                    <tr>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                                            Item
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                                            Renter
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                                            Owner
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                                            Rental Period
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                                            Amount
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                                            Booking
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                                            Payment
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                                            Return
                                        </th>

                                    </tr>

                                </thead>


                                <tbody className="divide-y divide-slate-100">

                                    {bookings.map(
                                        (booking) => (

                                            <tr
                                                key={booking._id}
                                                className="hover:bg-slate-50"
                                            >


                                                {/* ITEM */}

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center gap-3">

                                                        {booking.item?.images?.length > 0 ? (

                                                            <img
                                                                src={
                                                                    booking
                                                                        .item
                                                                        .images[0]
                                                                }
                                                                alt={
                                                                    booking
                                                                        .item
                                                                        .title
                                                                }
                                                                className="h-11 w-11 rounded-lg object-cover"
                                                            />

                                                        ) : (

                                                            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-400">

                                                                <Package size={19} />

                                                            </div>

                                                        )}


                                                        <div>

                                                            <p className="font-semibold text-slate-800">

                                                                {booking.item?.title ||
                                                                    "Unknown Item"}

                                                            </p>

                                                            <p className="text-xs text-slate-400">

                                                                {booking.item?.category ||
                                                                    "N/A"}

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

                                                            <p className="text-sm font-medium text-slate-700">

                                                                {booking.renter?.fullName ||
                                                                    "Unknown"}

                                                            </p>

                                                            <p className="text-xs text-slate-400">

                                                                {booking.renter?.email ||
                                                                    "N/A"}

                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* OWNER */}

                                                <td className="px-5 py-4">

                                                    <div>

                                                        <p className="text-sm font-medium text-slate-700">

                                                            {booking.owner?.fullName ||
                                                                "Unknown"}

                                                        </p>

                                                        <p className="text-xs text-slate-400">

                                                            {booking.owner?.email ||
                                                                "N/A"}

                                                        </p>

                                                    </div>

                                                </td>


                                                {/* RENTAL PERIOD */}

                                                <td className="px-5 py-4">

                                                    <div className="text-sm text-slate-600">

                                                        <p>
                                                            {formatDate(
                                                                booking.startDate
                                                            )}
                                                        </p>

                                                        <p className="text-xs text-slate-400">

                                                            to{" "}

                                                            {formatDate(
                                                                booking.endDate
                                                            )}

                                                        </p>

                                                        <p className="mt-1 text-xs font-medium text-blue-600">

                                                            {booking.totalDays}{" "}
                                                            day
                                                            {booking.totalDays !== 1
                                                                ? "s"
                                                                : ""}

                                                        </p>

                                                    </div>

                                                </td>


                                                {/* AMOUNT */}

                                                <td className="px-5 py-4">

                                                    <p className="font-semibold text-slate-700">

                                                        ₹
                                                        {booking.totalAmount?.toLocaleString(
                                                            "en-IN"
                                                        )}

                                                    </p>

                                                </td>


                                                {/* BOOKING STATUS */}

                                                <td className="px-5 py-4">

                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(
                                                            booking.status
                                                        )}`}
                                                    >

                                                        {booking.status}

                                                    </span>

                                                </td>


                                                {/* PAYMENT */}

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center gap-2">

                                                        <CreditCard
                                                            size={15}
                                                            className="text-slate-400"
                                                        />

                                                        <div>

                                                            <span
                                                                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getPaymentClass(
                                                                    booking.paymentStatus
                                                                )}`}
                                                            >

                                                                {booking.paymentStatus}

                                                            </span>


                                                            {booking.paidAt && (

                                                                <p className="mt-1 text-xs text-slate-400">

                                                                    {formatDate(
                                                                        booking.paidAt
                                                                    )}

                                                                </p>

                                                            )}

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* RETURN */}

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center gap-2">

                                                        <RotateCcw
                                                            size={15}
                                                            className="text-slate-400"
                                                        />

                                                        <div>

                                                            <span
                                                                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getReturnClass(
                                                                    booking.returnStatus
                                                                )}`}
                                                            >

                                                                {booking.returnStatus}

                                                            </span>


                                                            {booking.returnedAt && (

                                                                <p className="mt-1 text-xs text-slate-400">

                                                                    {formatDate(
                                                                        booking.returnedAt
                                                                    )}

                                                                </p>

                                                            )}

                                                        </div>

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

            </main>

        </div>
    );
}


export default AdminBookings;
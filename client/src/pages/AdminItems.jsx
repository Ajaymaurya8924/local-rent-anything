import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Search,
    Package,
    RefreshCw,
    ArrowLeft,
    MapPin,
    User,
    IndianRupee
} from "lucide-react";

import AdminNavbar from "../components/AdminNavbar";
import api from "../api/axios";
import { toast } from "react-hot-toast";


function AdminItems() {

    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    // ============================================================
    // PREVENT DUPLICATE INITIAL SEARCH REQUEST
    // ============================================================
    // Initial fetchItems() already runs when the page loads.
    // This ref prevents the search useEffect from making
    // another API request immediately on first render.
    // ============================================================

    const isFirstSearchRender = useRef(true);


    // ============================================================
    // FETCH ITEMS
    // ============================================================

    const fetchItems = async (searchValue = "") => {

        try {

            setLoading(true);

            const response = await api.get(
                "/admin/dashboard/items",
                {
                    params: {
                        search: searchValue
                    }
                }
            );

            setItems(
                response?.data?.data?.items || []
            );

        } catch (error) {

            console.error(
                "Fetch admin items error:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Failed to load items"
            );

        } finally {

            setLoading(false);
        }
    };


    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {

        fetchItems();

    }, []);


    // ============================================================
    // LIVE SEARCH
    // ============================================================
    //
    // 300ms debounce.
    //
    // IMPORTANT:
    // The first render is skipped because initial load
    // is already handled above.
    //
    // User types:
    //
    // "C"
    //    ↓
    // wait 300ms
    //    ↓
    // API search
    //
    // If user types again before 300ms,
    // previous timer is cancelled.
    // ============================================================

    useEffect(() => {

        // Skip first render
        if (isFirstSearchRender.current) {

            isFirstSearchRender.current = false;

            return;
        }


        const timer = setTimeout(() => {

            fetchItems(search.trim());

        }, 300);


        return () => clearTimeout(timer);

    }, [search]);


    // ============================================================
    // CLEAR SEARCH
    // ============================================================

    const handleClearSearch = () => {

        setSearch("");
    };


    // ============================================================
    // FORMAT DATE
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


    return (

        <div className="min-h-screen bg-slate-50 lg:pl-64">

            <AdminNavbar />


            <main className="p-4 sm:p-6 lg:p-8">


                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

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

                                <Package size={23} />

                            </div>


                            <div>

                                <h1 className="text-2xl font-bold text-slate-800">
                                    Items
                                </h1>

                                <p className="text-sm text-slate-500">
                                    Manage all listed rental items
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* REFRESH */}

                    <button
                        onClick={() =>
                            fetchItems(search.trim())
                        }
                        disabled={loading}
                        className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
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
                    LIVE SEARCH
                ================================================== */}

                <div className="mb-6 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">

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
                            placeholder="Search by title, category, city or state..."
                            className="w-full bg-transparent py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                        />


                        {/* SEARCHING INDICATOR */}

                        {loading && search && (

                            <RefreshCw
                                size={17}
                                className="animate-spin text-blue-500"
                            />

                        )}


                        {/* CLEAR */}

                        {search && !loading && (

                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100"
                            >
                                Clear
                            </button>

                        )}

                    </div>

                </div>


                {/* ==================================================
                    ITEMS
                ================================================== */}

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">


                    <div className="border-b border-slate-200 px-5 py-4">

                        <h2 className="font-semibold text-slate-800">
                            Listed Items
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            All items available on the platform
                        </p>

                    </div>


                    {loading ? (

                        <div className="flex min-h-[300px] items-center justify-center">

                            <div className="text-center">

                                <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

                                <p className="mt-3 text-sm text-slate-500">
                                    Loading items...
                                </p>

                            </div>

                        </div>

                    ) : items.length === 0 ? (

                        <div className="flex min-h-[300px] flex-col items-center justify-center">

                            <Package
                                size={45}
                                className="text-slate-300"
                            />

                            <h3 className="mt-3 font-semibold text-slate-700">
                                No items found
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                No rental items match your search.
                            </p>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[1100px]">

                                <thead className="bg-slate-50">

                                    <tr>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                                            Item
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                                            Category
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                                            Owner
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                                            Rent / Day
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                                            Location
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                                            Status
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                                            Added
                                        </th>

                                    </tr>

                                </thead>


                                <tbody className="divide-y divide-slate-100">

                                    {items.map((item) => (

                                        <tr
                                            key={item._id}
                                            className="hover:bg-slate-50"
                                        >


                                            {/* ITEM */}

                                            <td className="px-5 py-4">

                                                <div className="flex items-center gap-3">

                                                    {item.images?.length > 0 ? (

                                                        <img
                                                            src={item.images[0]}
                                                            alt={item.title}
                                                            className="h-12 w-12 rounded-lg object-cover"
                                                        />

                                                    ) : (

                                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-400">

                                                            <Package size={20} />

                                                        </div>

                                                    )}


                                                    <div>

                                                        <p className="font-semibold text-slate-800">
                                                            {item.title}
                                                        </p>

                                                        <p className="max-w-[220px] truncate text-xs text-slate-400">
                                                            {item.description}
                                                        </p>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* CATEGORY */}

                                            <td className="px-5 py-4">

                                                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">

                                                    {item.category}

                                                </span>

                                            </td>


                                            {/* OWNER */}

                                            <td className="px-5 py-4">

                                                <div className="flex items-center gap-2">

                                                    <User
                                                        size={16}
                                                        className="text-slate-400"
                                                    />


                                                    <div>

                                                        <p className="text-sm font-medium text-slate-700">
                                                            {item.owner?.fullName || "Unknown"}
                                                        </p>

                                                        <p className="text-xs text-slate-400">
                                                            {item.owner?.email || "N/A"}
                                                        </p>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* PRICE */}

                                            <td className="px-5 py-4">

                                                <div className="flex items-center gap-1 font-semibold text-slate-700">

                                                    <IndianRupee size={14} />

                                                    {item.pricePerDay}

                                                </div>


                                                <p className="text-xs text-slate-400">
                                                    Deposit: ₹{item.securityDeposit || 0}
                                                </p>

                                            </td>


                                            {/* LOCATION */}

                                            <td className="px-5 py-4">

                                                <div className="flex items-center gap-2 text-sm text-slate-600">

                                                    <MapPin
                                                        size={15}
                                                        className="text-slate-400"
                                                    />

                                                    {item.city}, {item.state}

                                                </div>

                                            </td>


                                            {/* STATUS */}

                                            <td className="px-5 py-4">

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                        item.isAvailable
                                                            ? "bg-green-50 text-green-600"
                                                            : "bg-red-50 text-red-600"
                                                    }`}
                                                >

                                                    {item.isAvailable
                                                        ? "Available"
                                                        : "Unavailable"}

                                                </span>

                                            </td>


                                            {/* DATE */}

                                            <td className="px-5 py-4 text-sm text-slate-500">

                                                {formatDate(
                                                    item.createdAt
                                                )}

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </main>

        </div>
    );
}


export default AdminItems;
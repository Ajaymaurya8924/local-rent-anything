import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Search,
    Users,
    Mail,
    Phone,
    MapPin,
    Calendar,
    ArrowLeft,
    RefreshCw,
    User
} from "lucide-react";

import AdminNavbar from "../components/AdminNavbar";
import api from "../api/axios";
import { toast } from "react-hot-toast";


function AdminUsers() {

    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");


    // ============================================================
    // PREVENT DUPLICATE INITIAL SEARCH REQUEST
    // ============================================================
    // Initial fetchUsers() already runs when the page loads.
    // This ref prevents the search useEffect from making another
    // API request immediately on the first render.
    // ============================================================

    const isFirstSearchRender = useRef(true);


    // ============================================================
    // FETCH USERS
    // ============================================================

    const fetchUsers = async (searchValue = "") => {

        try {

            setLoading(true);

            const response = await api.get(
                "/admin/dashboard/users",
                {
                    params: {
                        search: searchValue
                    }
                }
            );

            const userList =
                response?.data?.data?.users ||
                response?.data?.users ||
                [];

            setUsers(userList);

        } catch (error) {

            console.error(
                "Fetch admin users error:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Failed to load users"
            );

        } finally {

            setLoading(false);
        }
    };


    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {

        fetchUsers();

    }, []);


    // ============================================================
    // LIVE SEARCH
    // ============================================================
    //
    // User types:
    // A    → wait 300ms → search
    // Aj   → wait 300ms → search
    // Ajay → wait 300ms → search
    //
    // First render is skipped because initial load is already
    // handled by the effect above.
    //
    // Debounce prevents API request on every single keystroke.
    // ============================================================

    useEffect(() => {

        // Skip first render

        if (isFirstSearchRender.current) {

            isFirstSearchRender.current = false;

            return;
        }


        const timer = setTimeout(() => {

            fetchUsers(search.trim());

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

            {/* Admin Sidebar */}

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
                            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
                        >

                            <ArrowLeft size={16} />

                            Back to Dashboard

                        </button>


                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">

                                <Users size={23} />

                            </div>


                            <div>

                                <h1 className="text-2xl font-bold text-slate-800">
                                    Users
                                </h1>

                                <p className="text-sm text-slate-500">
                                    Manage registered users
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* REFRESH */}

                    <button
                        onClick={() =>
                            fetchUsers(search.trim())
                        }
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
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
                    SEARCH + TOTAL
                ================================================== */}

                <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto]">


                    {/* LIVE SEARCH */}

                    <div className="flex rounded-xl border border-slate-200 bg-white p-2 shadow-sm">

                        <div className="flex flex-1 items-center gap-2 px-2">

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
                                placeholder="Search by name, email, city or state..."
                                className="w-full bg-transparent py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                            />

                        </div>


                        {/* SEARCHING INDICATOR */}

                        {loading && search && (

                            <div className="flex items-center px-3">

                                <RefreshCw
                                    size={16}
                                    className="animate-spin text-blue-500"
                                />

                            </div>

                        )}


                        {/* CLEAR */}

                        {search && !loading && (

                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="mr-1 rounded-lg px-3 text-sm font-medium text-slate-500 hover:bg-slate-100"
                            >
                                Clear
                            </button>

                        )}

                    </div>


                    {/* TOTAL USERS */}

                    <div className="flex min-w-[180px] items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">

                            <Users size={20} />

                        </div>


                        <div>

                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Total Users
                            </p>

                            <p className="text-xl font-bold text-slate-800">
                                {users.length}
                            </p>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    USERS TABLE
                ================================================== */}

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">


                    <div className="border-b border-slate-200 px-5 py-4">

                        <h2 className="font-semibold text-slate-800">
                            Registered Users
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            All normal users registered on the platform
                        </p>

                    </div>


                    {loading ? (

                        <div className="flex min-h-[300px] items-center justify-center">

                            <div className="text-center">

                                <div className="mx-auto mb-3 h-9 w-9 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

                                <p className="text-sm text-slate-500">
                                    Loading users...
                                </p>

                            </div>

                        </div>

                    ) : users.length === 0 ? (

                        <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">

                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">

                                <User size={27} />

                            </div>


                            <h3 className="font-semibold text-slate-700">
                                No users found
                            </h3>


                            <p className="mt-1 text-sm text-slate-500">
                                Try changing your search or check again later.
                            </p>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[900px]">

                                <thead className="bg-slate-50">

                                    <tr>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            User
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Contact
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Location
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Role
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Joined
                                        </th>

                                    </tr>

                                </thead>


                                <tbody className="divide-y divide-slate-100">

                                    {users.map((user) => (

                                        <tr
                                            key={user._id}
                                            className="transition hover:bg-slate-50"
                                        >


                                            {/* USER */}

                                            <td className="px-5 py-4">

                                                <div className="flex items-center gap-3">

                                                    {user.profileImage ? (

                                                        <img
                                                            src={user.profileImage}
                                                            alt={user.fullName}
                                                            className="h-10 w-10 rounded-full object-cover"
                                                        />

                                                    ) : (

                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">

                                                            {user.fullName
                                                                ?.charAt(0)
                                                                ?.toUpperCase() ||
                                                                "U"}

                                                        </div>

                                                    )}


                                                    <div>

                                                        <p className="font-semibold text-slate-800">
                                                            {user.fullName || "Unknown User"}
                                                        </p>

                                                        <p className="text-xs text-slate-400">
                                                            ID: {user._id}
                                                        </p>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* CONTACT */}

                                            <td className="px-5 py-4">

                                                <div className="space-y-1">

                                                    <div className="flex items-center gap-2 text-sm text-slate-600">

                                                        <Mail
                                                            size={14}
                                                            className="text-slate-400"
                                                        />

                                                        {user.email || "N/A"}

                                                    </div>


                                                    <div className="flex items-center gap-2 text-sm text-slate-500">

                                                        <Phone
                                                            size={14}
                                                            className="text-slate-400"
                                                        />

                                                        {user.phone || "N/A"}

                                                    </div>

                                                </div>

                                            </td>


                                            {/* LOCATION */}

                                            <td className="px-5 py-4">

                                                <div className="flex items-center gap-2 text-sm text-slate-600">

                                                    <MapPin
                                                        size={15}
                                                        className="text-slate-400"
                                                    />

                                                    <span>

                                                        {user.city || user.state
                                                            ? `${user.city || ""}${user.city && user.state ? ", " : ""}${user.state || ""}`
                                                            : "N/A"}

                                                    </span>

                                                </div>

                                            </td>


                                            {/* ROLE */}

                                            <td className="px-5 py-4">

                                                <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-600">

                                                    {user.role || "user"}

                                                </span>

                                            </td>


                                            {/* JOINED */}

                                            <td className="px-5 py-4">

                                                <div className="flex items-center gap-2 text-sm text-slate-600">

                                                    <Calendar
                                                        size={15}
                                                        className="text-slate-400"
                                                    />

                                                    {formatDate(
                                                        user.createdAt
                                                    )}

                                                </div>

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


export default AdminUsers;
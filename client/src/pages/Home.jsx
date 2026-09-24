import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiSearch,
    FiPlus,
    FiMapPin,
    FiStar,
    FiArrowRight,
    FiShield,
    FiDollarSign
} from "react-icons/fi";

import Navbar from "../components/Navbar";
import { getCurrentUser } from "../services/authService";
import { getAllItems } from "../services/itemService";

function Home() {
    const [user, setUser] = useState(null);
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // Load user and available items together.
    useEffect(() => {
        const loadHomeData = async () => {
            try {
                const [userResponse, itemsResponse] =
                    await Promise.all([
                        getCurrentUser(),
                        getAllItems()
                    ]);

                setUser(userResponse?.data?.user);
                setItems(itemsResponse?.data?.items || []);
            } catch (error) {
                console.error("Home data loading failed:", error);
            } finally {
                setLoading(false);
            }
        };

        loadHomeData();
    }, []);

    // Send the user to Explore with the entered search text.
    const handleSearch = (e) => {
        e.preventDefault();

        const value = search.trim();

        if (value) {
            navigate(`/items?search=${encodeURIComponent(value)}`);
        } else {
            navigate("/items");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <Navbar />

            {/* ================= HERO ================= */}
            <section className="relative overflow-hidden bg-slate-950">
                <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
                <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                    <div className="grid items-center gap-12 lg:grid-cols-2">

                        {/* Hero Content */}
                        <div>
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-blue-200 backdrop-blur">
                                <span className="h-2 w-2 rounded-full bg-green-400" />
                                Your local rental marketplace
                            </div>

                            <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                                Rent what you need.
                                <span className="block text-blue-400">
                                    Earn from what you own.
                                </span>
                            </h1>

                            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                                Find useful items around you, rent them for
                                exactly the time you need, or list your own
                                items and earn extra income.
                            </p>

                            {/* Smart Search */}
                            <form
                                onSubmit={handleSearch}
                                className="mt-8 flex max-w-2xl flex-col gap-3 rounded-2xl bg-white p-2 shadow-2xl sm:flex-row"
                            >
                                <div className="flex flex-1 items-center gap-3 px-3">
                                    <FiSearch
                                        size={22}
                                        className="text-slate-400"
                                    />

                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Search items, categories or locations..."
                                        className="w-full bg-transparent py-3 text-sm text-slate-800 outline-none sm:text-base"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                                >
                                    Search
                                </button>
                            </form>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <button
                                    onClick={() => navigate("/items")}
                                    className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
                                >
                                    Explore Items
                                    <FiArrowRight />
                                </button>

                                <button
                                    onClick={() => navigate("/add-item")}
                                    className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                                >
                                    <FiPlus />
                                    List Your Item
                                </button>
                            </div>
                        </div>

                        {/* Hero Visual */}
                        <div className="hidden lg:block">
                            <div className="relative mx-auto max-w-md">
                                <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur">
                                    <div className="rounded-3xl bg-white p-5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-slate-500">
                                                    Welcome back
                                                </p>
                                                <h3 className="mt-1 text-xl font-bold">
                                                    {user?.fullName?.split(" ")[0] ||
                                                        "User"}{" "}
                                                    👋
                                                </h3>
                                            </div>

                                            <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
                                                <FiSearch size={24} />
                                            </div>
                                        </div>

                                        <div className="mt-6 grid grid-cols-2 gap-4">
                                            <div className="rounded-2xl bg-slate-50 p-5">
                                                <FiMapPin
                                                    className="text-blue-600"
                                                    size={24}
                                                />
                                                <p className="mt-3 text-sm font-bold">
                                                    Rent Locally
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    Find items nearby
                                                </p>
                                            </div>

                                            <div className="rounded-2xl bg-slate-50 p-5">
                                                <FiDollarSign
                                                    className="text-green-600"
                                                    size={24}
                                                />
                                                <p className="mt-3 text-sm font-bold">
                                                    Earn Money
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    List unused items
                                                </p>
                                            </div>

                                            <div className="rounded-2xl bg-slate-50 p-5">
                                                <FiShield
                                                    className="text-purple-600"
                                                    size={24}
                                                />
                                                <p className="mt-3 text-sm font-bold">
                                                    Secure
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    Safe booking flow
                                                </p>
                                            </div>

                                            <div className="rounded-2xl bg-slate-50 p-5">
                                                <FiStar
                                                    className="text-yellow-500"
                                                    size={24}
                                                />
                                                <p className="mt-3 text-sm font-bold">
                                                    Reviews
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    Rent with confidence
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= AVAILABLE ITEMS ================= */}
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

                <div className="mb-8 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                            Discover
                        </p>

                        <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
                            Popular rental items
                        </h2>

                        <p className="mt-2 text-slate-500">
                            Explore useful things available from local owners.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/items")}
                        className="hidden items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-blue-600 transition hover:bg-blue-50 sm:flex"
                    >
                        View all
                        <FiArrowRight />
                    </button>
                </div>

                {loading ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-80 animate-pulse rounded-2xl bg-slate-200"
                            />
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                        <div className="text-5xl">📦</div>

                        <h3 className="mt-4 text-xl font-bold">
                            No items available yet
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Be the first person to add an item.
                        </p>

                        <button
                            onClick={() => navigate("/add-item")}
                            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                        >
                            Add Your Item
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {items.slice(0, 8).map((item) => (
                            <div
                                key={item._id}
                                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="relative h-52 overflow-hidden bg-slate-100">
                                    {item.images?.length > 0 ? (
                                        <img
                                            src={item.images[0]}
                                            alt={item.title}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-5xl">
                                            📦
                                        </div>
                                    )}

                                    <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow">
                                        {item.category}
                                    </div>
                                </div>

                                <div className="p-5">
                                    <h3 className="truncate text-lg font-bold">
                                        {item.title}
                                    </h3>

                                    <div className="mt-2 flex items-center gap-1 text-sm">
                                        <FiStar
                                            size={15}
                                            className="text-yellow-400"
                                            fill="currentColor"
                                        />

                                        <span className="font-semibold">
                                            {item.averageRating
                                                ? Number(
                                                      item.averageRating
                                                  ).toFixed(1)
                                                : "0.0"}
                                        </span>

                                        <span className="text-slate-400">
                                            ({item.totalReviews || 0})
                                        </span>
                                    </div>

                                    <div className="mt-3 flex items-center gap-1 text-sm text-slate-500">
                                        <FiMapPin size={14} />
                                        <span className="truncate">
                                            {item.city}
                                            {item.state
                                                ? `, ${item.state}`
                                                : ""}
                                        </span>
                                    </div>

                                    <div className="mt-5 flex items-end justify-between">
                                        <div>
                                            <span className="text-xl font-black">
                                                ₹{item.pricePerDay}
                                            </span>
                                            <span className="text-sm text-slate-500">
                                                /day
                                            </span>
                                        </div>

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/items/${item._id}`
                                                )
                                            }
                                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* ================= WHY US ================= */}
            <section className="border-y border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                            Why choose us
                        </p>

                        <h2 className="mt-2 text-3xl font-black">
                            Everything you need to rent locally
                        </h2>

                        <p className="mt-3 text-slate-500">
                            Simple discovery, secure bookings and transparent
                            rental experiences.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-6 md:grid-cols-3">
                        {[
                            {
                                icon: <FiMapPin size={25} />,
                                title: "Rent Locally",
                                text: "Find useful items available around your location."
                            },
                            {
                                icon: <FiShield size={25} />,
                                title: "Secure Booking",
                                text: "Request, accept and pay through one platform."
                            },
                            {
                                icon: <FiDollarSign size={25} />,
                                title: "Earn From Items",
                                text: "Turn your unused items into extra income."
                            }
                        ].map((feature) => (
                            <div
                                key={feature.title}
                                className="rounded-2xl border border-slate-200 bg-slate-50 p-7 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                    {feature.icon}
                                </div>

                                <h3 className="mt-5 text-lg font-bold">
                                    {feature.title}
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    {feature.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= MOBILE VIEW ALL ================= */}
            <div className="px-4 py-6 sm:hidden">
                <button
                    onClick={() => navigate("/items")}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 font-semibold text-white"
                >
                    Explore All Items
                    <FiArrowRight />
                </button>
            </div>
        </div>
    );
}

export default Home;
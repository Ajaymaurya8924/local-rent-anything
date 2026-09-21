import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiPlus, FiMapPin, FiStar } from "react-icons/fi";

import Navbar from "../components/Navbar";
import { getCurrentUser } from "../services/authService";
import { getAllItems } from "../services/itemService";

function Home() {
    const [user, setUser] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // Fetch logged-in user and available items
    useEffect(() => {
        const loadHomeData = async () => {
            try {
                const [userResponse, itemsResponse] =
                    await Promise.all([
                        getCurrentUser(),
                        getAllItems()
                    ]);

                setUser(userResponse?.data?.user);

                // Backend returns items inside data.items
                setItems(itemsResponse?.data?.items || []);
            } catch (error) {
                console.error("Home data loading failed:", error);
            } finally {
                setLoading(false);
            }
        };

        loadHomeData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* ================= HERO SECTION ================= */}
            <section className="bg-white">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="grid items-center gap-10 lg:grid-cols-2">

                        <div>
                            <p className="mb-3 font-semibold text-blue-600">
                                Local Rent Anything
                            </p>

                            <h1 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
                                Welcome back,{" "}
                                <span className="text-blue-600">
                                    {user?.fullName?.split(" ")[0] || "User"}
                                </span>
                                👋
                            </h1>

                            <p className="mt-5 max-w-xl text-lg leading-8 text-gray-500">
                                Find useful items near you, rent them easily,
                                or earn money by renting out things you own.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-4">
                                <button
                                    onClick={() => navigate("/items")}
                                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-700"
                                >
                                    <FiSearch size={18} />
                                    Explore Items
                                </button>

                                <button
                                    onClick={() => navigate("/add-item")}
                                    className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 font-semibold text-gray-700 transition hover:bg-gray-100"
                                >
                                    <FiPlus size={18} />
                                    Add Your Item
                                </button>
                            </div>
                        </div>

                        {/* Hero visual */}
                        <div className="rounded-3xl bg-blue-50 p-8">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-2xl bg-white p-6 shadow-sm">
                                    <div className="text-4xl">🔍</div>
                                    <h3 className="mt-3 font-bold text-gray-900">
                                        Find Anything
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Discover useful items available nearby.
                                    </p>
                                </div>

                                <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
                                    <div className="text-4xl">📦</div>
                                    <h3 className="mt-3 font-bold text-gray-900">
                                        Rent Easily
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Book items for the dates you need.
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-white p-6 shadow-sm">
                                    <div className="text-4xl">💰</div>
                                    <h3 className="mt-3 font-bold text-gray-900">
                                        Earn Money
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Rent out your unused items.
                                    </p>
                                </div>

                                <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
                                    <div className="text-4xl">⭐</div>
                                    <h3 className="mt-3 font-bold text-gray-900">
                                        Trusted Reviews
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Check ratings before renting.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= AVAILABLE ITEMS ================= */}
            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

                <div className="mb-7 flex items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Available Items
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Explore items available for rent.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/items")}
                        className="font-semibold text-blue-600 hover:text-blue-700"
                    >
                        View All →
                    </button>
                </div>

                {loading ? (
                    <div className="py-16 text-center text-gray-500">
                        Loading items...
                    </div>
                ) : items.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
                        <div className="text-5xl">📦</div>

                        <h3 className="mt-4 text-xl font-bold text-gray-900">
                            No items available yet
                        </h3>

                        <p className="mt-2 text-gray-500">
                            Be the first person to add an item.
                        </p>

                        <button
                            onClick={() => navigate("/add-item")}
                            className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                        >
                            Add Your Item
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {items.slice(0, 8).map((item) => (
                            <div
                                key={item._id}
                                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >
                                {/* Item image */}
                                <div className="h-48 overflow-hidden bg-gray-100">
                                    {item.images?.length > 0 ? (
                                        <img
                                            src={item.images[0]}
                                            alt={item.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-5xl">
                                            📦
                                        </div>
                                    )}
                                </div>

                                <div className="p-5">
                                    <h3 className="truncate text-lg font-bold text-gray-900">
                                        {item.title}
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-500">
                                        {item.category}
                                    </p>

                                    {/* Rating */}
                                    <div className="mt-3 flex items-center gap-2">
                                        <div className="flex text-yellow-400">
                                            {Array.from({
                                                length: 5
                                            }).map((_, index) => (
                                                <FiStar
                                                    key={index}
                                                    size={15}
                                                    fill={
                                                        index <
                                                        Math.round(
                                                            item.averageRating || 0
                                                        )
                                                            ? "currentColor"
                                                            : "none"
                                                    }
                                                />
                                            ))}
                                        </div>

                                        <span className="text-xs text-gray-500">
                                            {item.averageRating
                                                ? Number(
                                                      item.averageRating
                                                  ).toFixed(1)
                                                : "0.0"}{" "}
                                            ({item.totalReviews || 0})
                                        </span>
                                    </div>

                                    {/* Location */}
                                    <div className="mt-3 flex items-center gap-1 text-sm text-gray-500">
                                        <FiMapPin size={15} />

                                        <span className="truncate">
                                            {item.city}
                                            {item.state
                                                ? `, ${item.state}`
                                                : ""}
                                        </span>
                                    </div>

                                    {/* Price + details */}
                                    <div className="mt-4 flex items-center justify-between">
                                        <div>
                                            <span className="text-xl font-bold text-gray-900">
                                                ₹{item.pricePerDay}
                                            </span>

                                            <span className="text-sm text-gray-500">
                                                /day
                                            </span>
                                        </div>

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/items/${item._id}`
                                                )
                                            }
                                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
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

            {/* ================= WHY SECTION ================= */}
            <section className="border-t border-gray-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Why Local Rent Anything?
                        </h2>

                        <p className="mx-auto mt-2 max-w-2xl text-gray-500">
                            A simple way to rent useful things from people
                            around you.
                        </p>
                    </div>

                    <div className="mt-8 grid gap-6 sm:grid-cols-3">
                        <div className="rounded-2xl border border-gray-100 p-6 text-center">
                            <div className="text-4xl">📍</div>
                            <h3 className="mt-3 font-bold text-gray-900">
                                Rent Locally
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Find items available in your area.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-gray-100 p-6 text-center">
                            <div className="text-4xl">🔒</div>
                            <h3 className="mt-3 font-bold text-gray-900">
                                Secure Booking
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Request, accept and pay through the platform.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-gray-100 p-6 text-center">
                            <div className="text-4xl">💸</div>
                            <h3 className="mt-3 font-bold text-gray-900">
                                Earn From Items
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Turn unused items into extra income.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
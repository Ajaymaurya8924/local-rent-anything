import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
    FiSearch,
    FiMapPin,
    FiStar,
    FiX,
    FiSliders
} from "react-icons/fi";

import Navbar from "../components/Navbar";
import { getAllItems } from "../services/itemService";

function Items() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [items, setItems] = useState([]);
    const [search, setSearch] = useState(
        searchParams.get("search") || ""
    );
    const [loading, setLoading] = useState(true);

    // Load all items once. Search is handled locally so one search box
    // can search across title, category, location and description.
    useEffect(() => {
        const fetchItems = async () => {
            try {
                setLoading(true);

                const response = await getAllItems();

                setItems(response?.data?.items || []);
            } catch (error) {
                console.error("Failed to load items:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    // Keep URL search value in sync with the search box.
    const handleSearch = (e) => {
        e.preventDefault();

        const value = search.trim();

        if (value) {
            setSearchParams({ search: value });
        } else {
            setSearchParams({});
        }
    };

    // Clear the search.
    const clearSearch = () => {
        setSearch("");
        setSearchParams({});
    };

    // Smart search across multiple item fields.
    const filteredItems = items.filter((item) => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return true;
        }

        const searchableText = [
            item.title,
            item.category,
            item.city,
            item.state,
            item.description
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        return searchableText.includes(query);
    });

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

                {/* ================= HEADER ================= */}
                <div className="mb-8">
                    <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                        Marketplace
                    </p>

                    <div className="mt-1 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                                Explore Items
                            </h1>

                            <p className="mt-2 text-slate-500">
                                Find anything you need from local owners.
                            </p>
                        </div>

                        <div className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
                            {filteredItems.length}{" "}
                            {filteredItems.length === 1
                                ? "item"
                                : "items"}{" "}
                            found
                        </div>
                    </div>
                </div>

                {/* ================= SINGLE SMART SEARCH ================= */}
                <form
                    onSubmit={handleSearch}
                    className="mb-8 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
                >
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <div className="flex flex-1 items-center gap-3 px-3">
                            <FiSearch
                                size={22}
                                className="flex-shrink-0 text-slate-400"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search by item, category, city or description..."
                                className="w-full bg-transparent py-3 text-sm outline-none sm:text-base"
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                >
                                    <FiX size={18} />
                                </button>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
                        >
                            <FiSearch size={17} />
                            Search
                        </button>
                    </div>

                    <div className="flex items-center gap-2 px-3 pb-2 pt-1 text-xs text-slate-400">
                        <FiSliders size={14} />
                        Search across item name, category, location and description
                    </div>
                </form>

                {/* ================= LOADING ================= */}
                {loading ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-96 animate-pulse rounded-2xl bg-slate-200"
                            />
                        ))}
                    </div>
                ) : filteredItems.length === 0 ? (
                    /* ================= EMPTY ================= */
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
                            🔍
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-slate-900">
                            No items found
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                            Try another item name, category, city or search
                            term.
                        </p>

                        {search && (
                            <button
                                onClick={clearSearch}
                                className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-600"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                ) : (
                    /* ================= ITEMS ================= */
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredItems.map((item) => {
                            const rating = Math.round(
                                item.averageRating || 0
                            );

                            return (
                                <div
                                    key={item._id}
                                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                                >
                                    {/* Image */}
                                    <div className="relative h-56 overflow-hidden bg-slate-100">
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

                                        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-700 shadow">
                                            {item.category}
                                        </div>

                                        <div
                                            className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold shadow ${
                                                item.isAvailable
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {item.isAvailable
                                                ? "Available"
                                                : "Unavailable"}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <h2 className="truncate text-lg font-bold text-slate-900">
                                            {item.title}
                                        </h2>

                                        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
                                            {item.description}
                                        </p>

                                        {/* Rating */}
                                        <div className="mt-4 flex items-center gap-2">
                                            <div className="flex">
                                                {Array.from({
                                                    length: 5
                                                }).map((_, index) => (
                                                    <FiStar
                                                        key={index}
                                                        size={15}
                                                        className={
                                                            index < rating
                                                                ? "text-yellow-400"
                                                                : "text-slate-300"
                                                        }
                                                        fill={
                                                            index < rating
                                                                ? "currentColor"
                                                                : "none"
                                                        }
                                                    />
                                                ))}
                                            </div>

                                            <span className="text-xs font-semibold text-slate-500">
                                                {item.averageRating
                                                    ? Number(
                                                          item.averageRating
                                                      ).toFixed(1)
                                                    : "0.0"}{" "}
                                                ({item.totalReviews || 0})
                                            </span>
                                        </div>

                                        {/* Location */}
                                        <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                                            <FiMapPin
                                                size={15}
                                                className="flex-shrink-0"
                                            />

                                            <span className="truncate">
                                                {item.city}
                                                {item.state
                                                    ? `, ${item.state}`
                                                    : ""}
                                            </span>
                                        </div>

                                        {/* Bottom */}
                                        <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-4">
                                            <div>
                                                <p className="text-xs text-slate-400">
                                                    Rental price
                                                </p>

                                                <p className="mt-1">
                                                    <span className="text-xl font-black text-slate-900">
                                                        ₹
                                                        {
                                                            item.pricePerDay
                                                        }
                                                    </span>

                                                    <span className="text-sm text-slate-500">
                                                        /day
                                                    </span>
                                                </p>
                                            </div>

                                            <Link
                                                to={`/items/${item._id}`}
                                                className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Items;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Search,
    RefreshCw,
    Star,
    ArrowLeft,
    User,
    Package,
    Calendar,
    MessageSquare
} from "lucide-react";

import AdminNavbar from "../components/AdminNavbar";
import api from "../api/axios";
import toast from "react-hot-toast";


function AdminReviews() {
    const navigate = useNavigate();

    const [reviews, setReviews] = useState([]);

    const [search, setSearch] = useState("");

    const [rating, setRating] =
        useState("all");

    const [loading, setLoading] =
        useState(true);


    // =====================================================
    // FETCH REVIEWS
    // =====================================================

    const fetchReviews = async (
        searchValue = search,
        ratingValue = rating
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
                ratingValue &&
                ratingValue !== "all"
            ) {

                params.append(
                    "rating",
                    ratingValue
                );
            }

            const response =
                await api.get(
                    `/admin/dashboard/reviews?${params.toString()}`
                );

            const data =
                response?.data?.data;

            setReviews(
                data?.reviews || []
            );

        } catch (error) {

            console.error(
                "Admin Reviews Error:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Failed to load reviews"
            );

        } finally {

            setLoading(false);
        }
    };


    // Initial load
    useEffect(() => {

        fetchReviews("", "all");

    }, []);


    // Live search
    useEffect(() => {

        const timer =
            setTimeout(() => {

                fetchReviews(
                    search,
                    rating
                );

            }, 300);

        return () =>
            clearTimeout(timer);

    }, [search]);


    // Rating filter
    const handleRatingChange = (
        value
    ) => {

        setRating(value);

        fetchReviews(
            search,
            value
        );
    };


    // Refresh
    const handleRefresh = () => {

        fetchReviews(
            search,
            rating
        );
    };


    // Clear search
    const clearSearch = () => {

        setSearch("");
    };


    // Format date
    const formatDate = (date) => {

        if (!date) return "—";

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };


    // Render stars
    const renderStars = (
        ratingValue
    ) => {

        return (
            <div className="flex items-center gap-0.5">

                {[1, 2, 3, 4, 5].map(
                    (star) => (

                        <Star
                            key={star}
                            size={15}
                            className={
                                star <= ratingValue
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-slate-300"
                            }
                        />

                    )
                )}

            </div>
        );
    };


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

                                <div className="rounded-xl bg-yellow-50 p-3">

                                    <Star
                                        size={24}
                                        className="fill-yellow-400 text-yellow-500"
                                    />

                                </div>

                                <div>

                                    <h1 className="text-2xl font-bold text-slate-900">
                                        Reviews
                                    </h1>

                                    <p className="text-sm text-slate-500">
                                        Monitor customer reviews and ratings
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
                        SUMMARY
                    ================================================= */}

                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                        {/* Total Reviews */}
                        <div className="rounded-xl border border-slate-200 bg-white p-5">

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-sm font-medium text-slate-500">
                                        Total Reviews
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-slate-900">
                                        {reviews.length}
                                    </p>

                                </div>

                                <div className="rounded-lg bg-blue-50 p-3">

                                    <MessageSquare
                                        size={22}
                                        className="text-blue-600"
                                    />

                                </div>

                            </div>

                        </div>


                        {/* 5 Star */}
                        <div className="rounded-xl border border-slate-200 bg-white p-5">

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-sm font-medium text-slate-500">
                                        5 Star Reviews
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-yellow-500">
                                        {
                                            reviews.filter(
                                                (review) =>
                                                    review.rating === 5
                                            ).length
                                        }
                                    </p>

                                </div>

                                <div className="rounded-lg bg-yellow-50 p-3">

                                    <Star
                                        size={22}
                                        className="fill-yellow-400 text-yellow-400"
                                    />

                                </div>

                            </div>

                        </div>


                        {/* Average */}
                        <div className="rounded-xl border border-slate-200 bg-white p-5">

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-sm font-medium text-slate-500">
                                        Average Rating
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-slate-900">

                                        {reviews.length
                                            ? (
                                                reviews.reduce(
                                                    (sum, review) =>
                                                        sum +
                                                        Number(
                                                            review.rating || 0
                                                        ),
                                                    0
                                                ) /
                                                reviews.length
                                            ).toFixed(1)
                                            : "0.0"}

                                        <span className="ml-1 text-base font-medium text-slate-400">
                                            / 5
                                        </span>

                                    </p>

                                </div>

                                <div className="rounded-lg bg-emerald-50 p-3">

                                    <Star
                                        size={22}
                                        className="fill-emerald-500 text-emerald-500"
                                    />

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        SEARCH + FILTER
                    ================================================= */}

                    <div className="rounded-xl border border-slate-200 bg-white p-4">

                        <div className="flex flex-col gap-3 lg:flex-row">

                            {/* Search */}

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
                                    placeholder="Search item, renter, owner, comment..."
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


                            {/* Rating Filter */}

                            <div className="flex flex-wrap gap-2">

                                {[
                                    ["all", "All"],
                                    ["5", "5 ★"],
                                    ["4", "4 ★"],
                                    ["3", "3 ★"],
                                    ["2", "2 ★"],
                                    ["1", "1 ★"]
                                ].map(
                                    ([value, label]) => (

                                        <button
                                            key={value}
                                            onClick={() =>
                                                handleRatingChange(
                                                    value
                                                )
                                            }
                                            className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${rating === value
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
                        REVIEWS
                    ================================================= */}

                    <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">

                        {loading ? (

                            <div className="flex min-h-[300px] items-center justify-center">

                                <div className="text-center">

                                    <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

                                    <p className="text-sm text-slate-500">
                                        Loading reviews...
                                    </p>

                                </div>

                            </div>

                        ) : reviews.length === 0 ? (

                            <div className="flex min-h-[300px] items-center justify-center">

                                <div className="text-center">

                                    <MessageSquare
                                        size={40}
                                        className="mx-auto mb-3 text-slate-300"
                                    />

                                    <h3 className="font-semibold text-slate-700">
                                        No reviews found
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Try changing your search or filter.
                                    </p>

                                </div>

                            </div>

                        ) : (

                            <div className="divide-y divide-slate-100">

                                {reviews.map(
                                    (review) => (

                                        <div
                                            key={review._id}
                                            className="p-5 transition hover:bg-slate-50  "
                                        >


                                            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                                                {/* Review Content */}

                                                <div className="min-w-0 flex-1">

                                                    <div className="flex flex-wrap items-start gap-4">

                                                        {/* Item Image */}

                                                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">

                                                            {review.item?.images?.[0] ? (

                                                                <img
                                                                    src={
                                                                        review.item.images[0]
                                                                    }
                                                                    alt={
                                                                        review.item.title
                                                                    }
                                                                    className="h-full w-full object-cover"
                                                                />

                                                            ) : (

                                                                <div className="flex h-full w-full items-center justify-center">

                                                                    <Package
                                                                        size={22}
                                                                        className="text-slate-400"
                                                                    />

                                                                </div>

                                                            )}

                                                        </div>


                                                        {/* Main */}

                                                        <div className="min-w-0 flex-1">

                                                            <div className="flex flex-wrap items-center gap-3">

                                                                <h3 className="font-bold text-slate-900">
                                                                    {review.item?.title ||
                                                                        "Unknown Item"}
                                                                </h3>

                                                                {renderStars(
                                                                    review.rating
                                                                )}

                                                                <span className="text-sm font-semibold text-slate-600">
                                                                    {review.rating}/5
                                                                </span>

                                                            </div>

                                                            <p className="mt-1 text-xs text-slate-500">
                                                                {review.item?.category ||
                                                                    "—"}
                                                            </p>


                                                            {/* Comment */}

                                                            {review.comment ? (

                                                                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">
                                                                    "{review.comment}"
                                                                </p>

                                                            ) : (

                                                                <p className="mt-3 text-sm italic text-slate-400">
                                                                    No comment provided.
                                                                </p>

                                                            )}

                                                        </div>

                                                    </div>


                                                    {/* People */}

                                                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">

                                                        {/* Renter */}

                                                        <div className="rounded-lg bg-slate-50 p-3">

                                                            <div className="mb-1 flex items-center gap-2">

                                                                <User
                                                                    size={15}
                                                                    className="text-blue-500"
                                                                />

                                                                <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                                                    Reviewer
                                                                </span>

                                                            </div>

                                                            <p className="text-sm font-semibold text-slate-800">
                                                                {review.renter?.fullName ||
                                                                    "—"}
                                                            </p>

                                                            <p className="text-xs text-slate-500">
                                                                {review.renter?.email ||
                                                                    "—"}
                                                            </p>

                                                        </div>


                                                        {/* Owner */}

                                                        <div className="rounded-lg bg-slate-50 p-3">

                                                            <div className="mb-1 flex items-center gap-2">

                                                                <Package
                                                                    size={15}
                                                                    className="text-emerald-500"
                                                                />

                                                                <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                                                    Owner
                                                                </span>

                                                            </div>

                                                            <p className="text-sm font-semibold text-slate-800">
                                                                {review.owner?.fullName ||
                                                                    "—"}
                                                            </p>

                                                            <p className="text-xs text-slate-500">
                                                                {review.owner?.email ||
                                                                    "—"}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </div>


                                                {/* Date */}

                                                <div className="flex shrink-0 items-center gap-2 text-sm text-slate-500">

                                                    <Calendar
                                                        size={16}
                                                        className="text-slate-400"
                                                    />

                                                    {formatDate(
                                                        review.createdAt
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

export default AdminReviews;
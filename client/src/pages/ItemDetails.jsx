import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
    FiArrowLeft,
    FiCalendar,
    FiCheckCircle,
    FiMapPin,
    FiStar,
    FiShield
} from "react-icons/fi";

import Navbar from "../components/Navbar";
import { getSingleItem } from "../services/itemService";
import { createBooking } from "../services/bookingService";
import { getItemReviews } from "../services/reviewService";

function ItemDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    const [selectedImage, setSelectedImage] = useState(0);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [bookingLoading, setBookingLoading] = useState(false);

    // Review states
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [reviewsLoading, setReviewsLoading] = useState(true);

    const today = new Date().toISOString().split("T")[0];

    // Load item and reviews together when item id changes.
    useEffect(() => {
        fetchItem();
        fetchReviews();
    }, [id]);

    const fetchItem = async () => {
        try {
            const response = await getSingleItem(id);
            setItem(response.data.item);
        } catch (error) {
            console.log(error);

            toast.error(
                error?.response?.data?.message ||
                    "Failed to load item"
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            setReviewsLoading(true);

            const response = await getItemReviews(id);

            setReviews(response?.reviews || []);
            setAverageRating(response?.averageRating || 0);
            setTotalReviews(response?.totalReviews || 0);
        } catch (error) {
            console.log(error);
        } finally {
            setReviewsLoading(false);
        }
    };

    // Calculate rental duration.
    const calculateTotalDays = () => {
        if (!startDate || !endDate) {
            return 0;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        const difference = end - start;

        if (difference <= 0) {
            return 0;
        }

        return Math.ceil(
            difference / (1000 * 60 * 60 * 24)
        );
    };

    const totalDays = calculateTotalDays();

    const totalAmount =
        totalDays > 0
            ? totalDays * item?.pricePerDay
            : 0;

    // Create booking request.
    const handleBooking = async (e) => {
        e.preventDefault();

        if (!startDate || !endDate) {
            toast.error("Please select start and end date");
            return;
        }

        if (startDate < today) {
            toast.error("Start date cannot be in the past");
            return;
        }

        if (endDate <= startDate) {
            toast.error("End date must be after start date");
            return;
        }

        if (totalDays < 1) {
            toast.error("Booking must be at least 1 day");
            return;
        }

        try {
            setBookingLoading(true);

            const response = await createBooking({
                itemId: id,
                startDate,
                endDate
            });

            toast.success(
                response?.message ||
                    "Booking request sent successfully"
            );

            navigate("/my-bookings");
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                    "Booking failed"
            );
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />

                <div className="flex min-h-[70vh] items-center justify-center">
                    <div className="text-center">
                        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                        <p className="mt-4 text-sm text-slate-500">
                            Loading item...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />

                <div className="flex min-h-[70vh] items-center justify-center px-4">
                    <div className="text-center">
                        <div className="text-5xl">📦</div>

                        <h2 className="mt-5 text-2xl font-black">
                            Item not found
                        </h2>

                        <p className="mt-2 text-slate-500">
                            This item may have been removed.
                        </p>

                        <button
                            onClick={() => navigate("/items")}
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-blue-600"
                        >
                            <FiArrowLeft />
                            Back to Explore
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

                {/* Back */}
                <button
                    onClick={() => navigate("/items")}
                    className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
                >
                    <FiArrowLeft />
                    Back to Explore
                </button>

                {/* ================= MAIN ================= */}
                <div className="grid gap-8 lg:grid-cols-[1fr_400px]">

                    {/* ================= ITEM ================= */}
                    <div>
                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                            {/* Main image */}
                            <div className="flex h-[420px] items-center justify-center bg-slate-100 sm:h-[520px]">
                                {item.images?.length > 0 ? (
                                    <img
                                        src={
                                            item.images[
                                                selectedImage
                                            ]
                                        }
                                        alt={item.title}
                                        className="h-full w-full object-contain"
                                    />
                                ) : (
                                    <div className="text-center">
                                        <div className="text-6xl">
                                            📦
                                        </div>

                                        <p className="mt-3 text-sm text-slate-400">
                                            No image available
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {item.images?.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto border-t border-slate-100 p-4">
                                    {item.images.map(
                                        (image, index) => (
                                            <button
                                                key={index}
                                                onClick={() =>
                                                    setSelectedImage(
                                                        index
                                                    )
                                                }
                                                className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition ${
                                                    selectedImage ===
                                                    index
                                                        ? "border-blue-600"
                                                        : "border-transparent"
                                                }`}
                                            >
                                                <img
                                                    src={image}
                                                    alt={`${item.title} ${
                                                        index + 1
                                                    }`}
                                                    className="h-full w-full object-cover"
                                                />
                                            </button>
                                        )
                                    )}
                                </div>
                            )}

                            {/* Item info */}
                            <div className="p-6 sm:p-8">

                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                                            {item.category}
                                        </span>

                                        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                                            {item.title}
                                        </h1>
                                    </div>

                                    <span
                                        className={`rounded-full px-4 py-2 text-sm font-bold ${
                                            item.isAvailable
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {item.isAvailable
                                            ? "Available"
                                            : "Unavailable"}
                                    </span>
                                </div>

                                {/* Rating */}
                                <div className="mt-5 flex flex-wrap items-center gap-3">
                                    <div className="flex">
                                        {Array.from({
                                            length: 5
                                        }).map((_, index) => (
                                            <FiStar
                                                key={index}
                                                size={19}
                                                className={
                                                    index <
                                                    Math.round(
                                                        averageRating
                                                    )
                                                        ? "text-yellow-400"
                                                        : "text-slate-300"
                                                }
                                                fill={
                                                    index <
                                                    Math.round(
                                                        averageRating
                                                    )
                                                        ? "currentColor"
                                                        : "none"
                                                }
                                            />
                                        ))}
                                    </div>

                                    <span className="font-bold text-slate-800">
                                        {averageRating.toFixed(1)}
                                    </span>

                                    <span className="text-sm text-slate-500">
                                        {totalReviews}{" "}
                                        {totalReviews === 1
                                            ? "review"
                                            : "reviews"}
                                    </span>
                                </div>

                                <p className="mt-6 leading-7 text-slate-600">
                                    {item.description}
                                </p>

                                {/* Price cards */}
                                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                    <div className="rounded-2xl bg-slate-50 p-5">
                                        <p className="text-sm text-slate-500">
                                            Rental Price
                                        </p>

                                        <p className="mt-1 text-2xl font-black">
                                            ₹{item.pricePerDay}
                                            <span className="text-sm font-medium text-slate-500">
                                                {" "}
                                                / day
                                            </span>
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-slate-50 p-5">
                                        <p className="text-sm text-slate-500">
                                            Security Deposit
                                        </p>

                                        <p className="mt-1 text-2xl font-black">
                                            ₹{item.securityDeposit}
                                        </p>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="mt-7 flex items-start gap-3 border-t border-slate-100 pt-6">
                                    <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                                        <FiMapPin size={20} />
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold">
                                            Item Location
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            {item.city},{" "}
                                            {item.state}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ================= BOOKING CARD ================= */}
                    <div>
                        {item.isAvailable ? (
                            <div className="sticky top-24 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">

                                <div className="border-b border-slate-100 p-6">
                                    <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                                        Reserve this item
                                    </p>

                                    <h2 className="mt-1 text-2xl font-black">
                                        Book Now
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Select your rental dates.
                                    </p>
                                </div>

                                <form
                                    onSubmit={handleBooking}
                                    className="space-y-5 p-6"
                                >
                                    {/* Start */}
                                    <div>
                                        <label className="mb-2 block text-sm font-bold">
                                            Start Date
                                        </label>

                                        <div className="relative">
                                            <FiCalendar
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                                size={18}
                                            />

                                            <input
                                                type="date"
                                                value={startDate}
                                                min={today}
                                                onChange={(e) => {
                                                    setStartDate(
                                                        e.target.value
                                                    );

                                                    if (
                                                        endDate &&
                                                        e.target
                                                            .value >=
                                                            endDate
                                                    ) {
                                                        setEndDate(
                                                            ""
                                                        );
                                                    }
                                                }}
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                                            />
                                        </div>
                                    </div>

                                    {/* End */}
                                    <div>
                                        <label className="mb-2 block text-sm font-bold">
                                            End Date
                                        </label>

                                        <div className="relative">
                                            <FiCalendar
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                                size={18}
                                            />

                                            <input
                                                type="date"
                                                value={endDate}
                                                min={
                                                    startDate ||
                                                    today
                                                }
                                                onChange={(e) =>
                                                    setEndDate(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                                            />
                                        </div>
                                    </div>

                                    {/* Summary */}
                                    {totalDays > 0 && (
                                        <div className="rounded-2xl bg-blue-50 p-5">
                                            <div className="flex justify-between text-sm text-slate-600">
                                                <span>
                                                    ₹
                                                    {
                                                        item.pricePerDay
                                                    }{" "}
                                                    × {totalDays}{" "}
                                                    day
                                                    {totalDays >
                                                    1
                                                        ? "s"
                                                        : ""}
                                                </span>

                                                <span className="font-bold">
                                                    ₹{totalAmount}
                                                </span>
                                            </div>

                                            <div className="my-4 border-t border-blue-100" />

                                            <div className="flex justify-between">
                                                <span className="font-bold">
                                                    Total Rent
                                                </span>

                                                <span className="text-xl font-black text-blue-600">
                                                    ₹{totalAmount}
                                                </span>
                                            </div>

                                            <p className="mt-3 text-xs text-slate-500">
                                                Security deposit:
                                                {" "}
                                                ₹
                                                {
                                                    item.securityDeposit
                                                }
                                            </p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={bookingLoading}
                                        className="w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {bookingLoading
                                            ? "Sending Request..."
                                            : "Request to Book"}
                                    </button>

                                    <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                                        <FiShield
                                            className="mt-0.5 flex-shrink-0 text-green-600"
                                            size={18}
                                        />

                                        <p className="text-xs leading-5 text-slate-500">
                                            Your booking remains pending
                                            until the owner accepts your
                                            request.
                                        </p>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
                                <div className="text-5xl">🔒</div>

                                <h2 className="mt-4 text-xl font-black">
                                    Item Unavailable
                                </h2>

                                <p className="mt-2 text-sm text-slate-500">
                                    This item is currently not available
                                    for booking.
                                </p>

                                <button
                                    onClick={() =>
                                        navigate("/items")
                                    }
                                    className="mt-6 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-blue-600"
                                >
                                    Explore Other Items
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ================= REVIEWS ================= */}
                <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

                    <div className="flex flex-col gap-6 border-b border-slate-100 pb-7 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                                Community feedback
                            </p>

                            <h2 className="mt-1 text-2xl font-black">
                                Reviews & Ratings
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                See what other renters experienced.
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-center">
                                <p className="text-3xl font-black">
                                    {averageRating.toFixed(1)}
                                </p>

                                <div className="mt-1 flex">
                                    {Array.from({
                                        length: 5
                                    }).map((_, index) => (
                                        <FiStar
                                            key={index}
                                            size={17}
                                            className={
                                                index <
                                                Math.round(
                                                    averageRating
                                                )
                                                    ? "text-yellow-400"
                                                    : "text-slate-300"
                                            }
                                            fill={
                                                index <
                                                Math.round(
                                                    averageRating
                                                )
                                                    ? "currentColor"
                                                    : "none"
                                            }
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="border-l border-slate-200 pl-4">
                                <p className="text-sm font-bold">
                                    {totalReviews}
                                </p>

                                <p className="text-xs text-slate-500">
                                    {totalReviews === 1
                                        ? "Review"
                                        : "Reviews"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {reviewsLoading ? (
                        <div className="py-12 text-center">
                            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                            <p className="mt-3 text-sm text-slate-500">
                                Loading reviews...
                            </p>
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="py-14 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-50 text-3xl">
                                ⭐
                            </div>

                            <h3 className="mt-4 font-bold">
                                No reviews yet
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Be the first person to review this item.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {reviews.map((review) => (
                                <div
                                    key={review._id}
                                    className="py-6"
                                >
                                    <div className="flex items-start justify-between gap-4">

                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 font-bold text-blue-600">
                                                {review.renter
                                                    ?.profileImage ? (
                                                    <img
                                                        src={
                                                            review
                                                                .renter
                                                                .profileImage
                                                        }
                                                        alt={
                                                            review
                                                                .renter
                                                                .fullName ||
                                                            "Reviewer"
                                                        }
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    review.renter?.fullName
                                                        ?.charAt(0)
                                                        ?.toUpperCase() ||
                                                    "U"
                                                )}
                                            </div>

                                            <div>
                                                <p className="font-bold">
                                                    {review.renter
                                                        ?.fullName ||
                                                        "Anonymous User"}
                                                </p>

                                                <p className="text-xs text-slate-400">
                                                    {new Date(
                                                        review.createdAt
                                                    ).toLocaleDateString(
                                                        "en-IN"
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex">
                                            {Array.from({
                                                length: 5
                                            }).map((_, index) => (
                                                <FiStar
                                                    key={index}
                                                    size={16}
                                                    className={
                                                        index <
                                                        review.rating
                                                            ? "text-yellow-400"
                                                            : "text-slate-300"
                                                    }
                                                    fill={
                                                        index <
                                                        review.rating
                                                            ? "currentColor"
                                                            : "none"
                                                    }
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {review.comment && (
                                        <p className="mt-4 pl-14 text-sm leading-6 text-slate-600">
                                            {review.comment}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default ItemDetails;
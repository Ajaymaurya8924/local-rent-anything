import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

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


    // ================= REVIEW STATES =================

    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [reviewsLoading, setReviewsLoading] = useState(true);

    // ================= TODAY DATE =================

    const today = new Date().toISOString().split("T")[0];

    // ================= FETCH ITEM =================

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

    // ================= FETCH REVIEWS =================

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

    // ================= DATE CALCULATION =================

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

    // ================= CREATE BOOKING =================

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
            toast.error(
                "End date must be after start date"
            );
            return;
        }

        if (totalDays < 1) {
            toast.error(
                "Booking must be at least 1 day"
            );
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

    // ================= LOADING =================

    if (loading) {
        return (
            <>
                <Navbar />

                <div className="flex min-h-[60vh] items-center justify-center">
                    <div className="text-center">
                        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>

                        <p className="text-gray-500">
                            Loading item...
                        </p>
                    </div>
                </div>
            </>
        );
    }

    // ================= ITEM NOT FOUND =================

    if (!item) {
        return (
            <>
                <Navbar />

                <div className="flex min-h-[60vh] items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Item not found
                        </h2>

                        <button
                            onClick={() => navigate("/items")}
                            className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                        >
                            Back to Explore
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

                {/* ================= ITEM DETAILS ================= */}

                <div className="grid gap-8 lg:grid-cols-3">

                    {/* ITEM INFORMATION */}

                    <div className="lg:col-span-2">

                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                            {/* IMAGE */}

                            <div>

                                {/* MAIN IMAGE */}

                                <div className="flex h-96 items-center justify-center bg-gray-100">

                                    {item.images &&
                                        item.images.length > 0 ? (

                                        <img
                                            src={item.images[selectedImage]}
                                            alt={item.title}
                                            className="h-full w-full object-contain"
                                        />

                                    ) : (

                                        <div className="text-center">

                                            <div className="text-5xl">
                                                📦
                                            </div>

                                            <p className="mt-2 text-sm text-gray-400">
                                                No image available
                                            </p>

                                        </div>

                                    )}

                                </div>


                                {/* IMAGE THUMBNAILS */}

                                {item.images &&
                                    item.images.length > 1 && (

                                        <div className="flex gap-3 overflow-x-auto bg-white p-4">

                                            {item.images.map((image, index) => (

                                                <img
                                                    key={index}
                                                    src={image}
                                                    alt={`${item.title} ${index + 1}`}
                                                    onClick={() => setSelectedImage(index)}
                                                    className={`h-20 w-20 flex-shrink-0 cursor-pointer rounded-lg border-2 object-cover ${selectedImage === index
                                                        ? "border-blue-600"
                                                        : "border-gray-200"
                                                        }`}
                                                />

                                            ))}

                                        </div>

                                    )}

                            </div>

                            {/* DETAILS */}

                            <div className="p-6 sm:p-8">

                                <div className="mb-4 flex flex-wrap items-start justify-between gap-4">

                                    <div>
                                        <p className="mb-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                                            {item.category}
                                        </p>

                                        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                                            {item.title}
                                        </h1>
                                    </div>

                                    <div
                                        className={`rounded-full px-3 py-1 text-sm font-semibold ${item.isAvailable
                                            ? "bg-green-50 text-green-600"
                                            : "bg-red-50 text-red-600"
                                            }`}
                                    >
                                        {item.isAvailable
                                            ? "Available"
                                            : "Unavailable"}
                                    </div>

                                </div>

                                <p className="leading-7 text-gray-600">
                                    {item.description}
                                </p>

                                {/* PRICE */}

                                <div className="mt-8 grid gap-4 sm:grid-cols-2">

                                    <div className="rounded-xl bg-gray-50 p-4">
                                        <p className="text-sm text-gray-500">
                                            Rental Price
                                        </p>

                                        <p className="mt-1 text-2xl font-bold text-gray-900">
                                            ₹{item.pricePerDay}
                                            <span className="text-sm font-medium text-gray-500">
                                                {" "} / day
                                            </span>
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-gray-50 p-4">
                                        <p className="text-sm text-gray-500">
                                            Security Deposit
                                        </p>

                                        <p className="mt-1 text-2xl font-bold text-gray-900">
                                            ₹{item.securityDeposit}
                                        </p>
                                    </div>

                                </div>

                                {/* LOCATION */}

                                <div className="mt-6 border-t border-gray-100 pt-6">

                                    <p className="mb-3 text-sm font-semibold text-gray-700">
                                        Location
                                    </p>

                                    <p className="text-gray-600">
                                        📍 {item.city}, {item.state}
                                    </p>

                                </div>

                            </div>
                        </div>
                    </div>

                    {/* ================= BOOKING CARD ================= */}

                    <div>

                        {item.isAvailable ? (
                            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                                <h2 className="text-xl font-bold text-gray-900">
                                    Book This Item
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Select your rental dates
                                </p>

                                <form
                                    onSubmit={handleBooking}
                                    className="mt-6 space-y-5"
                                >

                                    {/* START DATE */}

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            Start Date
                                        </label>

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
                                                    e.target.value >= endDate
                                                ) {
                                                    setEndDate("");
                                                }
                                            }}
                                            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>

                                    {/* END DATE */}

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            End Date
                                        </label>

                                        <input
                                            type="date"
                                            value={endDate}
                                            min={
                                                startDate
                                                    ? startDate
                                                    : today
                                            }
                                            onChange={(e) =>
                                                setEndDate(
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>

                                    {/* BOOKING SUMMARY */}

                                    {totalDays > 0 && (
                                        <div className="rounded-xl bg-blue-50 p-4">

                                            <div className="flex justify-between text-sm text-gray-600">
                                                <span>
                                                    ₹{item.pricePerDay} ×{" "}
                                                    {totalDays} day
                                                    {totalDays > 1
                                                        ? "s"
                                                        : ""}
                                                </span>

                                                <span className="font-semibold text-gray-800">
                                                    ₹{totalAmount}
                                                </span>
                                            </div>

                                            <div className="my-3 border-t border-blue-100"></div>

                                            <div className="flex justify-between">
                                                <span className="font-semibold text-gray-800">
                                                    Total Rent
                                                </span>

                                                <span className="text-xl font-bold text-blue-600">
                                                    ₹{totalAmount}
                                                </span>
                                            </div>

                                            <p className="mt-2 text-xs text-gray-500">
                                                Security deposit:
                                                {" "}₹{item.securityDeposit}
                                            </p>

                                        </div>
                                    )}

                                    {/* BOOK BUTTON */}

                                    <button
                                        type="submit"
                                        disabled={bookingLoading}
                                        className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {bookingLoading
                                            ? "Sending Request..."
                                            : "Book Now"}
                                    </button>

                                </form>

                                <p className="mt-4 text-center text-xs text-gray-400">
                                    Your booking will remain pending until
                                    the owner accepts it.
                                </p>

                            </div>
                        ) : (
                            <div className="rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm">

                                <div className="text-4xl">
                                    🔒
                                </div>

                                <h2 className="mt-3 text-xl font-bold text-gray-900">
                                    Item Unavailable
                                </h2>

                                <p className="mt-2 text-sm text-gray-500">
                                    This item is currently not available
                                    for booking.
                                </p>

                                <button
                                    onClick={() =>
                                        navigate("/items")
                                    }
                                    className="mt-5 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
                                >
                                    Explore Other Items
                                </button>

                            </div>
                        )}

                    </div>
                </div>

            </main>

            {/* ================= REVIEWS SECTION ================= */}

            <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

                {/* Reviews Header */}
                <div className="flex flex-col gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Reviews & Ratings
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            See what other renters experienced with this item.
                        </p>
                    </div>

                    {/* Rating Summary */}
                    <div className="flex items-center gap-3">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-gray-900">
                                {averageRating.toFixed(1)}
                            </p>

                            <div className="text-lg text-yellow-400">
                                {"★".repeat(Math.round(averageRating))}
                                <span className="text-gray-300">
                                    {"★".repeat(
                                        5 - Math.round(averageRating)
                                    )}
                                </span>
                            </div>
                        </div>

                        <div className="border-l border-gray-200 pl-4">
                            <p className="text-sm font-semibold text-gray-700">
                                {totalReviews}{" "}
                                {totalReviews === 1
                                    ? "Review"
                                    : "Reviews"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Reviews Content */}
                {reviewsLoading ? (
                    <div className="py-10 text-center">
                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>

                        <p className="mt-3 text-sm text-gray-500">
                            Loading reviews...
                        </p>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="py-10 text-center">
                        <div className="text-4xl">⭐</div>

                        <h3 className="mt-3 text-lg font-semibold text-gray-800">
                            No reviews yet
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Be the first person to review this item.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">

                        {reviews.map((review) => (
                            <div
                                key={review._id}
                                className="py-6 first:pt-6"
                            >

                                {/* Reviewer Info */}
                                <div className="flex items-start justify-between gap-4">

                                    <div className="flex items-center gap-3">

                                        {/* Reviewer Avatar */}
                                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-blue-100 font-bold text-blue-600">
                                            {review.renter?.profileImage ? (
                                                <img
                                                    src={review.renter.profileImage}
                                                    alt={
                                                        review.renter.fullName ||
                                                        "Reviewer"
                                                    }
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                review.renter?.fullName
                                                    ?.charAt(0)
                                                    ?.toUpperCase() || "U"
                                            )}
                                        </div>

                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {review.renter?.fullName ||
                                                    "Anonymous User"}
                                            </p>

                                            <p className="text-xs text-gray-400">
                                                {new Date(
                                                    review.createdAt
                                                ).toLocaleDateString(
                                                    "en-IN"
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Star Rating */}
                                    <div className="text-lg text-yellow-400">
                                        {"★".repeat(review.rating)}
                                        <span className="text-gray-300">
                                            {"★".repeat(
                                                5 - review.rating
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {/* Review Comment */}
                                {review.comment && (
                                    <p className="mt-4 leading-6 text-gray-600">
                                        {review.comment}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>

        </div>
    );
}

export default ItemDetails;
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { createReview } from "../services/reviewService";
import Navbar from "../components/Navbar";

import {
    getMyBookings,
    cancelBooking
} from "../services/bookingService";

import {
    createPaymentOrder,
    verifyPayment
} from "../services/paymentService";


function MyBookings() {

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paymentLoading, setPaymentLoading] = useState(null);

    // ================= REVIEW STATES =================

    const [reviewBooking, setReviewBooking] = useState(null);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState("");
    const [reviewLoading, setReviewLoading] = useState(false);


    // ================= FETCH BOOKINGS =================

    const fetchBookings = async () => {

        try {

            const response = await getMyBookings();

            setBookings(response.data.bookings || []);

        } catch (error) {

            console.log(error);

            toast.error(
                error?.response?.data?.message ||
                "Failed to load bookings"
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {
        fetchBookings();
    }, []);


    // ================= CANCEL BOOKING =================

    const handleCancel = async (id) => {

        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this booking?"
        );

        if (!confirmCancel) {
            return;
        }

        try {

            const response = await cancelBooking(id);

            toast.success(
                response.message ||
                "Booking cancelled successfully"
            );

            // Refresh booking status
            await fetchBookings();

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                "Cancellation failed"
            );
        }
    };


    // ================= LOAD RAZORPAY =================

    const loadRazorpay = () => {

        return new Promise((resolve) => {

            // Razorpay already loaded
            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script = document.createElement("script");

            script.src =
                "https://checkout.razorpay.com/v1/checkout.js";

            script.onload = () => {
                resolve(true);
            };

            script.onerror = () => {
                resolve(false);
            };

            document.body.appendChild(script);
        });
    };


    // ================= PAYMENT =================

    const handlePayment = async (booking) => {

        try {

            setPaymentLoading(booking._id);

            // Load Razorpay Checkout
            const isLoaded = await loadRazorpay();

            if (!isLoaded) {

                toast.error(
                    "Razorpay failed to load"
                );

                return;
            }

            // Create payment order from backend
            const response =
                await createPaymentOrder(
                    booking._id
                );

            const order =
                response.data.order;


            // Razorpay Checkout configuration
            const options = {

                key:
                    import.meta.env
                        .VITE_RAZORPAY_KEY_ID,

                amount:
                    order.amount,

                currency:
                    order.currency,

                name:
                    "LocalRent",

                description:
                    `Rental booking for ${booking.item?.title}`,

                order_id:
                    order.orderId,


                // Verify payment after successful checkout
                handler: async function (paymentResponse) {

                    try {

                        const verifyResponse =
                            await verifyPayment({

                                bookingId:
                                    booking._id,

                                razorpayOrderId:
                                    paymentResponse.razorpay_order_id,

                                razorpayPaymentId:
                                    paymentResponse.razorpay_payment_id,

                                razorpaySignature:
                                    paymentResponse.razorpay_signature
                            });


                        if (verifyResponse.success) {

                            toast.success(
                                "Payment successful and verified!"
                            );

                            // Refresh payment status
                            await fetchBookings();

                        } else {

                            toast.error(
                                "Payment verification failed"
                            );
                        }

                    } catch (error) {

                        console.log(error);

                        toast.error(
                            error?.response?.data?.message ||
                            "Payment verification failed"
                        );
                    }
                },


                prefill: {
                    name: "",
                    email: ""
                },


                theme: {
                    color: "#2563eb"
                },


                modal: {

                    ondismiss: function () {

                        toast(
                            "Payment cancelled"
                        );
                    }
                }
            };


            const razorpay =
                new window.Razorpay(options);

            razorpay.open();

        } catch (error) {

            console.log(error);

            toast.error(
                error?.response?.data?.message ||
                "Payment could not be started"
            );

        } finally {

            setPaymentLoading(null);
        }
    };


    // ================= SUBMIT REVIEW =================

    const handleSubmitReview = async () => {

        if (!reviewBooking) {
            return;
        }


        // Rating is required
        if (reviewRating < 1) {

            toast.error(
                "Please select a rating"
            );

            return;
        }


        try {

            setReviewLoading(true);

            const response = await createReview({

                bookingId:
                    reviewBooking._id,

                rating:
                    reviewRating,

                comment:
                    reviewComment
            });


            toast.success(
                response?.message ||
                "Review submitted successfully"
            );


            // Close modal and reset form
            setReviewBooking(null);
            setReviewRating(0);
            setReviewComment("");


            // Backend now returns hasReviewed=true
            await fetchBookings();

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                "Failed to submit review"
            );

        } finally {

            setReviewLoading(false);
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
                            Loading bookings...
                        </p>

                    </div>

                </div>
            </>
        );
    }


    return (

        <div className="min-h-screen bg-gray-50">

            <Navbar />

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

                {/* ================= HEADER ================= */}

                <div className="mb-8">

                    <h1 className="text-3xl font-bold text-gray-900">
                        My Bookings
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Track your rental bookings and payments.
                    </p>

                </div>


                {/* ================= EMPTY ================= */}

                {bookings.length === 0 ? (

                    <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">

                        <div className="text-5xl">
                            📅
                        </div>

                        <h2 className="mt-4 text-xl font-bold text-gray-900">
                            No bookings yet
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Start exploring items and make your first booking.
                        </p>

                    </div>

                ) : (

                    <div className="space-y-5">

                        {bookings.map((booking) => (

                            <div
                                key={booking._id}
                                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                            >

                                {/* ================= TOP ================= */}

                                <div className="flex flex-col justify-between gap-4 sm:flex-row">

                                    <div className="flex gap-4">

                                        {/* ITEM IMAGE */}

                                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">

                                            {booking.item?.images?.length > 0 ? (

                                                <img
                                                    src={booking.item.images[0]}
                                                    alt={booking.item.title}
                                                    className="h-full w-full object-cover"
                                                />

                                            ) : (

                                                <div className="flex h-full items-center justify-center text-3xl">
                                                    📦
                                                </div>

                                            )}

                                        </div>


                                        <div>

                                            <h2 className="text-xl font-bold text-gray-900">
                                                {booking.item?.title}
                                            </h2>

                                            <p className="mt-1 text-sm text-gray-500">
                                                📍 {booking.item?.city},{" "}
                                                {booking.item?.state}
                                            </p>

                                        </div>

                                    </div>


                                    {/* STATUS */}

                                    <div
                                        className={`h-fit rounded-full px-4 py-1.5 text-sm font-semibold capitalize ${
                                            booking.status === "accepted"
                                                ? "bg-green-50 text-green-600"
                                                : booking.status === "rejected"
                                                    ? "bg-red-50 text-red-600"
                                                    : booking.status === "cancelled"
                                                        ? "bg-gray-100 text-gray-500"
                                                        : "bg-yellow-50 text-yellow-600"
                                        }`}
                                    >
                                        {booking.status}
                                    </div>

                                </div>


                                {/* ================= DETAILS ================= */}

                                <div className="mt-6 grid gap-4 border-t border-gray-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">

                                    <div>

                                        <p className="text-xs font-medium text-gray-400">
                                            Start Date
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-800">
                                            {new Date(
                                                booking.startDate
                                            ).toLocaleDateString("en-IN")}
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-xs font-medium text-gray-400">
                                            End Date
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-800">
                                            {new Date(
                                                booking.endDate
                                            ).toLocaleDateString("en-IN")}
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-xs font-medium text-gray-400">
                                            Rental Days
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-800">
                                            {booking.totalDays} day
                                            {booking.totalDays > 1
                                                ? "s"
                                                : ""}
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-xs font-medium text-gray-400">
                                            Total Amount
                                        </p>

                                        <p className="mt-1 text-lg font-bold text-gray-900">
                                            ₹{booking.totalAmount}
                                        </p>

                                    </div>

                                </div>


                                {/* ================= PAYMENT STATUS ================= */}

                                <div className="mt-5 flex flex-col gap-3 rounded-xl bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">

                                    <div>

                                        <p className="text-sm font-medium text-gray-700">
                                            Payment Status
                                        </p>

                                        <p
                                            className={`mt-1 text-sm font-semibold capitalize ${
                                                booking.paymentStatus === "paid"
                                                    ? "text-green-600"
                                                    : booking.paymentStatus === "failed"
                                                        ? "text-red-600"
                                                        : "text-yellow-600"
                                            }`}
                                        >
                                            {booking.paymentStatus || "pending"}
                                        </p>

                                    </div>


                                    {/* PAY NOW */}

                                    {booking.status === "accepted" &&
                                        booking.paymentStatus !== "paid" && (

                                            <button
                                                onClick={() =>
                                                    handlePayment(booking)
                                                }
                                                disabled={
                                                    paymentLoading ===
                                                    booking._id
                                                }
                                                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                            >

                                                {paymentLoading ===
                                                    booking._id
                                                    ? "Opening Payment..."
                                                    : "💳 Pay Now"}

                                            </button>
                                        )}


                                    {booking.paymentStatus === "paid" && (

                                        <span className="rounded-xl bg-green-50 px-5 py-3 text-sm font-semibold text-green-600">
                                            ✓ Payment Completed
                                        </span>
                                    )}

                                </div>


                                {/* ================= RETURN STATUS ================= */}

                                <div className="mt-4 rounded-xl border border-gray-100 p-4">

                                    <p className="text-sm font-medium text-gray-700">
                                        Return Status
                                    </p>

                                    {booking.returnStatus === "returned" ? (

                                        <div className="mt-1">

                                            <p className="font-semibold text-green-600">
                                                ✓ Item Returned
                                            </p>

                                            {booking.returnedAt && (
                                                <p className="mt-1 text-xs text-gray-500">
                                                    Returned on{" "}
                                                    {new Date(
                                                        booking.returnedAt
                                                    ).toLocaleDateString("en-IN")}
                                                </p>
                                            )}

                                        </div>

                                    ) : booking.returnStatus === "overdue" ? (

                                        <p className="mt-1 font-semibold text-red-600">
                                            ⚠ Rental Overdue
                                        </p>

                                    ) : (

                                        <p className="mt-1 font-semibold text-yellow-600">
                                            ⏳ Item Not Returned
                                        </p>

                                    )}

                                </div>


                                {/* ================= CANCEL ================= */}

                                {/* Cancellation is allowed only before payment */}
                                {(booking.status === "pending" ||
                                    (
                                        booking.status === "accepted" &&
                                        booking.paymentStatus !== "paid"
                                    )) && (

                                    <button
                                        onClick={() =>
                                            handleCancel(
                                                booking._id
                                            )
                                        }
                                        className="mt-5 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                    >
                                        Cancel Booking
                                    </button>
                                )}


                                {/* Paid accepted booking cannot be cancelled
                                    because refund system is not implemented yet. */}

                                {booking.status === "accepted" &&
                                    booking.paymentStatus === "paid" &&
                                    booking.returnStatus !== "returned" && (

                                        <p className="mt-5 text-sm text-gray-500">
                                            ℹ️ Payment completed. Cancellation is not available.
                                        </p>
                                    )}


                                {/* ================= GIVE REVIEW ================= */}

                                {booking.status === "accepted" &&
                                    booking.paymentStatus === "paid" &&
                                    booking.returnStatus === "returned" && (

                                    booking.hasReviewed ? (

                                        <span className="mt-4 inline-block rounded-xl bg-green-50 px-5 py-2.5 text-sm font-semibold text-green-600">
                                            ✓ Review Submitted
                                        </span>

                                    ) : (

                                        <button
                                            onClick={() =>
                                                setReviewBooking(booking)
                                            }
                                            className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                                        >
                                            ⭐ Give Review
                                        </button>
                                    )
                                )}

                            </div>
                        ))}

                    </div>
                )}


            </main>


            {/* ================= REVIEW MODAL ================= */}

            {reviewBooking && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

                        {/* Modal Header */}

                        <div className="flex items-center justify-between">

                            <div>

                                <h2 className="text-xl font-bold text-gray-900">
                                    Give Review
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    {reviewBooking.item?.title}
                                </p>

                            </div>


                            <button
                                onClick={() => {

                                    setReviewBooking(null);
                                    setReviewRating(0);
                                    setReviewComment("");

                                }}
                                className="text-2xl text-gray-400 hover:text-gray-700"
                            >
                                ×
                            </button>

                        </div>


                        {/* Rating */}

                        <div className="mt-6">

                            <p className="text-sm font-semibold text-gray-700">
                                Your Rating
                            </p>

                            <div className="mt-3 flex gap-2">

                                {[1, 2, 3, 4, 5].map((star) => (

                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() =>
                                            setReviewRating(star)
                                        }
                                        className={`text-3xl transition ${
                                            star <= reviewRating
                                                ? "text-yellow-400"
                                                : "text-gray-300"
                                        }`}
                                    >
                                        ★
                                    </button>

                                ))}

                            </div>

                        </div>


                        {/* Comment */}

                        <div className="mt-6">

                            <label className="text-sm font-semibold text-gray-700">
                                Your Comment
                            </label>

                            <textarea
                                value={reviewComment}
                                onChange={(e) =>
                                    setReviewComment(
                                        e.target.value
                                    )
                                }
                                rows="4"
                                maxLength="500"
                                placeholder="How was your rental experience?"
                                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                            <p className="mt-1 text-right text-xs text-gray-400">
                                {reviewComment.length}/500
                            </p>

                        </div>


                        {/* Submit */}

                        <button
                            onClick={handleSubmitReview}
                            disabled={reviewLoading}
                            className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {reviewLoading
                                ? "Submitting..."
                                : "Submit Review"}
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
}

export default MyBookings;
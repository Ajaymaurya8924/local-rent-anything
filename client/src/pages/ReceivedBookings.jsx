import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import Navbar from "../components/Navbar";

import {
    getReceivedBookings,
    acceptBooking,
    rejectBooking,
    markBookingAsReturned
} from "../services/bookingService";

function ReceivedBookings() {

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);


    // ================= FETCH RECEIVED BOOKINGS =================

    const fetchReceivedBookings = async () => {

        try {

            const response = await getReceivedBookings();

            setBookings(response.data.bookings || []);

        } catch (error) {

            console.log(error);

            toast.error(
                error?.response?.data?.message ||
                "Failed to load booking requests"
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {
        fetchReceivedBookings();
    }, []);


    // ================= ACCEPT BOOKING =================

    const handleAccept = async (id) => {

        const confirmAccept = window.confirm(
            "Are you sure you want to accept this booking?"
        );

        if (!confirmAccept) {
            return;
        }

        try {

            const response = await acceptBooking(id);

            toast.success(
                response.message ||
                "Booking accepted successfully"
            );

            fetchReceivedBookings();

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                "Failed to accept booking"
            );
        }
    };


    // ================= REJECT BOOKING =================

    const handleReject = async (id) => {

        const confirmReject = window.confirm(
            "Are you sure you want to reject this booking?"
        );

        if (!confirmReject) {
            return;
        }

        try {

            const response = await rejectBooking(id);

            toast.success(
                response.message ||
                "Booking rejected successfully"
            );

            fetchReceivedBookings();

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                "Failed to reject booking"
            );
        }
    };


    // ================= MARK ITEM RETURNED =================

    const handleReturn = async (id) => {

        const confirmReturn = window.confirm(
            "Are you sure you want to mark this booking as returned?"
        );

        if (!confirmReturn) {
            return;
        }

        try {

            const response = await markBookingAsReturned(id);

            toast.success(
                response.message ||
                "Booking marked as returned"
            );

            fetchReceivedBookings();

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                "Failed to mark booking as returned"
            );
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
                            Loading booking requests...
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
                        Received Booking Requests
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Manage rental requests and track payment and return status.
                    </p>

                </div>


                {/* ================= EMPTY STATE ================= */}

                {bookings.length === 0 ? (

                    <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">

                        <div className="text-5xl">
                            📋
                        </div>

                        <h2 className="mt-4 text-xl font-bold text-gray-900">
                            No booking requests
                        </h2>

                        <p className="mt-2 text-gray-500">
                            You have not received any booking requests yet.
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


                                    {/* BOOKING STATUS */}

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


                                {/* ================= RENTER ================= */}

                                <div className="mt-6 rounded-xl bg-gray-50 p-4">

                                    <h3 className="font-semibold text-gray-900">
                                        Renter Details
                                    </h3>

                                    <p className="mt-2 text-sm text-gray-600">
                                        Name:{" "}
                                        <span className="font-medium text-gray-800">
                                            {booking.renter?.fullName}
                                        </span>
                                    </p>

                                    <p className="mt-1 text-sm text-gray-600">
                                        Email:{" "}
                                        <span className="font-medium text-gray-800">
                                            {booking.renter?.email}
                                        </span>
                                    </p>

                                </div>


                                {/* ================= BOOKING DETAILS ================= */}

                                <div className="mt-5 grid gap-4 border-t border-gray-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">

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
                                            {booking.totalDays > 1 ? "s" : ""}
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

                                <div className="mt-5 flex items-center justify-between rounded-xl bg-gray-50 p-4">

                                    <div>

                                        <p className="text-sm font-medium text-gray-700">
                                            Payment Status
                                        </p>

                                        <p
                                            className={`mt-1 text-sm font-bold ${
                                                booking.paymentStatus === "paid"
                                                    ? "text-green-600"
                                                    : booking.paymentStatus === "failed"
                                                        ? "text-red-600"
                                                        : "text-yellow-600"
                                            }`}
                                        >
                                            {booking.paymentStatus === "paid"
                                                ? "✓ Payment Received"
                                                : booking.paymentStatus === "failed"
                                                    ? "✕ Payment Failed"
                                                    : "⏳ Payment Pending"}
                                        </p>

                                    </div>

                                    {booking.paymentStatus === "paid" && (

                                        <span className="rounded-full bg-green-100 px-4 py-2 text-xs font-semibold text-green-700">
                                            PAID
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


                                {/* ================= ACTIONS ================= */}

                                {booking.status === "pending" && (

                                    <div className="mt-6 flex gap-3">

                                        <button
                                            onClick={() =>
                                                handleAccept(booking._id)
                                            }
                                            className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
                                        >
                                            ✓ Accept
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleReject(booking._id)
                                            }
                                            className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                                        >
                                            ✕ Reject
                                        </button>

                                    </div>
                                )}


                                {/* Mark returned only after payment */}

                                {booking.status === "accepted" &&
                                    booking.paymentStatus === "paid" &&
                                    booking.returnStatus !== "returned" && (

                                        <div className="mt-6">

                                            <button
                                                onClick={() =>
                                                    handleReturn(booking._id)
                                                }
                                                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                                            >
                                                ✓ Mark as Returned
                                            </button>

                                        </div>
                                    )}


                            </div>

                        ))}

                    </div>

                )}

            </main>

        </div>
    );
}

export default ReceivedBookings;
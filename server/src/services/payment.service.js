const Booking = require("../models/booking.model");
const razorpay = require("../config/razorpay");
const crypto = require("crypto");

const {
    createNotification
} = require("./notification.service");


// ================= CREATE PAYMENT ORDER =================

const createPaymentOrder = async (
    bookingId,
    renterId
) => {
    // Find booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new Error("Booking not found");
    }

    // Only booking renter can pay
    if (
        booking.renter.toString() !==
        renterId.toString()
    ) {
        throw new Error(
            "You are not allowed to pay for this booking"
        );
    }

    // Only accepted booking can be paid
    if (booking.status !== "accepted") {
        throw new Error(
            "Only accepted bookings can be paid"
        );
    }

    // Prevent duplicate payment
    if (booking.paymentStatus === "paid") {
        throw new Error(
            "Payment has already been completed"
        );
    }

    // Razorpay expects amount in paise
    const amountInPaise = Math.round(
        booking.totalAmount * 100
    );

    if (amountInPaise <= 0) {
        throw new Error("Invalid payment amount");
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `booking_${booking._id}`
    });

    // Save Razorpay order ID
    booking.razorpayOrderId = order.id;

    await booking.save();

    return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        bookingId: booking._id
    };
};


// ================= VERIFY PAYMENT =================

const verifyPayment = async (
    bookingId,
    renterId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature
) => {
    // Find booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new Error("Booking not found");
    }

    // Only booking renter can verify payment
    if (
        booking.renter.toString() !==
        renterId.toString()
    ) {
        throw new Error(
            "You are not allowed to verify this payment"
        );
    }

    // Booking must be accepted
    if (booking.status !== "accepted") {
        throw new Error(
            "Only accepted bookings can be paid"
        );
    }

    // Prevent duplicate verification
    if (booking.paymentStatus === "paid") {
        throw new Error(
            "Payment has already been completed"
        );
    }

    // Razorpay order must match our booking
    if (
        booking.razorpayOrderId !==
        razorpayOrderId
    ) {
        throw new Error(
            "Invalid Razorpay order"
        );
    }

    // Generate expected Razorpay signature
    const generatedSignature =
        crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                `${razorpayOrderId}|${razorpayPaymentId}`
            )
            .digest("hex");

    // Verify signature
    if (
        generatedSignature !==
        razorpaySignature
    ) {
        booking.paymentStatus = "failed";

        await booking.save();

        throw new Error(
            "Payment verification failed"
        );
    }

    // Payment successfully verified
    booking.paymentStatus = "paid";
    booking.paymentId = razorpayPaymentId;
    booking.paidAt = new Date();

    await booking.save();

    // Notify owner about successful payment
    await createNotification({
        recipient: booking.owner,
        type: "PAYMENT_SUCCESS",
        title: "Payment Received",
        message:
            `Payment of ₹${booking.totalAmount} has been received for your rental booking.`,
        booking: booking._id,
        item: booking.item
    });

    return booking;
};


// ================= EXPORT =================

module.exports = {
    createPaymentOrder,
    verifyPayment
};
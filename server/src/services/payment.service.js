const Booking = require("../models/booking.model");
const razorpay = require("../config/razorpay");
const crypto = require("crypto");

const {
    createNotification
} = require("./notification.service");

const {
    createAuditLog
} = require("./auditLog.service");


// ================= CREATE PAYMENT ORDER =================

const createPaymentOrder = async (
    bookingId,
    renterId
) => {

    const booking =
        await Booking.findById(
            bookingId
        );

    if (!booking) {
        throw new Error(
            "Booking not found"
        );
    }

    if (
        booking.renter.toString() !==
        renterId.toString()
    ) {

        throw new Error(
            "You are not allowed to pay for this booking"
        );

    }

    if (
        booking.status !==
        "accepted"
    ) {

        throw new Error(
            "Only accepted bookings can be paid"
        );

    }

    if (
        booking.paymentStatus ===
        "paid"
    ) {

        throw new Error(
            "Payment has already been completed"
        );

    }

    const amountInPaise =
        Math.round(
            booking.totalAmount * 100
        );

    if (amountInPaise <= 0) {

        throw new Error(
            "Invalid payment amount"
        );

    }

    // Create Razorpay order
    const order =
        await razorpay.orders.create({

            amount:
                amountInPaise,

            currency:
                "INR",

            receipt:
                `booking_${booking._id}`

        });

    // Save Razorpay order ID
    booking.razorpayOrderId =
        order.id;

    await booking.save();

    return {

        orderId:
            order.id,

        amount:
            order.amount,

        currency:
            order.currency,

        bookingId:
            booking._id

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

    const booking =
        await Booking.findById(
            bookingId
        );

    if (!booking) {

        throw new Error(
            "Booking not found"
        );

    }

    if (
        booking.renter.toString() !==
        renterId.toString()
    ) {

        throw new Error(
            "You are not allowed to verify this payment"
        );

    }

    if (
        booking.status !==
        "accepted"
    ) {

        throw new Error(
            "Only accepted bookings can be paid"
        );

    }

    if (
        booking.paymentStatus ===
        "paid"
    ) {

        throw new Error(
            "Payment has already been completed"
        );

    }

    // Make sure Razorpay order belongs to this booking
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


    // ================= PAYMENT FAILED =================

    if (
        generatedSignature !==
        razorpaySignature
    ) {

        booking.paymentStatus =
            "failed";

        await booking.save();

        // Record failed payment
        await createAuditLog({

            user: renterId,

            action:
                "PAYMENT_FAILED",

            entityType:
                "PAYMENT",

            entityId:
                booking._id,

            description:
                "Payment verification failed",

            metadata: {

                bookingId:
                    booking._id,

                amount:
                    booking.totalAmount

            }

        });

        throw new Error(
            "Payment verification failed"
        );

    }


    // ================= PAYMENT SUCCESS =================

    booking.paymentStatus =
        "paid";

    booking.paymentId =
        razorpayPaymentId;

    booking.paidAt =
        new Date();

    await booking.save();


    // Record successful payment
    await createAuditLog({

        user: renterId,

        action:
            "PAYMENT_SUCCESS",

        entityType:
            "PAYMENT",

        entityId:
            booking._id,

        description:
            `Completed payment of ₹${booking.totalAmount}`,

        metadata: {

            bookingId:
                booking._id,

            amount:
                booking.totalAmount,

            paymentId:
                razorpayPaymentId,

            razorpayOrderId

        }

    });


    // Notify owner
    await createNotification({

        recipient:
            booking.owner,

        type:
            "PAYMENT_SUCCESS",

        title:
            "Payment Received",

        message:
            `Payment of ₹${booking.totalAmount} has been received for your rental booking.`,

        booking:
            booking._id,

        item:
            booking.item

    });

    return booking;
};


// ================= EXPORT =================

module.exports = {

    createPaymentOrder,

    verifyPayment

};
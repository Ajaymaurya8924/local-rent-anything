const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true
    },

    renter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: true
    },

    totalDays: {
        type: Number,
        required: true
    },

    totalAmount: {
        type: Number,
        required: true
    },

    // ================= BOOKING STATUS =================

    status: {
        type: String,
        enum: [
            "pending",
            "accepted",
            "rejected",
            "cancelled"
        ],
        default: "pending"
    },

    // ================= PAYMENT =================

    paymentStatus: {
        type: String,
        enum: [
            "pending",
            "paid",
            "failed"
        ],
        default: "pending"
    },

    returnStatus: {
        type: String,
        enum: ["pending", "returned", "overdue"],
        default: "pending"
    },

    returnedAt: {
        type: Date,
        default: null
    },

    razorpayOrderId: {
        type: String,
        default: null
    },

    paymentId: {
        type: String,
        default: null
    },

    paidAt: {
        type: Date,
        default: null
    }

}, {
    timestamps: true
});

const Booking = mongoose.model(
    "Booking",
    bookingSchema
);

module.exports = Booking;
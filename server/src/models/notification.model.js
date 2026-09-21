const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        type: {
            type: String,
            enum: [
                "BOOKING_REQUEST",
                "BOOKING_ACCEPTED",
                "BOOKING_REJECTED",
                "BOOKING_CANCELLED",
                "PAYMENT_SUCCESS",
                "RETURN_REMINDER",
                "RETURN_DUE",
                "RENTAL_OVERDUE"
            ],
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        message: {
            type: String,
            required: true,
            trim: true
        },

        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            default: null
        },

        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item",
            default: null
        },

        isRead: {
            type: Boolean,
            default: false
        },

        emailSent: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Notification = mongoose.model(
    "Notification",
    notificationSchema
);

module.exports = Notification;
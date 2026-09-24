const mongoose = require("mongoose");

/*
 * Audit Log Model
 *
 * This model stores important activities performed inside
 * the Local Rent Anything application.
 *
 * Example:
 * - User created an item
 * - Booking was accepted
 * - Payment was completed
 * - Review was submitted
 */

const auditLogSchema = new mongoose.Schema(
    {
        // User who performed the action
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        /*
         * Type of action performed.
         *
         * Keeping fixed values helps us maintain
         * consistent audit history.
         */
        action: {
            type: String,
            enum: [
                "REGISTER",
                "LOGIN",
                "LOGOUT",
                "PROFILE_UPDATED",
                "PASSWORD_CHANGED",

                "ITEM_CREATED",
                "ITEM_UPDATED",
                "ITEM_DELETED",
                "BOOKING_CREATED",
                "BOOKING_ACCEPTED",
                "BOOKING_REJECTED",
                "BOOKING_CANCELLED",
                "BOOKING_RETURNED",

                "PAYMENT_SUCCESS",
                "PAYMENT_FAILED",

                "REVIEW_CREATED"
            ],
            required: true,
            index: true
        },

        /*
         * What type of entity was affected?
         *
         * Example:
         * ITEM     -> item related activity
         * BOOKING  -> booking related activity
         * PAYMENT  -> payment related activity
         */
        entityType: {
            type: String,
            enum: [
                "USER",
                "ITEM",
                "BOOKING",
                "PAYMENT",
                "REVIEW"
            ],
            required: true,
            index: true
        },

        // ID of the affected item/booking/review/etc.
        entityId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
            index: true
        },

        // Human-readable activity description
        description: {
            type: String,
            required: true,
            trim: true
        },

        /*
         * Extra information related to the activity.
         *
         * Example:
         * {
         *   itemTitle: "Canon Camera",
         *   amount: 500
         * }
         */
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }
    },
    {
        timestamps: true
    }
);

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

module.exports = AuditLog;
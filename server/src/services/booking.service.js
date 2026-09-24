const Booking = require("../models/booking.model");
const Item = require("../models/item.model");
const Review = require("../models/review.model");
const User = require("../models/user.model");

const {
    createNotification
} = require("./notification.service");

const {
    addEmailJob
} = require("./emailQueue.service");

const {
    createAuditLog
} = require("./auditLog.service");


// ================= CREATE BOOKING =================

const createBooking = async (
    bookingData,
    renterId
) => {

    const {
        itemId,
        startDate,
        endDate
    } = bookingData;

    const item =
        await Item.findById(itemId);

    if (!item) {
        throw new Error("Item not found");
    }

    if (!item.isAvailable) {
        throw new Error(
            "Item is not available"
        );
    }

    // Owner cannot book own item
    if (
        item.owner.toString() ===
        renterId.toString()
    ) {

        throw new Error(
            "You cannot book your own item"
        );

    }

    const start =
        new Date(startDate);

    const end =
        new Date(endDate);

    if (
        isNaN(start.getTime()) ||
        isNaN(end.getTime())
    ) {

        throw new Error(
            "Invalid booking date"
        );

    }

    const today = new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );

    if (start < today) {

        throw new Error(
            "Start date cannot be in the past"
        );

    }

    if (end <= start) {

        throw new Error(
            "End date must be after start date"
        );

    }

    const timeDifference =
        end - start;

    const totalDays =
        Math.ceil(
            timeDifference /
            (1000 * 60 * 60 * 24)
        );

    if (totalDays < 1) {

        throw new Error(
            "Booking must be at least 1 day"
        );

    }

    // Check overlapping accepted bookings
    const conflictingBooking =
        await Booking.findOne({

            item: itemId,

            status: "accepted",

            startDate: {
                $lt: end
            },

            endDate: {
                $gt: start
            }

        });

    if (conflictingBooking) {

        throw new Error(
            "Item is already booked for selected dates"
        );

    }

    const totalAmount =
        totalDays *
        item.pricePerDay;

    // Create booking
    const booking =
        await Booking.create({

            item: item._id,

            renter: renterId,

            owner: item.owner,

            startDate: start,

            endDate: end,

            totalDays,

            totalAmount

        });

    const renter =
        await User.findById(renterId)
            .select(
                "fullName email"
            );

    // Record booking creation
    await createAuditLog({

        user: renterId,

        action: "BOOKING_CREATED",

        entityType: "BOOKING",

        entityId: booking._id,

        description:
            `Requested to book "${item.title}"`,

        metadata: {

            itemTitle: item.title,

            startDate: start,

            endDate: end,

            totalDays,

            totalAmount

        }

    });


    // ================= OWNER NOTIFICATION =================

    await createNotification({

        recipient: booking.owner,

        type: "BOOKING_REQUEST",

        title: "New Booking Request",

        message:
            `${renter?.fullName || "A user"} has requested to book your item.`,

        booking: booking._id,

        item: booking.item

    });


    // ================= OWNER EMAIL =================

    const owner =
        await User.findById(
            booking.owner
        )
            .select(
                "fullName email"
            );

    if (owner) {

        await addEmailJob({

            to: owner.email,

            subject:
                "New Booking Request - Local Rent Anything",

            text:
                `Hello ${owner.fullName},\n\n` +
                `${renter?.fullName || "A user"} has requested to book your item.\n\n` +
                `Please login to Local Rent Anything and accept or reject the booking request.\n\n` +
                `Thank you,\nLocal Rent Anything`,

            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                    <h2>New Booking Request</h2>

                    <p>Hello ${owner.fullName},</p>

                    <p>
                        <strong>${renter?.fullName || "A user"}</strong>
                        has requested to book your item.
                    </p>

                    <p>
                        Please login to Local Rent Anything
                        to accept or reject this booking request.
                    </p>

                    <p>
                        Thank you,<br>
                        Local Rent Anything
                    </p>
                </div>
            `

        });

    }

    return booking;
};


// ================= GET RENTER BOOKINGS =================

const getBookingsByRenter =
    async (renterId) => {

        const bookings =
            await Booking.find({
                renter: renterId
            })
                .populate(
                    "item",
                    "title pricePerDay images city state"
                )
                .populate(
                    "owner",
                    "fullName email"
                )
                .sort({
                    createdAt: -1
                });

        const bookingsWithReviewStatus =
            await Promise.all(

                bookings.map(
                    async (booking) => {

                        const existingReview =
                            await Review.findOne({
                                booking:
                                    booking._id
                            }).select("_id");

                        return {

                            ...booking.toObject(),

                            hasReviewed:
                                Boolean(
                                    existingReview
                                )

                        };

                    }
                )
            );

        return bookingsWithReviewStatus;
    };


// ================= GET OWNER BOOKINGS =================

const getBookingsByOwner =
    async (ownerId) => {

        const bookings =
            await Booking.find({
                owner: ownerId
            })
                .populate(
                    "item",
                    "title pricePerDay images city state"
                )
                .populate(
                    "renter",
                    "fullName email"
                )
                .sort({
                    createdAt: -1
                });

        return bookings;
    };


// ================= ACCEPT BOOKING =================

const acceptBookingById =
    async (
        bookingId,
        ownerId
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
            booking.owner.toString() !==
            ownerId.toString()
        ) {

            throw new Error(
                "You are not allowed to accept this booking"
            );

        }

        if (
            booking.status !==
            "pending"
        ) {

            throw new Error(
                "Booking is not pending"
            );

        }

        // Check overlapping accepted booking
        const conflictingBooking =
            await Booking.findOne({

                item: booking.item,

                status: "accepted",

                _id: {
                    $ne: booking._id
                },

                startDate: {
                    $lt: booking.endDate
                },

                endDate: {
                    $gt: booking.startDate
                }

            });

        if (conflictingBooking) {

            throw new Error(
                "Item is already booked for these dates"
            );

        }

        booking.status =
            "accepted";

        await booking.save();

        // Get item title for audit
        const item =
            await Item.findById(
                booking.item
            ).select("title");

        // Record acceptance
        await createAuditLog({

            user: ownerId,

            action:
                "BOOKING_ACCEPTED",

            entityType:
                "BOOKING",

            entityId:
                booking._id,

            description:
                `Accepted booking for "${item?.title || "item"}"`,

            metadata: {

                itemTitle:
                    item?.title,

                renterId:
                    booking.renter,

                totalAmount:
                    booking.totalAmount

            }

        });

        const returnDate =
            booking.endDate.toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );


        // ================= RENTER NOTIFICATION =================

        await createNotification({

            recipient:
                booking.renter,

            type:
                "BOOKING_ACCEPTED",

            title:
                "Booking Confirmed",

            message:
                `Your booking for the item is confirmed. Please return it on ${returnDate}.`,

            booking:
                booking._id,

            item:
                booking.item

        });


        // ================= RENTER EMAIL =================

        const renter =
            await User.findById(
                booking.renter
            )
                .select(
                    "fullName email"
                );

        if (renter) {

            await addEmailJob({

                to: renter.email,

                subject:
                    "Booking Confirmed - Local Rent Anything",

                text:
                    `Hello ${renter.fullName},\n\n` +
                    `Your booking has been confirmed.\n\n` +
                    `Return Date: ${returnDate}\n` +
                    `Please return the item on or before ${returnDate}.\n\n` +
                    `Thank you,\nLocal Rent Anything`,

                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                        <h2>Booking Confirmed</h2>

                        <p>Hello ${renter.fullName},</p>

                        <p>Your booking has been confirmed successfully.</p>

                        <p>
                            <strong>Return Date:</strong>
                            ${returnDate}
                        </p>

                        <p>
                            Please return the item on or before
                            <strong>${returnDate}</strong>.
                        </p>

                        <p>
                            Thank you,<br>
                            Local Rent Anything
                        </p>
                    </div>
                `

            });

        }

        return booking;
    };


// ================= REJECT BOOKING =================

const rejectBookingById =
    async (
        bookingId,
        ownerId
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
            booking.owner.toString() !==
            ownerId.toString()
        ) {

            throw new Error(
                "You are not allowed to reject this booking"
            );

        }

        if (
            booking.status !==
            "pending"
        ) {

            throw new Error(
                "Booking is not pending"
            );

        }

        booking.status =
            "rejected";

        await booking.save();

        const item =
            await Item.findById(
                booking.item
            ).select("title");

        // Record rejection
        await createAuditLog({

            user: ownerId,

            action:
                "BOOKING_REJECTED",

            entityType:
                "BOOKING",

            entityId:
                booking._id,

            description:
                `Rejected booking for "${item?.title || "item"}"`,

            metadata: {

                itemTitle:
                    item?.title,

                renterId:
                    booking.renter

            }

        });

        await createNotification({

            recipient:
                booking.renter,

            type:
                "BOOKING_REJECTED",

            title:
                "Booking Rejected",

            message:
                "Your booking request has been rejected by the owner.",

            booking:
                booking._id,

            item:
                booking.item

        });

        return booking;
    };


// ================= CANCEL BOOKING =================

const cancelBookingById =
    async (
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
                "You are not allowed to cancel this booking"
            );

        }

        if (
            booking.status ===
            "rejected"
        ) {

            throw new Error(
                "Rejected booking cannot be cancelled"
            );

        }

        if (
            booking.status ===
            "cancelled"
        ) {

            throw new Error(
                "Booking is already cancelled"
            );

        }

        if (
            booking.returnStatus ===
            "returned"
        ) {

            throw new Error(
                "Returned booking cannot be cancelled"
            );

        }

        if (
            booking.status ===
                "accepted" &&
            booking.paymentStatus ===
                "paid"
        ) {

            throw new Error(
                "Paid booking cannot be cancelled. Refund system is not available yet."
            );

        }

        booking.status =
            "cancelled";

        await booking.save();

        const item =
            await Item.findById(
                booking.item
            ).select("title");

        // Record cancellation
        await createAuditLog({

            user: renterId,

            action:
                "BOOKING_CANCELLED",

            entityType:
                "BOOKING",

            entityId:
                booking._id,

            description:
                `Cancelled booking for "${item?.title || "item"}"`,

            metadata: {

                itemTitle:
                    item?.title,

                totalAmount:
                    booking.totalAmount

            }

        });

        await createNotification({

            recipient:
                booking.owner,

            type:
                "BOOKING_CANCELLED",

            title:
                "Booking Cancelled",

            message:
                "A booking for your item has been cancelled by the renter.",

            booking:
                booking._id,

            item:
                booking.item

        });

        return booking;
    };


// ================= MARK BOOKING AS RETURNED =================

const markBookingAsReturned =
    async (
        bookingId,
        ownerId
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
            booking.owner.toString() !==
            ownerId.toString()
        ) {

            throw new Error(
                "You are not authorized to update this booking"
            );

        }

        if (
            booking.status !==
            "accepted"
        ) {

            throw new Error(
                "Only accepted bookings can be returned"
            );

        }

        if (
            booking.paymentStatus !==
            "paid"
        ) {

            throw new Error(
                "Booking payment is not completed"
            );

        }

        if (
            booking.returnStatus ===
            "returned"
        ) {

            throw new Error(
                "Booking is already marked as returned"
            );

        }

        booking.returnStatus =
            "returned";

        booking.returnedAt =
            new Date();

        await booking.save();

        const item =
            await Item.findById(
                booking.item
            ).select("title");

        // Record return
        await createAuditLog({

            user: ownerId,

            action:
                "BOOKING_RETURNED",

            entityType:
                "BOOKING",

            entityId:
                booking._id,

            description:
                `Marked "${item?.title || "item"}" as returned`,

            metadata: {

                itemTitle:
                    item?.title,

                renterId:
                    booking.renter,

                returnedAt:
                    booking.returnedAt

            }

        });

        return booking;
    };


// ================= EXPORT =================

module.exports = {

    createBooking,

    getBookingsByRenter,

    getBookingsByOwner,

    acceptBookingById,

    rejectBookingById,

    cancelBookingById,

    markBookingAsReturned

};
const Review = require("../models/review.model");
const Booking = require("../models/booking.model");

const {
    createAuditLog
} = require("./auditLog.service");


// ================= CREATE REVIEW =================

const createReview = async ({
    bookingId,
    renterId,
    rating,
    comment
}) => {

    // Find booking
    const booking =
        await Booking.findById(
            bookingId
        );

    if (!booking) {

        throw new Error(
            "Booking not found"
        );

    }

    // Only booking renter can review
    if (
        booking.renter.toString() !==
        renterId.toString()
    ) {

        throw new Error(
            "You are not authorized to review this booking"
        );

    }

    // Booking must be accepted
    if (
        booking.status !==
        "accepted"
    ) {

        throw new Error(
            "Only accepted bookings can be reviewed"
        );

    }

    // Payment must be completed
    if (
        booking.paymentStatus !==
        "paid"
    ) {

        throw new Error(
            "Payment must be completed before reviewing"
        );

    }

    // Item must be returned
    if (
        booking.returnStatus !==
        "returned"
    ) {

        throw new Error(
            "Item must be returned before reviewing"
        );

    }

    // One booking = one review
    const existingReview =
        await Review.findOne({
            booking: bookingId
        });

    if (existingReview) {

        throw new Error(
            "You have already reviewed this booking"
        );

    }

    // Create review
    const review =
        await Review.create({

            item:
                booking.item,

            booking:
                booking._id,

            renter:
                renterId,

            rating,

            comment

        });


    // Record review activity
    await createAuditLog({

        user:
            renterId,

        action:
            "REVIEW_CREATED",

        entityType:
            "REVIEW",

        entityId:
            review._id,

        description:
            `Submitted a ${rating}-star review`,

        metadata: {

            bookingId:
                booking._id,

            itemId:
                booking.item,

            rating

        }

    });

    return review;
};


// ================= GET ITEM REVIEWS =================

const getReviewsByItem =
    async (itemId) => {

        const reviews =
            await Review.find({
                item: itemId
            })
                .populate(
                    "renter",
                    "fullName profileImage"
                )
                .sort({
                    createdAt: -1
                });

        const totalReviews =
            reviews.length;

        const averageRating =
            totalReviews > 0

                ? reviews.reduce(
                    (
                        sum,
                        review
                    ) =>
                        sum +
                        review.rating,
                    0
                ) / totalReviews

                : 0;

        return {

            reviews,

            totalReviews,

            averageRating:
                Number(
                    averageRating.toFixed(1)
                )

        };
    };


module.exports = {

    createReview,

    getReviewsByItem

};
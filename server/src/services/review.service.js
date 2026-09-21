const Review = require("../models/review.model");
const Booking = require("../models/booking.model");

// Create review for a completed booking
const createReview = async ({
    bookingId,
    renterId,
    rating,
    comment
}) => {
    // Find the booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new Error("Booking not found");
    }

    // Only the renter who made the booking can review it
    if (booking.renter.toString() !== renterId.toString()) {
        throw new Error("You are not authorized to review this booking");
    }

    // Booking must be accepted
    if (booking.status !== "accepted") {
        throw new Error("Only accepted bookings can be reviewed");
    }

    // Payment must be completed
    if (booking.paymentStatus !== "paid") {
        throw new Error("Payment must be completed before reviewing");
    }

    // Item must have been returned
    if (booking.returnStatus !== "returned") {
        throw new Error("Item must be returned before reviewing");
    }

    // One booking can have only one review
    const existingReview = await Review.findOne({
        booking: bookingId
    });

    if (existingReview) {
        throw new Error("You have already reviewed this booking");
    }

    // Create the review
    const review = await Review.create({
        item: booking.item,
        booking: booking._id,
        renter: renterId,
        rating,
        comment
    });

    return review;
};

// Get all reviews and rating summary for an item
const getReviewsByItem = async (itemId) => {
    const reviews = await Review.find({
        item: itemId
    })
        .populate("renter", "fullName profileImage")
        .sort({ createdAt: -1 });

    const totalReviews = reviews.length;

    // Calculate average rating
    const averageRating =
        totalReviews > 0
            ? reviews.reduce(
                  (sum, review) => sum + review.rating,
                  0
              ) / totalReviews
            : 0;

    return {
        reviews,
        totalReviews,
        averageRating: Number(averageRating.toFixed(1))
    };
};

module.exports = {
    createReview,
    getReviewsByItem
};
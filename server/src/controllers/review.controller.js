const {
    createReview,
    getReviewsByItem
} = require("../services/review.service");

// Create a new review for a completed booking
const createReviewController = async (req, res) => {
    try {
        const { bookingId, rating, comment } = req.body;

        // Basic validation
        if (!bookingId || !rating) {
            return res.status(400).json({
                success: false,
                message: "Booking and rating are required"
            });
        }

        // Rating should be between 1 and 5
        const numericRating = Number(rating);

        if (
            Number.isNaN(numericRating) ||
            numericRating < 1 ||
            numericRating > 5
        ) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        const review = await createReview({
            bookingId,
            renterId: req.user._id,
            rating: numericRating,
            comment
        });

        return res.status(201).json({
            success: true,
            message: "Review submitted successfully",
            review
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get all reviews of a particular item
const getItemReviewsController = async (req, res) => {
    try {
        const result = await getReviewsByItem(req.params.itemId);

        return res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createReviewController,
    getItemReviewsController
};
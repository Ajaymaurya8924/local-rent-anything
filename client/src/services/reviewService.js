import api from "../api/axios";

// Submit a review for a completed booking
const createReview = async (reviewData) => {
    try {
        const response = await api.post("/reviews", reviewData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get all reviews and rating summary for an item
const getItemReviews = async (itemId) => {
    try {
        const response = await api.get(
            `/reviews/item/${itemId}`
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export {
    createReview,
    getItemReviews
};
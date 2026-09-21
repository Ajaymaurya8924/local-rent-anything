const Item = require("../models/item.model");
const Review = require("../models/review.model");


// ================= CREATE ITEM =================

const createItem = async (itemData, ownerId) => {

    const item = await Item.create({
        title: itemData.title,
        description: itemData.description,
        category: itemData.category,
        pricePerDay: itemData.pricePerDay,
        securityDeposit: itemData.securityDeposit,
        images: itemData.images,
        city: itemData.city,
        state: itemData.state,
        owner: ownerId
    });

    return item;
};


// ================= GET ALL ITEMS =================

const getItems = async (filters = {}) => {

    const query = {};

    // Search by title
    if (filters.search) {
        query.title = {
            $regex: filters.search,
            $options: "i"
        };
    }

    // Filter by category
    if (filters.category) {
        query.category = {
            $regex: `^${filters.category}$`,
            $options: "i"
        };
    }

    // Filter by city
    if (filters.city) {
        query.city = {
            $regex: filters.city,
            $options: "i"
        };
    }

    // Filter by price range
    if (filters.minPrice || filters.maxPrice) {

        query.pricePerDay = {};

        if (filters.minPrice) {
            query.pricePerDay.$gte =
                Number(filters.minPrice);
        }

        if (filters.maxPrice) {
            query.pricePerDay.$lte =
                Number(filters.maxPrice);
        }
    }

    const items = await Item.find(query);

    // Add rating information to every item
    const itemsWithRatings = await Promise.all(

        items.map(async (item) => {

            const ratingData = await Review.aggregate([
                {
                    $match: {
                        item: item._id
                    }
                },
                {
                    $group: {
                        _id: null,

                        averageRating: {
                            $avg: "$rating"
                        },

                        totalReviews: {
                            $sum: 1
                        }
                    }
                }
            ]);

            const rating = ratingData[0];

            return {
                ...item.toObject(),

                // If there are no reviews, rating is 0
                averageRating: rating
                    ? Number(
                        rating.averageRating.toFixed(1)
                    )
                    : 0,

                // Total number of reviews
                totalReviews: rating
                    ? rating.totalReviews
                    : 0
            };
        })
    );

    return itemsWithRatings;
};


// ================= GET SINGLE ITEM =================

const getItemById = async (itemId) => {

    const item = await Item.findById(itemId);

    if (!item) {
        throw new Error("Item not found");
    }

    return item;
};


// ================= GET OWNER ITEMS =================

const getItemsByOwner = async (ownerId) => {

    const items = await Item.find({
        owner: ownerId
    });

    // Add rating information to owner's items
    const itemsWithRatings = await Promise.all(

        items.map(async (item) => {

            const ratingData = await Review.aggregate([
                {
                    $match: {
                        item: item._id
                    }
                },
                {
                    $group: {
                        _id: null,

                        averageRating: {
                            $avg: "$rating"
                        },

                        totalReviews: {
                            $sum: 1
                        }
                    }
                }
            ]);

            const rating = ratingData[0];

            return {
                ...item.toObject(),

                // Average rating of this item
                averageRating: rating
                    ? Number(
                        rating.averageRating.toFixed(1)
                    )
                    : 0,

                // Total reviews received
                totalReviews: rating
                    ? rating.totalReviews
                    : 0
            };
        })
    );

    return itemsWithRatings;
};


// ================= UPDATE ITEM =================

const updateItemById = async (
    itemId,
    updateData,
    userId
) => {

    const item = await Item.findById(itemId);

    if (!item) {
        throw new Error("Item not found");
    }

    // Only item owner can update the item
    if (
        item.owner.toString() !==
        userId.toString()
    ) {
        throw new Error(
            "You are not allowed to update this item"
        );
    }

    const allowedFields = [
        "title",
        "description",
        "category",
        "pricePerDay",
        "securityDeposit",
        "images",
        "city",
        "state",
        "isAvailable"
    ];

    // Update only allowed fields
    allowedFields.forEach((field) => {

        if (updateData[field] !== undefined) {
            item[field] = updateData[field];
        }

    });

    await item.save();

    return item;
};


// ================= DELETE ITEM =================

const deleteItemById = async (
    itemId,
    userId
) => {

    const item = await Item.findById(itemId);

    if (!item) {
        throw new Error("Item not found");
    }

    // Only owner can delete the item
    if (
        item.owner.toString() !==
        userId.toString()
    ) {
        throw new Error(
            "You are not allowed to delete this item"
        );
    }

    await Item.findByIdAndDelete(itemId);

    return true;
};


// ================= EXPORT =================

module.exports = {
    createItem,
    getItems,
    getItemById,
    getItemsByOwner,
    updateItemById,
    deleteItemById
};
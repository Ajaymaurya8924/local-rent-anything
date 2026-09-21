const {
    createItem,
    getItems,
    getItemById,
    getItemsByOwner,
    updateItemById,
    deleteItemById
} = require("../services/item.service");

const addItem = async (req, res) => {
    try {

        const itemData = {
            ...req.body,
            images: req.files
                ? req.files.map((file) => file.path)
                : []
        };

        const item = await createItem(
            itemData,
            req.user._id
        );

        res.status(201).json({
            success: true,
            message: "Item added successfully",
            data: {
                item: item
            }
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};


const getAllItems = async (req, res) => {
    try {

        const items = await getItems(req.query);

        res.status(200).json({
            success: true,
            message: "Items fetched successfully",
            data: {
                items: items
            }
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

const getSingleItem = async (req, res) => {
    try {

        const itemId = req.params.id;

        const item = await getItemById(itemId);

        res.status(200).json({
            success: true,
            message: "Item fetched successfully",
            data: {
                item: item
            }
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

const getMyItems = async (req, res) => {
    try {

        const ownerId = req.user._id;

        const items = await getItemsByOwner(ownerId);

        res.status(200).json({
            success: true,
            message: "Your items fetched successfully",
            data: {
                items: items
            }
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

const updateItem = async (req, res) => {
    try {

        const itemId = req.params.id;
        const userId = req.user._id;

        const updateData = {
            ...req.body
        };

        // Existing images sent by frontend
        if (req.body.existingImages) {

            updateData.images =
                JSON.parse(req.body.existingImages);

        }

        // New images uploaded to Cloudinary
        if (req.files && req.files.length > 0) {

            const newImages =
                req.files.map((file) => file.path);

            updateData.images = [
                ...(updateData.images || []),
                ...newImages
            ];

        }

        // Remove helper field
        delete updateData.existingImages;

        const item = await updateItemById(
            itemId,
            updateData,
            userId
        );

        res.status(200).json({
            success: true,
            message: "Item updated successfully",
            data: {
                item: item
            }
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

const deleteItem = async (req, res) => {
    try {

        const itemId = req.params.id;

        const userId = req.user._id;

        await deleteItemById(
            itemId,
            userId
        );

        res.status(200).json({
            success: true,
            message: "Item deleted successfully"
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    addItem,
    getAllItems,
    getSingleItem,
    getMyItems,
    updateItem,
    deleteItem
};
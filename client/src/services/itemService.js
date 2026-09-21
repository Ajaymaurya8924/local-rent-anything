import api from "../api/axios";

// ================= GET ALL ITEMS =================

const getAllItems = async (params = {}) => {

    try {

        const response = await api.get("/items", {
            params
        });

        return response.data;

    } catch (error) {

        throw error;

    }

};

// ================= GET SINGLE ITEM =================

const getSingleItem = async (id) => {

    try {

        const response = await api.get(`/items/${id}`);

        return response.data;

    } catch (error) {

        throw error;

    }

};

// ================= GET MY ITEMS =================

const getMyItems = async () => {

    try {

        const response = await api.get("/items/my-items");

        return response.data;

    } catch (error) {

        throw error;

    }

};

// ================= ADD ITEM =================

const addItem = async (itemData) => {
    try {

        const response = await api.post(
            "/items",
            itemData
        );

        return response.data;

    } catch (error) {

        throw error;

    }
};

// ================= UPDATE ITEM =================

const updateItem = async (id, itemData) => {

    try {

        const response = await api.patch(`/items/${id}`, itemData);

        return response.data;

    } catch (error) {

        throw error;

    }

};


// ================= DELETE ITEM =================

const deleteItem = async (id) => {

    try {

        const response = await api.delete(`/items/${id}`);

        return response.data;

    } catch (error) {

        throw error;

    }

};

export {
    getAllItems,
    getSingleItem,
    getMyItems,
    addItem,
    updateItem,
    deleteItem
};
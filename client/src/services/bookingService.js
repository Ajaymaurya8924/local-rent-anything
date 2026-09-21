import api from "../api/axios";

// ================= CREATE BOOKING =================

const createBooking = async (bookingData) => {

    try {

        const response = await api.post(
            "/bookings",
            bookingData
        );

        return response.data;

    } catch (error) {

        throw error;

    }

};


// ================= MY BOOKINGS =================

const getMyBookings = async () => {

    try {

        const response = await api.get(
            "/bookings/my-bookings"
        );

        return response.data;

    } catch (error) {

        throw error;

    }

};


// ================= RECEIVED BOOKINGS =================

const getReceivedBookings = async () => {

    try {

        const response = await api.get(
            "/bookings/received"
        );

        return response.data;

    } catch (error) {

        throw error;

    }

};


// ================= ACCEPT BOOKING =================

const acceptBooking = async (id) => {

    try {

        const response = await api.patch(
            `/bookings/${id}/accept`
        );

        return response.data;

    } catch (error) {

        throw error;

    }

};


// ================= REJECT BOOKING =================

const rejectBooking = async (id) => {

    try {

        const response = await api.patch(
            `/bookings/${id}/reject`
        );

        return response.data;

    } catch (error) {

        throw error;

    }

};


const markBookingAsReturned = async (id) => {
    try {
        const response = await api.patch(
            `/bookings/${id}/return`
        );

        return response.data;
    } catch (error) {
        throw error;
    }
};


// ================= CANCEL BOOKING =================

const cancelBooking = async (id) => {

    try {

        const response = await api.patch(
            `/bookings/${id}/cancel`
        );

        return response.data;

    } catch (error) {

        throw error;

    }

};


// ================= EXPORT =================

export {
    createBooking,
    getMyBookings,
    getReceivedBookings,
    acceptBooking,
    rejectBooking,
    cancelBooking,
    markBookingAsReturned
};
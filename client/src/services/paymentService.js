import api from "../api/axios";

const createPaymentOrder = async (bookingId) => {
    try {
        const response = await api.post(
            `/payments/create-order/${bookingId}`
        );

        return response.data;

    } catch (error) {
        throw error;
    }
};
const verifyPayment = async (paymentData) => {
    try {
        const response = await api.post(
            "/payments/verify",
            paymentData
        );

        return response.data;

    } catch (error) {
        throw error;
    }
};

export {
    createPaymentOrder,
    verifyPayment
};
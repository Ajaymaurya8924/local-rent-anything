const {
    createPaymentOrder,
    verifyPayment
} = require("../services/payment.service");


// ================= CREATE ORDER =================

const createOrder = async (req, res) => {

    try {

        const renterId = req.user._id;

        const bookingId = req.params.bookingId;

        const order = await createPaymentOrder(
            bookingId,
            renterId
        );

        res.status(201).json({
            success: true,
            message: "Payment order created successfully",
            data: {
                order
            }
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};


// ================= VERIFY PAYMENT =================

const verifyPaymentController = async (req, res) => {

    try {

        const renterId = req.user._id;

        const {
            bookingId,
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature
        } = req.body;

        // Required fields check
        if (
            !bookingId ||
            !razorpayOrderId ||
            !razorpayPaymentId ||
            !razorpaySignature
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment verification data is incomplete"
            });
        }

        const booking = await verifyPayment(
            bookingId,
            renterId,
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature
        );

        res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            data: {
                booking
            }
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};


module.exports = {
    createOrder,
    verifyPaymentController
};
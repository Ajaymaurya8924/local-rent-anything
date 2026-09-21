const express = require("express");

const {
    createOrder,
    verifyPaymentController
} = require("../controllers/payment.controller");

const {
    verifyToken
} = require("../middlewares/auth.middleware");

const router = express.Router();


// Create Razorpay Order
router.post(
    "/create-order/:bookingId",
    verifyToken,
    createOrder
);


// Verify Razorpay Payment
router.post(
    "/verify",
    verifyToken,
    verifyPaymentController
);


module.exports = router;
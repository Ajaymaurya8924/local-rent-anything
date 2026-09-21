const express = require("express");

const router = express.Router();

const {
    addBooking,
    getMyBookings,
    getReceivedBookings,
    acceptBooking,
    rejectBooking,
    cancelBooking,
    markAsReturned
} = require("../controllers/booking.controller");

const {
    verifyToken
} = require("../middlewares/auth.middleware");


router.post(
    "/",
    verifyToken,
    addBooking
);

router.get(
    "/my-bookings",
    verifyToken,
    getMyBookings
);

router.get(
    "/received",
    verifyToken,
    getReceivedBookings
);

router.patch(
    "/:id/accept",
    verifyToken,
    acceptBooking
);

router.patch(
    "/:id/return",
    verifyToken,
    markAsReturned
);

router.patch(
    "/:id/reject",
    verifyToken,
    rejectBooking
);

router.patch(
    "/:id/cancel",
    verifyToken,
    cancelBooking
);


module.exports = router;
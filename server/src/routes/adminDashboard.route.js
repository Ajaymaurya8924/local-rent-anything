const express = require("express");

const router = express.Router();

const {
    getAdminDashboard,
    getAdminUsersController,
    getAdminItemsController,
    getAdminBookingsController,
    getAdminPaymentsController,
    getAdminReviewsController
} = require("../controllers/adminDashboard.controller");

const {
    verifyToken,
    verifyAdmin
} = require("../middlewares/auth.middleware");


// =====================================================
// ADMIN DASHBOARD
// =====================================================

router.get(
    "/",
    verifyToken,
    verifyAdmin,
    getAdminDashboard
);


// =====================================================
// ADMIN USERS
// =====================================================

router.get(
    "/users",
    verifyToken,
    verifyAdmin,
    getAdminUsersController
);


// =====================================================
// ADMIN ITEMS
// =====================================================

router.get(
    "/items",
    verifyToken,
    verifyAdmin,
    getAdminItemsController
);


// =====================================================
// ADMIN BOOKINGS
// =====================================================

router.get(
    "/bookings",
    verifyToken,
    verifyAdmin,
    getAdminBookingsController
);


// =====================================================
// ADMIN PAYMENTS
// =====================================================

router.get(
    "/payments",
    verifyToken,
    verifyAdmin,
    getAdminPaymentsController
);

// =====================================================
// ADMIN REVIEWS
// =====================================================

router.get(
    "/reviews",
    verifyToken,
    verifyAdmin,
    getAdminReviewsController
);


module.exports = router;
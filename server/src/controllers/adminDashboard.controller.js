const {
    getAdminDashboardData,
    getAdminUsers,
    getAdminItems,
    getAdminBookings,
    getAdminPayments,
       getAdminReviews
} = require("../services/adminDashboard.service");


// =====================================================
// ADMIN DASHBOARD
// =====================================================

const getAdminDashboard = async (req, res) => {

    try {

        const data =
            await getAdminDashboardData();

        return res.status(200).json({
            success: true,
            message: "Admin dashboard data fetched successfully",
            data
        });

    } catch (error) {

        console.error(
            "Admin Dashboard Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch admin dashboard data"
        });
    }
};


// =====================================================
// ADMIN USERS
// =====================================================

const getAdminUsersController = async (req, res) => {

    try {

        const search =
            req.query.search || "";

        const users =
            await getAdminUsers(search);

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: {
                users,
                totalUsers: users.length
            }
        });

    } catch (error) {

        console.error(
            "Admin Users Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        });
    }
};


// =====================================================
// ADMIN ITEMS
// =====================================================

const getAdminItemsController = async (req, res) => {

    try {

        const search =
            req.query.search || "";

        const items =
            await getAdminItems(search);

        return res.status(200).json({
            success: true,
            message: "Items fetched successfully",
            data: {
                items,
                totalItems: items.length
            }
        });

    } catch (error) {

        console.error(
            "Admin Items Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch items"
        });
    }
};


// =====================================================
// ADMIN BOOKINGS
// =====================================================

const getAdminBookingsController = async (req, res) => {

    try {

        const search =
            req.query.search || "";

        const status =
            req.query.status || "";

        const bookings =
            await getAdminBookings(
                search,
                status
            );

        return res.status(200).json({
            success: true,
            message: "Bookings fetched successfully",
            data: {
                bookings,
                totalBookings: bookings.length
            }
        });

    } catch (error) {

        console.error(
            "Admin Bookings Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch bookings"
        });
    }
};


// =====================================================
// ADMIN PAYMENTS
// =====================================================

const getAdminPaymentsController = async (req, res) => {

    try {

        const search =
            req.query.search || "";

        const paymentStatus =
            req.query.paymentStatus || "";

        const result =
            await getAdminPayments(
                search,
                paymentStatus
            );

        return res.status(200).json({
            success: true,
            message: "Payments fetched successfully",
            data: result
        });

    } catch (error) {

        console.error(
            "Admin Payments Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch payments"
        });
    }
};

// =====================================================
// ADMIN REVIEWS
// =====================================================

const getAdminReviewsController = async (req, res) => {

    try {

        const search =
            req.query.search || "";

        const rating =
            req.query.rating || "";

        const reviews =
            await getAdminReviews(
                search,
                rating
            );

        return res.status(200).json({
            success: true,
            message: "Reviews fetched successfully",

            data: {
                reviews,
                totalReviews: reviews.length
            }
        });

    } catch (error) {

        console.error(
            "Admin Reviews Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch reviews"
        });
    }
};


module.exports = {
    getAdminDashboard,
    getAdminUsersController,
    getAdminItemsController,
    getAdminBookingsController,
    getAdminPaymentsController,
      getAdminReviewsController
};
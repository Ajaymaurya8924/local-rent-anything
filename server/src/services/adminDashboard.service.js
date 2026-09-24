const User = require("../models/user.model");
const Item = require("../models/item.model");
const Booking = require("../models/booking.model");
const Review = require("../models/review.model");

// =====================================================
// ADMIN DASHBOARD
// =====================================================

const getAdminDashboardData = async () => {
    const [
        totalUsers,
        totalItems,
        totalBookings,

        pendingBookings,
        acceptedBookings,
        rejectedBookings,
        cancelledBookings,

        activeRentals,
        returnedRentals,
        overdueRentals,

        revenueResult,

        recentUsers,
        recentBookings
    ] = await Promise.all([

        User.countDocuments({ role: "user" }),

        Item.countDocuments(),

        Booking.countDocuments(),

        Booking.countDocuments({ status: "pending" }),

        Booking.countDocuments({ status: "accepted" }),

        Booking.countDocuments({ status: "rejected" }),

        Booking.countDocuments({ status: "cancelled" }),

        Booking.countDocuments({
            status: "accepted",
            paymentStatus: "paid",
            returnStatus: "pending"
        }),

        Booking.countDocuments({
            returnStatus: "returned"
        }),

        Booking.countDocuments({
            returnStatus: "overdue"
        }),

        Booking.aggregate([
            {
                $match: {
                    paymentStatus: "paid"
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$totalAmount"
                    }
                }
            }
        ]),

        User.find({ role: "user" })
            .select(
                "fullName email phone city state profileImage role createdAt updatedAt"
            )
            .sort({ createdAt: -1 })
            .limit(5)
            .lean(),

        Booking.find()
            .populate("item", "title images category city state pricePerDay")
            .populate("renter", "fullName email phone")
            .populate("owner", "fullName email phone")
            .sort({ createdAt: -1 })
            .limit(5)
            .lean()
    ]);

    const totalRevenue =
        revenueResult.length > 0
            ? revenueResult[0].totalRevenue
            : 0;

    return {
        summary: {
            totalUsers,
            totalItems,
            totalBookings,
            totalRevenue
        },

        bookingStatus: {
            pending: pendingBookings,
            accepted: acceptedBookings,
            rejected: rejectedBookings,
            cancelled: cancelledBookings
        },

        rentals: {
            active: activeRentals,
            returned: returnedRentals,
            overdue: overdueRentals
        },

        recentUsers,
        recentBookings
    };
};


// =====================================================
// ADMIN USERS
// =====================================================

const getAdminUsers = async (search = "") => {

    const query = {
        role: "user"
    };

    if (search && search.trim()) {

        const searchRegex =
            new RegExp(search.trim(), "i");

        query.$or = [
            { fullName: searchRegex },
            { email: searchRegex },
            { city: searchRegex },
            { state: searchRegex }
        ];
    }

    const users = await User.find(query)
        .select(
            "fullName email phone city state profileImage role createdAt updatedAt"
        )
        .sort({ createdAt: -1 })
        .lean();

    return users;
};


// =====================================================
// ADMIN ITEMS
// =====================================================

const getAdminItems = async (search = "") => {

    const query = {};

    if (search && search.trim()) {

        const searchRegex =
            new RegExp(search.trim(), "i");

        query.$or = [
            { title: searchRegex },
            { category: searchRegex },
            { city: searchRegex },
            { state: searchRegex }
        ];
    }

    const items = await Item.find(query)
        .populate(
            "owner",
            "fullName email phone"
        )
        .sort({ createdAt: -1 })
        .lean();

    return items;
};


// =====================================================
// ADMIN BOOKINGS
// =====================================================

const getAdminBookings = async (
    search = "",
    status = ""
) => {

    const query = {};

    // Normal booking statuses
    if (
        status &&
        [
            "pending",
            "accepted",
            "rejected",
            "cancelled"
        ].includes(status)
    ) {
        query.status = status;
    }

    // Active rentals
    if (status === "active") {
        query.status = "accepted";
        query.paymentStatus = "paid";
        query.returnStatus = "pending";
    }

    // Returned rentals
    if (status === "returned") {
        query.returnStatus = "returned";
    }

    // Overdue rentals
    if (status === "overdue") {
        query.returnStatus = "overdue";
    }

    const bookings = await Booking.find(query)
        .populate(
            "item",
            "title images category city state pricePerDay"
        )
        .populate(
            "renter",
            "fullName email phone"
        )
        .populate(
            "owner",
            "fullName email phone"
        )
        .sort({ createdAt: -1 })
        .lean();

    // Search populated fields
    if (search && search.trim()) {

        const searchText =
            search.trim().toLowerCase();

        return bookings.filter((booking) => {

            const itemTitle =
                booking.item?.title?.toLowerCase() || "";

            const renterName =
                booking.renter?.fullName?.toLowerCase() || "";

            const renterEmail =
                booking.renter?.email?.toLowerCase() || "";

            const ownerName =
                booking.owner?.fullName?.toLowerCase() || "";

            const ownerEmail =
                booking.owner?.email?.toLowerCase() || "";

            return (
                itemTitle.includes(searchText) ||
                renterName.includes(searchText) ||
                renterEmail.includes(searchText) ||
                ownerName.includes(searchText) ||
                ownerEmail.includes(searchText)
            );
        });
    }

    return bookings;
};


// =====================================================
// ADMIN PAYMENTS
// =====================================================

const getAdminPayments = async (
    search = "",
    paymentStatus = ""
) => {

    const query = {};

    // Payment status filter
    if (
        paymentStatus &&
        ["pending", "paid", "failed"].includes(paymentStatus)
    ) {
        query.paymentStatus = paymentStatus;
    }

    const bookings = await Booking.find(query)
        .populate(
            "item",
            "title images category city state pricePerDay"
        )
        .populate(
            "renter",
            "fullName email phone"
        )
        .populate(
            "owner",
            "fullName email phone"
        )
        .sort({ createdAt: -1 })
        .lean();

    let payments = bookings;

    // Live search
    if (search && search.trim()) {

        const searchText =
            search.trim().toLowerCase();

        payments = bookings.filter((booking) => {

            const itemTitle =
                booking.item?.title?.toLowerCase() || "";

            const renterName =
                booking.renter?.fullName?.toLowerCase() || "";

            const renterEmail =
                booking.renter?.email?.toLowerCase() || "";

            const ownerName =
                booking.owner?.fullName?.toLowerCase() || "";

            const ownerEmail =
                booking.owner?.email?.toLowerCase() || "";

            const paymentId =
                booking.paymentId?.toLowerCase() || "";

            const orderId =
                booking.razorpayOrderId?.toLowerCase() || "";

            return (
                itemTitle.includes(searchText) ||
                renterName.includes(searchText) ||
                renterEmail.includes(searchText) ||
                ownerName.includes(searchText) ||
                ownerEmail.includes(searchText) ||
                paymentId.includes(searchText) ||
                orderId.includes(searchText)
            );
        });
    }

    // Payment statistics
    const totalPayments = payments.length;

    const paidPayments = payments.filter(
        (payment) =>
            payment.paymentStatus === "paid"
    ).length;

    const pendingPayments = payments.filter(
        (payment) =>
            payment.paymentStatus === "pending"
    ).length;

    const failedPayments = payments.filter(
        (payment) =>
            payment.paymentStatus === "failed"
    ).length;

    const totalRevenue = payments
        .filter(
            (payment) =>
                payment.paymentStatus === "paid"
        )
        .reduce(
            (total, payment) =>
                total + Number(payment.totalAmount || 0),
            0
        );

    return {
        payments,
        statistics: {
            totalPayments,
            paidPayments,
            pendingPayments,
            failedPayments,
            totalRevenue
        }
    };
};

// =====================================================
// ADMIN REVIEWS
// =====================================================

const getAdminReviews = async (
    search = "",
    rating = ""
) => {

    const query = {};

    // Rating filter
    if (
        rating &&
        ["1", "2", "3", "4", "5"].includes(rating)
    ) {
        query.rating = Number(rating);
    }

    const reviews = await Review.find(query)
        .populate(
            "item",
            "title images category city state owner"
        )
        .populate(
            "renter",
            "fullName email phone"
        )
        .populate(
            "booking",
            "startDate endDate totalAmount status paymentStatus"
        )
        .sort({ createdAt: -1 })
        .lean();

    // Populate item.owner separately
    const ownerIds = reviews
        .map((review) => review.item?.owner)
        .filter(Boolean);

    const owners = await User.find({
        _id: { $in: ownerIds }
    })
        .select("fullName email phone")
        .lean();

    const ownerMap = new Map(
        owners.map((owner) => [
            owner._id.toString(),
            owner
        ])
    );

    const reviewsWithOwner = reviews.map(
        (review) => {

            const ownerId =
                review.item?.owner?.toString();

            return {
                ...review,

                owner:
                    ownerId
                        ? ownerMap.get(ownerId) || null
                        : null
            };
        }
    );

    // Search
    if (search && search.trim()) {

        const searchText =
            search.trim().toLowerCase();

        return reviewsWithOwner.filter(
            (review) => {

                const itemTitle =
                    review.item?.title?.toLowerCase() || "";

                const renterName =
                    review.renter?.fullName?.toLowerCase() || "";

                const renterEmail =
                    review.renter?.email?.toLowerCase() || "";

                const ownerName =
                    review.owner?.fullName?.toLowerCase() || "";

                const ownerEmail =
                    review.owner?.email?.toLowerCase() || "";

                const comment =
                    review.comment?.toLowerCase() || "";

                return (
                    itemTitle.includes(searchText) ||
                    renterName.includes(searchText) ||
                    renterEmail.includes(searchText) ||
                    ownerName.includes(searchText) ||
                    ownerEmail.includes(searchText) ||
                    comment.includes(searchText)
                );
            }
        );
    }

    return reviewsWithOwner;
};

module.exports = {
    getAdminDashboardData,
    getAdminUsers,
    getAdminItems,
    getAdminBookings,
    getAdminPayments,
    getAdminReviews
};
const {
    createBooking,
    getBookingsByRenter,
    getBookingsByOwner,
    acceptBookingById,
     rejectBookingById,
     cancelBookingById,
     markBookingAsReturned 
} = require("../services/booking.service");


const addBooking = async (req, res) => {

    try {

        const renterId = req.user._id;

        const booking = await createBooking(
            req.body,
            renterId
        );

        res.status(201).json({
            success: true,
            message: "Booking request created successfully",
            data: {
                booking: booking
            }
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

const getMyBookings = async (req, res) => {

    try {

        const renterId = req.user._id;

        const bookings = await getBookingsByRenter(
            renterId
        );

        res.status(200).json({
            success: true,
            message: "Your bookings fetched successfully",
            data: {
                bookings: bookings
            }
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

const getReceivedBookings = async (req, res) => {

    try {

        const ownerId = req.user._id;

        const bookings = await getBookingsByOwner(
            ownerId
        );

        res.status(200).json({
            success: true,
            message: "Received booking requests fetched successfully",
            data: {
                bookings: bookings
            }
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

const acceptBooking = async (req, res) => {

    try {

        const bookingId = req.params.id;

        const ownerId = req.user._id;

        const booking = await acceptBookingById(
            bookingId,
            ownerId
        );

        res.status(200).json({
            success: true,
            message: "Booking accepted successfully",
            data: {
                booking: booking
            }
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

const rejectBooking = async (req, res) => {

    try {

        const bookingId = req.params.id;

        const ownerId = req.user._id;

        const booking = await rejectBookingById(
            bookingId,
            ownerId
        );

        res.status(200).json({
            success: true,
            message: "Booking rejected successfully",
            data: {
                booking: booking
            }
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

const cancelBooking = async (req, res) => {

    try {

        const bookingId = req.params.id;

        const renterId = req.user._id;

        const booking = await cancelBookingById(
            bookingId,
            renterId
        );

        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            data: {
                booking: booking
            }
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

const markAsReturned = async (req, res) => {
    try {
        const booking =
            await markBookingAsReturned(
                req.params.id,
                req.user._id
            );

        res.status(200).json({
            success: true,
            message: "Booking marked as returned",
            booking
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    addBooking,
     getMyBookings,
     getReceivedBookings,
     acceptBooking,
     rejectBooking,
     cancelBooking,
     markAsReturned
     
};
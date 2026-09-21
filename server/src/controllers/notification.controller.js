const {
    getUserNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead
} = require("../services/notification.service");


const getNotifications = async (req, res) => {
    try {

        const notifications =
            await getUserNotifications(
                req.user._id
            );

        res.status(200).json({
            success: true,
            message: "Notifications fetched successfully",
            data: {
                notifications
            }
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};


const getUnreadCount = async (req, res) => {
    try {

        const count =
            await getUnreadNotificationCount(
                req.user._id
            );

        res.status(200).json({
            success: true,
            message: "Unread count fetched successfully",
            data: {
                count
            }
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};


const markAsRead = async (req, res) => {
    try {

        const notification =
            await markNotificationAsRead(
                req.params.id,
                req.user._id
            );

        res.status(200).json({
            success: true,
            message: "Notification marked as read",
            data: {
                notification
            }
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};


const markAllAsRead = async (req, res) => {
    try {

        await markAllNotificationsAsRead(
            req.user._id
        );

        res.status(200).json({
            success: true,
            message: "All notifications marked as read"
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};




module.exports = {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    
};
const Notification = require("../models/notification.model");

const createNotification = async ({
    recipient,
    type,
    title,
    message,
    booking = null,
    item = null
}) => {

    const notification =
        await Notification.create({
            recipient,
            type,
            title,
            message,
            booking,
            item
        });

    return notification;
};


const getUserNotifications = async (userId) => {

    const notifications =
        await Notification.find({
            recipient: userId
        })
            .populate("item", "title images city state pricePerDay")
            .populate({
                path: "booking",
                populate: [
                    {
                        path: "renter",
                        select: "fullName email"
                    },
                    {
                        path: "owner",
                        select: "fullName email"
                    }
                ]
            })
            .sort({ createdAt: -1 });

    return notifications;
};


const getUnreadNotificationCount = async (userId) => {

    const count =
        await Notification.countDocuments({
            recipient: userId,
            isRead: false
        });

    return count;
};


const markNotificationAsRead = async (
    notificationId,
    userId
) => {

    const notification =
        await Notification.findOne({
            _id: notificationId,
            recipient: userId
        });

    if (!notification) {
        throw new Error(
            "Notification not found"
        );
    }

    notification.isRead = true;

    await notification.save();

    return notification;
};


const markAllNotificationsAsRead = async (
    userId
) => {

    await Notification.updateMany(
        {
            recipient: userId,
            isRead: false
        },
        {
            $set: {
                isRead: true
            }
        }
    );

    return true;
};


module.exports = {
    createNotification,
    getUserNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead
};
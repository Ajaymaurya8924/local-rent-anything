import api from "../api/axios";

const getNotifications = async () => {
    try {
        const response = await api.get("/notifications");
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getUnreadCount = async () => {
    try {
        const response = await api.get(
            "/notifications/unread-count"
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

const markNotificationAsRead = async (id) => {
    try {
        const response = await api.patch(
            `/notifications/${id}/read`
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

const markAllNotificationsAsRead = async () => {
    try {
        const response = await api.patch(
            "/notifications/read-all"
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export {
    getNotifications,
    getUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead
};
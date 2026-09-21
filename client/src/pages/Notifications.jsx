import { useEffect, useState } from "react";
import { FiBell, FiCheck, FiCalendar, FiUser } from "react-icons/fi";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
} from "../services/notificationService";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const response = await getNotifications();

            setNotifications(
                response.data.notifications || []
            );
        } catch (error) {
            toast.error("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleRead = async (notification) => {
        try {
            if (!notification.isRead) {
                await markNotificationAsRead(
                    notification._id
                );

                setNotifications((previous) =>
                    previous.map((item) =>
                        item._id === notification._id
                            ? { ...item, isRead: true }
                            : item
                    )
                );
            }
        } catch (error) {
            toast.error("Failed to update notification");
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsAsRead();

            setNotifications((previous) =>
                previous.map((item) => ({
                    ...item,
                    isRead: true
                }))
            );

            toast.success(
                "All notifications marked as read"
            );
        } catch (error) {
            toast.error(
                "Failed to update notifications"
            );
        }
    };

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
    };

    const getPerson = (notification) => {
        if (notification.type === "BOOKING_REQUEST") {
            return notification.booking?.renter;
        }

        if (
            notification.type === "BOOKING_ACCEPTED" ||
            notification.type === "BOOKING_REJECTED"
        ) {
            return notification.booking?.owner;
        }

        if (notification.type === "BOOKING_CANCELLED") {
            return notification.booking?.renter;
        }

        if (notification.type === "PAYMENT_SUCCESS") {
            return notification.booking?.renter;
        }

        return null;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">

                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Notifications
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Stay updated with your rental activity
                        </p>
                    </div>

                    {notifications.some(
                        (notification) =>
                            !notification.isRead
                    ) && (
                        <button
                            onClick={handleMarkAllRead}
                            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                        >
                            <FiCheck size={16} />
                            Mark All Read
                        </button>
                    )}
                </div>

                <div className="space-y-4">

                    {loading ? (
                        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center text-sm text-gray-500">
                            Loading notifications...
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
                            <FiBell
                                size={38}
                                className="mx-auto mb-3 text-gray-300"
                            />

                            <h2 className="font-semibold text-gray-700">
                                No notifications
                            </h2>

                            <p className="mt-1 text-sm text-gray-400">
                                You're all caught up.
                            </p>
                        </div>
                    ) : (
                        notifications.map(
                            (notification) => {
                                const booking =
                                    notification.booking;

                                const item =
                                    notification.item;

                                const person =
                                    getPerson(
                                        notification
                                    );

                                return (
                                    <button
                                        key={
                                            notification._id
                                        }
                                        onClick={() =>
                                            handleRead(
                                                notification
                                            )
                                        }
                                        className={`w-full rounded-2xl border p-5 text-left transition hover:shadow-sm ${
                                            notification.isRead
                                                ? "border-gray-200 bg-white"
                                                : "border-blue-200 bg-blue-50/40"
                                        }`}
                                    >
                                        <div className="flex gap-4">

                                            <div
                                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                                    notification.isRead
                                                        ? "bg-gray-100 text-gray-500"
                                                        : "bg-blue-100 text-blue-600"
                                                }`}
                                            >
                                                <FiBell
                                                    size={19}
                                                />
                                            </div>

                                            <div className="min-w-0 flex-1">

                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">
                                                            {
                                                                notification.title
                                                            }
                                                        </h3>

                                                        <p className="mt-1 text-sm leading-6 text-gray-500">
                                                            {
                                                                notification.message
                                                            }
                                                        </p>
                                                    </div>

                                                    {!notification.isRead && (
                                                        <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />
                                                    )}
                                                </div>

                                                {item && (
                                                    <div className="mt-4 flex items-center gap-3 rounded-xl bg-gray-50 p-3">

                                                        {item.images?.[0] ? (
                                                            <img
                                                                src={
                                                                    item.images[0]
                                                                }
                                                                alt={
                                                                    item.title
                                                                }
                                                                className="h-14 w-14 rounded-lg object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-200 text-xl">
                                                                📦
                                                            </div>
                                                        )}

                                                        <div>
                                                            <p className="text-xs text-gray-400">
                                                                Item
                                                            </p>

                                                            <p className="font-semibold text-gray-800">
                                                                {
                                                                    item.title
                                                                }
                                                            </p>

                                                            <p className="text-xs text-gray-400">
                                                                {
                                                                    item.city
                                                                }
                                                                {item.state
                                                                    ? `, ${item.state}`
                                                                    : ""}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {person && (
                                                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                                                        <FiUser
                                                            size={15}
                                                            className="text-gray-400"
                                                        />

                                                        <span>
                                                            {notification.type ===
                                                            "BOOKING_REQUEST"
                                                                ? "Requested by"
                                                                : "User"}
                                                            :
                                                        </span>

                                                        <span className="font-semibold text-gray-800">
                                                            {
                                                                person.fullName
                                                            }
                                                        </span>
                                                    </div>
                                                )}

                                                {booking && (
                                                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">

                                                        <div className="flex items-center gap-1.5">
                                                            <FiCalendar
                                                                size={14}
                                                            />

                                                            <span>
                                                                {formatDate(
                                                                    booking.startDate
                                                                )}
                                                                {" → "}
                                                                {formatDate(
                                                                    booking.endDate
                                                                )}
                                                            </span>
                                                        </div>

                                                        <div>
                                                            <span>
                                                                ₹
                                                                {
                                                                    booking.totalAmount
                                                                }
                                                            </span>
                                                        </div>

                                                        <div>
                                                            <span>
                                                                {
                                                                    booking.totalDays
                                                                }{" "}
                                                                day
                                                                {booking.totalDays >
                                                                1
                                                                    ? "s"
                                                                    : ""}
                                                            </span>
                                                        </div>

                                                    </div>
                                                )}

                                                <p className="mt-3 text-[11px] text-gray-400">
                                                    {new Date(
                                                        notification.createdAt
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </p>

                                            </div>
                                        </div>
                                    </button>
                                );
                            }
                        )
                    )}

                </div>
            </main>
        </div>
    );
}

export default Notifications;
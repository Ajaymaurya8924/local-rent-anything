const cron = require("node-cron");

const Booking = require("../models/booking.model");
const Notification = require("../models/notification.model");

const {
    createNotification
} = require("./notification.service");

const {
    addEmailJob
} = require("./emailQueue.service");

const User = require("../models/user.model");
const Item = require("../models/item.model");

const sendReturnNotification = async (
    booking,
    type,
    title,
    message
) => {
    const existingNotification =
        await Notification.findOne({
            booking: booking._id,
            recipient: booking.renter,
            type
        });

    if (existingNotification) {
        return;
    }

    const renter = await User.findById(
        booking.renter
    ).select("fullName email");

    const item = await Item.findById(
        booking.item
    ).select("title");

    if (!renter || !item) {
        return;
    }

    await createNotification({
        recipient: booking.renter,
        type,
        title,
        message,
        booking: booking._id,
        item: booking.item
    });

    await addEmailJob({
        to: renter.email,
        subject: title,
        text:
            `Hello ${renter.fullName},\n\n` +
            `${message}\n\n` +
            `Item: ${item.title}\n` +
            `Return Date: ${new Date(
                booking.endDate
            ).toLocaleDateString("en-IN")}\n\n` +
            `Thank you,\nLocal Rent Anything`,

        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                <h2>${title}</h2>

                <p>Hello ${renter.fullName},</p>

                <p>${message}</p>

                <p>
                    <strong>Item:</strong>
                    ${item.title}
                </p>

                <p>
                    <strong>Return Date:</strong>
                    ${new Date(
                        booking.endDate
                    ).toLocaleDateString("en-IN")}
                </p>

                <p>
                    Thank you,<br>
                    Local Rent Anything
                </p>
            </div>
        `
    });
};

const checkReturnDates = async () => {
    try {
        const today = new Date();

        const tomorrow = new Date(today);
        tomorrow.setDate(
            tomorrow.getDate() + 1
        );

        const startToday = new Date(today);
        startToday.setHours(0, 0, 0, 0);

        const endToday = new Date(today);
        endToday.setHours(23, 59, 59, 999);

        const startTomorrow = new Date(tomorrow);
        startTomorrow.setHours(0, 0, 0, 0);

        const endTomorrow = new Date(tomorrow);
        endTomorrow.setHours(23, 59, 59, 999);

        const bookings =
            await Booking.find({
                status: "accepted",
                paymentStatus: "paid",
                returnStatus: {
                    $ne: "returned"
                }
            });

        for (const booking of bookings) {
            const endDate =
                new Date(booking.endDate);

            if (
                endDate >= startTomorrow &&
                endDate <= endTomorrow
            ) {
                await sendReturnNotification(
                    booking,
                    "RETURN_REMINDER",
                    "Return Reminder",
                    "Your rental return date is tomorrow. Please return the item on time."
                );
            }

            if (
                endDate >= startToday &&
                endDate <= endToday
            ) {
                await sendReturnNotification(
                    booking,
                    "RETURN_DUE",
                    "Return Due Today",
                    "Your rental return is due today. Please return the item today."
                );
            }

            if (endDate < startToday) {
                booking.returnStatus = "overdue";

                await booking.save();

                await sendReturnNotification(
                    booking,
                    "RENTAL_OVERDUE",
                    "Rental Overdue",
                    "Your rental return date has passed. Please return the item as soon as possible."
                );
            }
        }

        console.log(
            "Return reminder check completed"
        );

    } catch (error) {
        console.error(
            "Return reminder error:",
            error.message
        );
    }
};

const startReturnReminderScheduler = () => {
    cron.schedule(
        "0 9 * * *",
        async () => {
            console.log(
                "Running return reminder scheduler..."
            );

            await checkReturnDates();
        }
    );

    console.log(
        "Return reminder scheduler started"
    );
};

module.exports = {
    startReturnReminderScheduler,
    checkReturnDates
};
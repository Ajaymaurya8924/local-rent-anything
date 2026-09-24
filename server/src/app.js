const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const healthRoutes = require("./routes/health.route");
const authRoutes = require("./routes/auth.route");
const itemRoutes = require("./routes/item.route");
const bookingRoutes = require("./routes/booking.route");
const paymentRoutes = require("./routes/payment.route");
const notificationRoutes = require("./routes/notification.route");
const emailRoutes = require("./routes/email.route");
const reviewRoutes = require("./routes/review.route");

const auditLogRoutes = require("./routes/auditLog.route");

const adminDashboardRoutes =
    require("./routes/adminDashboard.route");

const app = express();

// ==========================
// Middlewares
// ==========================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ==========================
// Routes
// ==========================

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/items", itemRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/payments", paymentRoutes);

// ==========================
// Notifications
// ==========================
app.use(
    "/api/v1/notifications",
    notificationRoutes
);
app.use("/api/v1/email", emailRoutes);

app.use("/api/v1/reviews", reviewRoutes);

app.use("/api/v1/audit-logs", auditLogRoutes);

app.use(
    "/api/v1/admin/dashboard",
    adminDashboardRoutes
);

module.exports = app;
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

import ProtectedRoute from "./components/ProtectedRoute";

import Items from "./pages/Items";
import ItemDetails from "./pages/ItemDetails";
import AddItem from "./pages/AddItem";
import MyItems from "./pages/MyItems";
import EditItem from "./pages/EditItem";

import MyBookings from "./pages/MyBookings";
import ReceivedBookings from "./pages/ReceivedBookings";

import Notifications from "./pages/Notifications";

import ActivityHistory from "./pages/ActivityHistory";
import Dashboard from "./pages/Dashboard";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";

import AdminUsers from "./pages/AdminUsers";

import AdminItems from "./pages/AdminItems";

import AdminBookings from "./pages/AdminBookings";

import AdminPayments from "./pages/AdminPayments";

import AdminReviews from "./pages/AdminReviews";

import AdminAuditLogs from "./pages/AdminAuditLogs";

import AdminProfile from "./pages/AdminProfile";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* ================= PUBLIC ================= */}

                <Route
                    path="/"
                    element={<Register />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* ================= PROTECTED ================= */}

                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/admin/dashboard"
                    element={
                        <AdminProtectedRoute>
                            <AdminDashboard />
                        </AdminProtectedRoute>
                    }
                />


                <Route
                    path="/admin/users"
                    element={
                        <AdminProtectedRoute>
                            <AdminUsers />
                        </AdminProtectedRoute>
                    }
                />


                <Route
    path="/admin/items"
    element={
        <AdminProtectedRoute>
            <AdminItems />
        </AdminProtectedRoute>
    }
/>

<Route
    path="/admin/bookings"
    element={
        <AdminProtectedRoute>
            <AdminBookings />
        </AdminProtectedRoute>
    }
/>

<Route
    path="/admin/payments"
    element={
        <AdminProtectedRoute>
            <AdminPayments />
        </AdminProtectedRoute>
    }
/>

<Route
    path="/admin/reviews"
    element={
        <AdminProtectedRoute>
            <AdminReviews />
        </AdminProtectedRoute>
    }
/>

<Route
    path="/admin/audit-logs"
    element={
        <AdminProtectedRoute>
            <AdminAuditLogs />
        </AdminProtectedRoute>
    }
/>

<Route
    path="/admin/profile"
    element={
        <AdminProtectedRoute>
            <AdminProfile />
        </AdminProtectedRoute>
    }
/>


                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/items"
                    element={
                        <ProtectedRoute>
                            <Items />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/items/:id"
                    element={
                        <ProtectedRoute>
                            <ItemDetails />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/add-item"
                    element={
                        <ProtectedRoute>
                            <AddItem />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/my-items"
                    element={
                        <ProtectedRoute>
                            <MyItems />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/edit-item/:id"
                    element={
                        <ProtectedRoute>
                            <EditItem />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/my-bookings"
                    element={
                        <ProtectedRoute>
                            <MyBookings />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/received-bookings"
                    element={
                        <ProtectedRoute>
                            <ReceivedBookings />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/notifications"
                    element={
                        <ProtectedRoute>
                            <Notifications />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/activity"
                    element={
                        <ProtectedRoute>
                            <ActivityHistory />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;
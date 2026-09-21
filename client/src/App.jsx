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

            </Routes>

        </BrowserRouter>
    );
}

export default App;
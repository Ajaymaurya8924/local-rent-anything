import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

import {
    loginUser,
    getCurrentUser
} from "../services/authService";

import {
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
} from "react-icons/fa";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Please fill all fields");
            return;
        }

        try {
            setLoading(true);

            // ==========================================
            // LOGIN
            // ==========================================

            const loginResponse = await loginUser({
                email,
                password,
            });

            console.log("LOGIN RESPONSE:", loginResponse);

            // ==========================================
            // GET ACTUAL CURRENT USER
            // This gets the role directly from backend
            // ==========================================

            const currentUserResponse = await getCurrentUser();

            console.log(
                "CURRENT USER RESPONSE:",
                currentUserResponse
            );

            // Your existing authService returns response.data
            // so normally user will be here:
            const user =
                currentUserResponse?.data?.user ||
                currentUserResponse?.user ||
                currentUserResponse?.data;

            console.log("LOGGED IN USER:", user);
            console.log("USER ROLE:", user?.role);

            toast.success(
                loginResponse?.message ||
                "Login successful"
            );

            // ==========================================
            // ROLE BASED REDIRECTION
            // ==========================================

            setTimeout(() => {

                if (user?.role === "admin") {

                    console.log(
                        "Admin detected → Opening Admin Dashboard"
                    );

                    navigate("/admin/dashboard");

                } else {

                    console.log(
                        "Normal user detected → Opening Home"
                    );

                    navigate("/home");
                }

            }, 1000);

        } catch (error) {

            console.error("LOGIN ERROR:", error);

            toast.error(
                error?.response?.data?.message ||
                "Login Failed"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Toaster position="top-right" />

            <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-700 flex justify-center items-center p-5">

                <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

                    <h1 className="text-3xl font-bold text-center">
                        Welcome Back
                    </h1>

                    <p className="text-center text-gray-500 mt-2 mb-6">
                        Login to your account
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* EMAIL */}

                        <div className="relative">

                            <FaEnvelope className="absolute left-3 top-4 text-gray-400" />

                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full border rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                            />

                        </div>


                        {/* PASSWORD */}

                        <div className="relative">

                            <FaLock className="absolute left-3 top-4 text-gray-400" />

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Password"
                                className="w-full border rounded-lg py-3 pl-10 pr-10 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                            />

                            <button
                                type="button"
                                className="absolute right-3 top-4"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            >
                                {showPassword ? (
                                    <FaEyeSlash />
                                ) : (
                                    <FaEye />
                                )}
                            </button>

                        </div>


                        {/* LOGIN BUTTON */}

                        <button
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
                        >
                            {loading
                                ? "Logging In..."
                                : "Login"}
                        </button>


                        {/* REGISTER */}

                        <p className="text-center">

                            Don't have an account?

                            <Link
                                to="/register"
                                className="text-blue-600 ml-2 font-semibold hover:underline"
                            >
                                Register
                            </Link>

                        </p>

                    </form>

                </div>

            </div>
        </>
    );
}

export default Login;
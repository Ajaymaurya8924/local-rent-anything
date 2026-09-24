import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/authService";

function AdminProtectedRoute({ children }) {

    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {

        const checkAdmin = async () => {

            try {

                const response = await getCurrentUser();

                const user = response?.data?.user || response?.user || response?.data;

                if (user?.role === "admin") {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }

            } catch (error) {

                setIsAdmin(false);

            } finally {

                setLoading(false);

            }
        };

        checkAdmin();

    }, []);

    if (loading) {

        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

                    <p className="text-sm font-medium text-slate-600">
                        Checking admin access...
                    </p>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default AdminProtectedRoute;
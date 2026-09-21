import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/authService";

function ProtectedRoute({ children }) {

    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {

        const checkUser = async () => {

            try {

                await getCurrentUser();

                setIsAuthenticated(true);

            } catch (error) {

                setIsAuthenticated(false);

            } finally {

                setLoading(false);

            }

        };

        checkUser();

    }, []);

    if (loading) {
        return <h2 className="text-center mt-10">Loading...</h2>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
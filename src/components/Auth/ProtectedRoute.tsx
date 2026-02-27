import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../firebase/AuthContext';
import LoadingSkeleton from '../Common/LoadingSkeleton';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <LoadingSkeleton.Page />;
    }

    if (!user) {
        // Redirect to the login page, but save the current location they were trying to go to
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;

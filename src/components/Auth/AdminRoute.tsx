import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../firebase/AuthContext';
import LoadingSkeleton from '../Common/LoadingSkeleton';

interface AdminRouteProps {
    children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const { user, isAdmin, loading } = useAuth();

    if (loading) {
        return <LoadingSkeleton.Page />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        // Not an admin, redirect to home page
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default AdminRoute;

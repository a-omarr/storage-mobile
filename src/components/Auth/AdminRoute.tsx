import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../firebase/AuthContext';
import LoadingSkeleton from '../Common/LoadingSkeleton';

interface AdminRouteProps {
    children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const { user, isAdmin, loading } = useAuth();

    return loading ? (
        <LoadingSkeleton.Page />
    ) : !user ? (
        <Navigate to="/login" replace />
    ) : !isAdmin ? (
        <Navigate to="/" replace />
    ) : (
        <>{children}</>
    );
};

export default AdminRoute;

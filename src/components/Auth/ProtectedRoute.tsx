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

    return loading ? (
        <LoadingSkeleton.Page />
    ) : !user ? (
        <Navigate to="/login" state={{ from: location }} replace />
    ) : (
        <>{children}</>
    );
};

export default ProtectedRoute;

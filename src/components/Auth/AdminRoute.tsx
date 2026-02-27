import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../firebase/AuthContext';
import { Spin } from 'antd';

interface AdminRouteProps {
    children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const { user, isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
                <Spin size="large" tip="جاري التحقق من الصلاحيات..." />
            </div>
        );
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

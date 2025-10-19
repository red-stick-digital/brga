import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * ProtectedRoute Component
 * 
 * This component wraps pages that require authentication.
 * If user is not logged in, they're redirected to login page.
 * If user is still loading, show a loading message.
 * If user is logged in, show the requested page.
 */
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
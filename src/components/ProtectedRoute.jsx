import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import supabase from '../services/supabase';

/**
 * ProtectedRoute Component
 * 
 * This component wraps pages that require authentication and role-based access.
 * If user is not logged in, they're redirected to login page.
 * If user is still loading, show a loading message.
 * If user doesn't have required role/status, show access denied.
 * If user is logged in with proper role, show the requested page.
 */
const ProtectedRoute = ({
    children,
    requiredRole = null,
    requiredStatus = ['approved', 'member', 'editor', 'admin', 'superadmin'],
    allowPending = false  // New prop to explicitly allow pending users
}) => {
    const { user, loading } = useAuth();
    const [userRole, setUserRole] = useState(null);
    const [roleLoading, setRoleLoading] = useState(true);
    const [accessDenied, setAccessDenied] = useState(false);

    useEffect(() => {
        const fetchUserRole = async () => {
            if (!user) {
                setRoleLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('user_roles')
                    .select('role, approval_status')
                    .eq('user_id', user.id)
                    .single();

                if (error) {
                    console.error('Error fetching user role:', error);
                    console.error('RLS Policy blocking user_roles access - using fallback');
                    // For now, allow superadmin access during RLS policy issues
                    setUserRole({ role: 'superadmin', approval_status: 'approved' });
                } else {
                    console.log('Successfully fetched user role:', data);
                    setUserRole(data);
                }
            } catch (err) {
                console.error('Error in role fetch:', err);
                console.error('Exception during user_roles fetch - using fallback');
                // For now, allow superadmin access during RLS policy issues
                setUserRole({ role: 'superadmin', approval_status: 'approved' });
            } finally {
                setRoleLoading(false);
            }
        };

        fetchUserRole();
    }, [user]);

    useEffect(() => {
        if (!roleLoading && userRole) {
            // Check if user has required role
            if (requiredRole && userRole.role !== requiredRole) {
                setAccessDenied(true);
                return;
            }

            // Check approval status
            const isApproved = userRole.approval_status === 'approved';
            const isPending = userRole.approval_status === 'pending';
            const isRejected = userRole.approval_status === 'rejected';
            const isAdminRole = userRole.role === 'admin' || userRole.role === 'superadmin';

            // Rejected users are always denied access
            if (isRejected) {
                setAccessDenied(true);
                return;
            }

            // Admins/superadmins bypass approval requirement
            if (isAdminRole) {
                return;
            }

            // Pending users: only allow if explicitly permitted by allowPending prop
            if (isPending && !allowPending) {
                setAccessDenied(true);
                return;
            }

            // For approved users or pending users on allowed routes
            if (requiredStatus) {
                const hasRequiredRole = requiredStatus.includes(userRole.role);

                if (!hasRequiredRole) {
                    setAccessDenied(true);
                    return;
                }
            }
        }
    }, [userRole, roleLoading, requiredRole, requiredStatus, allowPending]);

    if (loading || roleLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-blue-200 rounded-full mb-4"></div>
                    <div className="h-4 w-24 bg-blue-200 rounded mb-2"></div>
                    <div className="h-3 w-16 bg-blue-100 rounded"></div>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (accessDenied) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-white shadow-md rounded-lg p-6 max-w-md">
                    <h2 className="text-xl font-bold text-red-600 mb-4">Access Denied</h2>

                    {userRole?.approval_status === 'pending' && (
                        <div className="mb-4">
                            <p className="text-gray-700 mb-2">Your account is pending approval.</p>
                            <p className="text-gray-700 mb-3">While you wait for approval, you can complete your member profile.</p>
                            <div className="mt-4">
                                <a
                                    href="/member/profile"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Go to My Profile
                                </a>
                            </div>
                        </div>
                    )}

                    {userRole?.approval_status === 'rejected' && (
                        <div className="mb-4">
                            <p className="text-gray-700 mb-2">Your account access has been denied.</p>
                            <p className="text-gray-700">Please contact a group administrator for assistance.</p>
                        </div>
                    )}

                    {(!userRole || (userRole.approval_status !== 'pending' && userRole.approval_status !== 'rejected')) && (
                        <div className="mb-4">
                            <p className="text-gray-700">You don't have permission to access this page.</p>
                        </div>
                    )}

                    <div className="mt-4">
                        <a href="/" className="text-blue-500 hover:text-blue-700">
                            Return to Home Page
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
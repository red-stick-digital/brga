import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useUserRole from '../../hooks/useUserRole';

/**
 * MemberNav - Secondary navigation bar for authenticated users
 * Shows: Home | Directory | Profile | Admin (conditional) | Logout
 * Only visible when user is logged in
 */
const MemberNav = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { role, loading: roleLoading } = useUserRole();

    // Don't render if no user
    if (!user) return null;

    const isAdmin = !roleLoading && (role === 'admin' || role === 'superadmin');

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await logout();
            navigate('/', { replace: true });
        } catch (error) {
            console.error('Error during logout:', error);
            navigate('/', { replace: true });
        }
    };

    const navLinks = [
        { name: 'Home', href: '/authhome', show: true },
        { name: 'Directory', href: '/memberdirectory', show: true },
        { name: 'Profile', href: '/member/profile', show: true },
        { name: 'Admin', href: '/admin/dashboard', show: isAdmin },
        { name: 'Logout', href: '#', show: true, isLogout: true },
    ];

    const isActive = (href) => location.pathname === href;

    return (
        <nav className="bg-blue-600 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-12">
                    {/* Navigation Links */}
                    <div className="flex space-x-1">
                        {navLinks.map((link) =>
                            link.show ? (
                                link.isLogout ? (
                                    <button
                                        key={link.name}
                                        onClick={handleLogout}
                                        className="px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 rounded-md transition-colors"
                                    >
                                        {link.name}
                                    </button>
                                ) : (
                                    <Link
                                        key={link.name}
                                        to={link.href}
                                        className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${isActive(link.href)
                                                ? 'bg-white text-blue-600'
                                                : 'text-white hover:bg-blue-700'
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                )
                            ) : null
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default MemberNav;

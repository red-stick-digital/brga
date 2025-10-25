import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import useUserRole from '../hooks/useUserRole';
import useEvents from '../hooks/useEvents';
import useAnnouncements from '../hooks/useAnnouncements';
import useMemberProfile from '../hooks/useMemberProfile';
import ProfileCompletionModal from '../components/common/ProfileCompletionModal';
import { format } from 'date-fns';

const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
};

const AuthHome = () => {
    const { user } = useAuth();
    const { role, loading: roleLoading, approvalStatus } = useUserRole();
    const { events, loading: eventsLoading, error: eventsError, refetch: refetchEvents } = useEvents();
    const { announcements, loading: announcementsLoading, error: announcementsError, refetch: refetchAnnouncements } = useAnnouncements();
    const { profile, loading: profileLoading } = useMemberProfile();
    const [showProfileModal, setShowProfileModal] = useState(false);

    useEffect(() => {
        refetchEvents();
        refetchAnnouncements();
    }, []);

    // Check if we should show the profile completion modal
    useEffect(() => {
        // Only show modal if:
        // 1. Profile has loaded
        // 2. User exists
        // 3. Profile exists
        // 4. Profile is NOT complete
        if (!profileLoading && user && profile && profile.profile_complete === false) {
            setShowProfileModal(true);
        }
    }, [profile, profileLoading, user]);

    // Check if user is pending approval
    const isPending = approvalStatus === 'pending';
    const isApproved = approvalStatus === 'approved';
    const isAdmin = role === 'admin' || role === 'superadmin';

    // Show loading state while role is being fetched
    if (roleLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Pending status screen
    if (isPending) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg shadow-sm">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-lg font-medium text-yellow-800">
                                    Account Pending Approval
                                </h3>
                                <div className="mt-2 text-sm text-yellow-700">
                                    <p className="mb-3">
                                        Welcome! Your account has been created and is currently pending admin approval.
                                    </p>
                                    <p className="mb-3">
                                        While you wait for approval, please complete your member profile so we can better assist you in your recovery journey.
                                    </p>
                                    <p className="font-semibold">
                                        You'll receive an email notification once your account has been approved.
                                    </p>
                                </div>
                                <div className="mt-4">
                                    <Link
                                        to="/member/profile"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-yellow-800 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                                    >
                                        Complete Your Profile
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Show limited announcements for pending users */}
                    {!announcementsLoading && announcements.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Announcements</h2>
                            <div className="space-y-4">
                                {announcements.slice(0, 3).map((announcement) => (
                                    <div key={announcement.id} className="bg-white shadow rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {announcement.title}
                                        </h3>
                                        <p className="text-gray-600 whitespace-pre-wrap">
                                            {announcement.content}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            {/* Profile Completion Modal */}
            <ProfileCompletionModal
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Welcome Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back, {profile?.first_name || user?.email?.split('@')[0]}!
                    </h1>
                    <p className="mt-2 text-gray-600">
                        You're logged in to the Baton Rouge GA member area.
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Member Directory Button */}
                    <Link
                        to="/memberdirectory"
                        className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow border-2 border-blue-500"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Member Directory
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Connect with fellow members
                                </p>
                            </div>
                            <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    </Link>

                    {/* My Profile Button */}
                    <Link
                        to="/member/profile"
                        className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    My Profile
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Update your information
                                </p>
                            </div>
                            <svg className="h-8 w-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                    </Link>

                    {/* Admin Dashboard Button (if admin) */}
                    {isAdmin && (
                        <Link
                            to="/admin/dashboard"
                            className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow border-2 border-purple-500"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Admin Dashboard
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Manage members and content
                                    </p>
                                </div>
                                <svg className="h-8 w-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                        </Link>
                    )}
                </div>

                {/* Announcements Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Announcements</h2>
                    {announcementsLoading ? (
                        <div className="space-y-4">
                            {Array(2).fill(0).map((_, i) => (
                                <div key={i} className="bg-white shadow rounded-lg p-6 animate-pulse">
                                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                </div>
                            ))}
                        </div>
                    ) : announcementsError ? (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4">
                            <p className="text-sm text-red-700">{announcementsError}</p>
                        </div>
                    ) : announcements.length === 0 ? (
                        <div className="bg-gray-100 rounded-lg p-6 text-center">
                            <p className="text-gray-600">No announcements at this time.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {announcements.map((announcement) => (
                                <div
                                    key={announcement.id}
                                    className={`bg-white shadow rounded-lg p-6 ${announcement.type === 'urgent' ? 'border-l-4 border-red-500' : ''
                                        }`}
                                >
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {announcement.title}
                                        {announcement.type === 'urgent' && (
                                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                Urgent
                                            </span>
                                        )}
                                    </h3>
                                    <p className="text-gray-600 whitespace-pre-wrap">{announcement.content}</p>
                                    {announcement.created_at && (
                                        <p className="mt-3 text-xs text-gray-500">
                                            Posted {format(new Date(announcement.created_at), 'MMM d, yyyy')}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Events Section */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
                    {eventsLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array(3).fill(0).map((_, i) => (
                                <div key={i} className="bg-white shadow rounded-lg p-6 animate-pulse">
                                    <div className="h-6 bg-gray-200 rounded w-2/3 mb-3"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                </div>
                            ))}
                        </div>
                    ) : eventsError ? (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4">
                            <p className="text-sm text-red-700">{eventsError}</p>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="bg-gray-100 rounded-lg p-6 text-center">
                            <p className="text-gray-600">No upcoming events scheduled.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.map((event) => (
                                <div key={event.id} className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {event.title}
                                    </h3>
                                    {event.event_date && (
                                        <p className="text-sm text-blue-600 mb-2">
                                            📅 {format(new Date(event.event_date), 'EEEE, MMMM d, yyyy')}
                                        </p>
                                    )}
                                    {(event.start_time || event.end_time) && (
                                        <p className="text-sm text-gray-600 mb-2">
                                            🕐 {event.start_time && formatTime(event.start_time)}
                                            {event.start_time && event.end_time && ' - '}
                                            {event.end_time && formatTime(event.end_time)}
                                        </p>
                                    )}
                                    {event.location && (
                                        <p className="text-sm text-gray-600 mb-2">
                                            📍 {event.location}
                                        </p>
                                    )}
                                    {event.address && (
                                        <p className="text-sm text-gray-600 mb-2">
                                            🏠 {event.address}
                                        </p>
                                    )}
                                    {event.recurrence_pattern && (
                                        <p className="text-sm text-gray-600 mb-2">
                                            🔄 {event.recurrence_pattern}
                                        </p>
                                    )}
                                    {event.description && (
                                        <p className="text-gray-600 mt-3 text-sm">{event.description}</p>
                                    )}
                                    {event.map_link && (
                                        <a
                                            href={event.map_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block mt-3 text-sm text-blue-600 hover:text-blue-800 underline"
                                        >
                                            View on Map →
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthHome;
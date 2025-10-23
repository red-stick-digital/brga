import React, { useState } from 'react';
import ProfileView from '../components/MemberProfile/ProfileView';
import ProfileForm from '../components/MemberProfile/ProfileForm';
import useMemberProfile from '../hooks/useMemberProfile';
import useAuth from '../hooks/useAuth';
import useUserRole from '../hooks/useUserRole';
import { calculateProfileCompletionPercentage } from '../utils/profileCompletion';

/**
 * MemberProfile Component
 * 
 * Profile page for members to view and edit their profile information
 * Shows profile completion status and home group assignments
 */
const MemberProfile = () => {
    const { user } = useAuth();
    const { profile, loading, error } = useMemberProfile();
    const { approvalStatus, loading: roleLoading } = useUserRole();
    const [isEditing, setIsEditing] = useState(false);

    const isPending = approvalStatus === 'pending';

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white shadow-md rounded-lg p-6 animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                    <div className="h-10 bg-gray-200 rounded w-1/4 mt-6"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Profile</h1>
                    <p className="text-gray-700 mb-4">{error}</p>
                    <p className="text-gray-700">Please try refreshing the page or contact support if the problem persists.</p>
                </div>
            </div>
        );
    }

    // Calculate profile completion percentage
    const completionPercentage = calculateProfileCompletionPercentage(profile);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Pending Approval Banner */}
            {isPending && (
                <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow-sm">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">
                                Account Pending Approval
                            </h3>
                            <div className="mt-2 text-sm text-yellow-700">
                                <p>
                                    Your account is awaiting admin approval. Please complete your profile below.
                                    You'll have full access to the member area once approved.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold text-blue-600 mb-4">Member Profile</h1>

                {/* Profile Completion Status */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Profile Completion</h2>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${completionPercentage}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{completionPercentage}% Complete</p>
                </div>

                {/* Profile View or Edit Form */}
                {isEditing ? (
                    <ProfileForm
                        profile={profile}
                        onCancel={() => setIsEditing(false)}
                        onSuccess={() => setIsEditing(false)}
                    />
                ) : (
                    <ProfileView
                        profile={profile}
                        onEdit={() => setIsEditing(true)}
                    />
                )}
            </div>
        </div>
    );
};

export default MemberProfile;
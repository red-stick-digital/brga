import React, { useState } from 'react';
import ProfileView from '../components/MemberProfile/ProfileView';
import ProfileForm from '../components/MemberProfile/ProfileForm';
import useMemberProfile from '../hooks/useMemberProfile';
import useAuth from '../hooks/useAuth';

/**
 * MemberProfile Component
 * 
 * Profile page for members to view and edit their profile information
 * Shows profile completion status and home group assignments
 */
const MemberProfile = () => {
    const { user } = useAuth();
    const { profile, loading, error } = useMemberProfile();
    const [isEditing, setIsEditing] = useState(false);

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
    const calculateCompletion = () => {
        if (!profile) return 0;

        const fields = ['first_name', 'last_name', 'phone', 'email', 'clean_date', 'home_group_id'];
        const completedFields = fields.filter(field => profile[field] !== null && profile[field] !== undefined && profile[field] !== '');
        return Math.round((completedFields.length / fields.length) * 100);
    };

    const completionPercentage = calculateCompletion();

    return (
        <div className="container mx-auto px-4 py-8">
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
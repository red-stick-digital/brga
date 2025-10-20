import React from 'react';
import { format } from 'date-fns';
import useUserRole from '../../hooks/useUserRole';

/**
 * ProfileView Component
 * 
 * Displays member information in read-only format
 * Shows home group details, directory listing status, and sponsor availability
 */
const ProfileView = ({ profile, onEdit }) => {
    const { role, loading: roleLoading } = useUserRole();

    // Handle case where profile doesn't exist yet
    if (!profile) {
        return (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                            You haven't created your profile yet. Click the button below to get started.
                        </p>
                    </div>
                </div>
                <button
                    onClick={onEdit}
                    className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Create Profile
                </button>
            </div>
        );
    }

    // Format phone number for display (XXX-XXX-XXXX)
    const formatPhoneNumber = (phoneString) => {
        if (!phoneString) return 'Not specified';

        const digits = phoneString.replace(/\D/g, '');
        if (digits.length !== 10) return phoneString;

        return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    };

    // Format clean date to show years and months of sobriety
    const formatCleanDate = (dateString) => {
        if (!dateString) return 'Not specified';

        const cleanDate = new Date(dateString);
        const today = new Date();

        const yearDiff = today.getFullYear() - cleanDate.getFullYear();
        const monthDiff = today.getMonth() - cleanDate.getMonth();

        let years = yearDiff;
        let months = monthDiff;

        if (monthDiff < 0) {
            years--;
            months = 12 + monthDiff;
        }

        const formattedDate = format(cleanDate, 'MMMM d, yyyy');
        const sobrietyTime = years > 0
            ? `${years} year${years !== 1 ? 's' : ''} ${months > 0 ? `and ${months} month${months !== 1 ? 's' : ''}` : ''}`
            : `${months} month${months !== 1 ? 's' : ''}`;

        return `${formattedDate} (${sobrietyTime})`;
    };

    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Profile</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Personal Information</h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                        <div className="mb-3">
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="font-medium">{profile.full_name || 'Not specified'}</p>
                        </div>
                        <div className="mb-3">
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{profile.email || 'Not specified'}</p>
                        </div>
                        <div className="mb-3">
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium">{formatPhoneNumber(profile.phone)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Clean Date</p>
                            <p className="font-medium">{profile.clean_date ? formatCleanDate(profile.clean_date) : 'Not specified'}</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Group & Preferences</h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                        <div className="mb-3">
                            <p className="text-sm text-gray-500">Home Group</p>
                            <p className="font-medium">{profile.home_group?.name || 'Not specified'}</p>
                            {profile.home_group && (
                                <p className="text-sm text-gray-500 mt-1">
                                    {profile.home_group.street_1}, {profile.home_group.city} - {format(new Date(`2000-01-01T${profile.home_group.start_time}`), 'h:mm a')}
                                </p>
                            )}
                        </div>
                        <div className="mb-3">
                            <p className="text-sm text-gray-500">Directory Listing</p>
                            <p className="font-medium flex items-center">
                                {profile.listed_in_directory ? (
                                    <>
                                        <svg className="h-5 w-5 text-green-500 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Listed in member directory
                                    </>
                                ) : (
                                    <>
                                        <svg className="h-5 w-5 text-red-500 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        Not listed in directory
                                    </>
                                )}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Sponsor Availability</p>
                            <p className="font-medium flex items-center">
                                {profile.willing_to_sponsor ? (
                                    <>
                                        <svg className="h-5 w-5 text-green-500 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Available to sponsor
                                    </>
                                ) : (
                                    <>
                                        <svg className="h-5 w-5 text-red-500 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        Not available to sponsor
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Status */}
            <div className="mt-6 bg-blue-50 p-4 rounded-md">
                <h3 className="text-lg font-medium text-blue-700 mb-2">Account Status</h3>
                <p className="text-blue-600 capitalize font-medium">
                    {!roleLoading && role ? role : 'Member'}
                </p>
            </div>

            <div className="mt-6">
                <button
                    onClick={onEdit}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Edit Profile
                </button>
            </div>
        </div>
    );
};

export default ProfileView;
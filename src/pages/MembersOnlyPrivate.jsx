import React from 'react';
import useAuth from '../hooks/useAuth';

/**
 * Members Only Private Page
 * URL: /membersonlyprivate
 * 
 * This is a PROTECTED page - only logged-in members can view it.
 * (This page is wrapped with ProtectedRoute in App.jsx)
 * 
 * This page should contain:
 * - Private member resources
 * - Member directory
 * - Private discussions/forums
 * - Sponsor contact information
 * - Member-only documents
 */
const MembersOnlyPrivate = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Members Private Area</h1>

            <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-8">
                <p className="text-gray-700">
                    Welcome, {user?.email}! You are now viewing members-only content.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Member Resources</h2>
                    <div className="space-y-2 text-gray-600">
                        {/* TODO: Add member-only resources and documents */}
                        <p>Private resources will be displayed here</p>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Member Directory</h2>
                    <div className="space-y-2 text-gray-600">
                        {/* TODO: Add member directory with contact info */}
                        <p>Member directory will be displayed here</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MembersOnlyPrivate;
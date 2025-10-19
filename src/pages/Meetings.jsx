import React from 'react';

/**
 * Meetings Page
 * URL: /meetings
 * 
 * This page should display:
 * - List of Gamblers Anonymous meetings in Baton Rouge
 * - Meeting times, locations, and contact info
 * - Search/filter functionality by day or location
 */
const Meetings = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Meetings</h1>

            <div className="bg-gray-100 p-8 rounded-lg">
                <p className="text-gray-600">
                    This page will display information about Gamblers Anonymous meetings.
                </p>
                {/* TODO: Add meeting list, schedule, locations, and contact information */}
            </div>
        </div>
    );
};

export default Meetings;
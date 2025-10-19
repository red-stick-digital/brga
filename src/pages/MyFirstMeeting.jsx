import React from 'react';

/**
 * My First Meeting Page
 * URL: /myfirstmeeting
 * 
 * This page should guide newcomers:
 * - What to expect at first meeting
 * - What to bring
 * - FAQ for newcomers
 * - Encouragement and support information
 */
const MyFirstMeeting = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">My First Meeting</h1>

            <div className="grid gap-8 md:grid-cols-2">
                <div className="bg-blue-50 p-6 rounded-lg">
                    <h2 className="font-league-spartan text-[56px] leading-[60px] font-bold text-[#6B92B0] mb-4">What to Expect</h2>
                    <p className="text-gray-600">
                        {/* TODO: Add information about what newcomers should expect at their first meeting */}
                    </p>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                    <h2 className="font-league-spartan text-[56px] leading-[60px] font-bold text-[#6B92B0] mb-4">Preparation Tips</h2>
                    <p className="text-gray-600">
                        {/* TODO: Add tips for preparing for first meeting */}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MyFirstMeeting;
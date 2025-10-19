import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Members Only Landing Page
 * URL: /membersonly
 * 
 * This is a PUBLIC landing page that introduces the members-only section.
 * It describes what members can access and has a login button.
 * The actual private content is on /membersonlyprivate (which requires auth)
 */
const MembersOnly = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Members Only</h1>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-8 rounded mb-8">
                <h2 className="font-league-spartan text-[56px] leading-[60px] font-bold text-[#6B92B0] mb-4">Welcome to the Members Only Section</h2>
                <p className="text-gray-700 mb-6">
                    This section contains exclusive content for registered members of Gamblers Anonymous.
                </p>

                <div className="space-y-3 mb-8">
                    <h3 className="font-semibold text-gray-900">Members Can Access:</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        {/* TODO: List what members get access to */}
                        <li>Private meetings and discussions</li>
                        <li>Member resources and support materials</li>
                        <li>Contact directory</li>
                    </ul>
                </div>

                <Link
                    to="/login"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
                >
                    Log In to Access Members Area
                </Link>
            </div>
        </div>
    );
};

export default MembersOnly;
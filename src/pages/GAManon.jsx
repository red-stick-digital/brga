import React from 'react';

/**
 * Gam-Anon Page
 * URL: /gamanon
 * 
 * This page provides information about Gam-Anon, which is the support group
 * for families and friends of problem gamblers.
 * 
 * This page should include:
 * - What is Gam-Anon
 * - How it differs from GA
 * - Gam-Anon meetings in Baton Rouge
 * - Resources for families
 * - How to get help
 */
const GAManon = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Gam-Anon</h1>

            <div className="bg-purple-50 border-l-4 border-purple-400 p-6 mb-8">
                <h2 className="font-league-spartan text-[56px] leading-[60px] font-bold text-[#6B92B0] mb-4">For Families and Friends</h2>
                <p className="text-gray-700">
                    Gam-Anon is a support group for the families and close friends of problem gamblers.
                </p>
            </div>

            <div className="space-y-8">
                <div>
                    <h2 className="font-league-spartan text-[56px] leading-[60px] font-bold text-[#6B92B0] mb-4">What is Gam-Anon?</h2>
                    <p className="text-gray-700">
                        {/* TODO: Add information about Gam-Anon */}
                    </p>
                </div>

                <div>
                    <h2 className="font-league-spartan text-[56px] leading-[60px] font-bold text-[#6B92B0] mb-4">Gam-Anon Meetings</h2>
                    <p className="text-gray-700">
                        {/* TODO: Add Gam-Anon meeting times and locations */}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GAManon;
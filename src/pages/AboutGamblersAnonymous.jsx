import React from 'react';

/**
 * About Gamblers Anonymous Page
 * URL: /aboutgamblersanonymous
 * 
 * This page should provide:
 * - History of Gamblers Anonymous
 * - Mission statement
 * - Core values and principles
 * - How GA works
 * - Who can benefit
 */
const AboutGamblersAnonymous = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">About Gamblers Anonymous</h1>

            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
                    <p className="text-gray-700">
                        {/* TODO: Add GA mission statement and history */}
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Principles</h2>
                    <div className="space-y-4">
                        {/* TODO: Add core values and principles */}
                        <p className="text-gray-600">GA principles will be listed here</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutGamblersAnonymous;
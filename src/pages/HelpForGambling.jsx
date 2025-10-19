import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Help for Gambling Page
 * URL: /helpforgambling
 * 
 * This is a landing page designed to attract search traffic
 * from people searching for help with gambling problems.
 * 
 * This page should include:
 * - Signs you might have a gambling problem
 * - Immediate resources and crisis support
 * - How Gamblers Anonymous can help
 * - Testimonials
 * - Call to action to find meetings
 */
const HelpForGambling = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Help for Gambling Problems</h1>
            <p className="text-xl text-gray-600 mb-8">
                If you or someone you know is struggling with gambling, we're here to help.
            </p>

            <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-12">
                <h2 className="font-league-spartan text-[56px] leading-[60px] font-bold text-[#6B92B0] mb-4">Need Help Right Now?</h2>
                <p className="text-gray-700 mb-4">
                    {/* TODO: Add crisis hotline numbers and immediate resources */}
                </p>
                <a
                    href="tel:1-800-522-4700"
                    className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded"
                >
                    Call for Help
                </a>
            </div>

            <div className="grid gap-8 md:grid-cols-2 mb-12">
                <div className="bg-yellow-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Warning Signs</h3>
                    <ul className="space-y-2 text-gray-700">
                        {/* TODO: Add warning signs of gambling addiction */}
                        <li>• Spending more time/money on gambling</li>
                        <li>• Failed attempts to quit or cut back</li>
                        <li>• Gambling when distressed or anxious</li>
                    </ul>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">How We Can Help</h3>
                    <p className="text-gray-700 mb-4">
                        Gamblers Anonymous offers free, confidential support through meetings and community.
                    </p>
                    <Link
                        to="/meetings"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
                    >
                        Find a Meeting
                    </Link>
                </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
                <h2 className="font-league-spartan text-[56px] leading-[60px] font-bold text-[#6B92B0] mb-4">Take the First Step</h2>
                <p className="text-gray-700 mb-4">
                    Recovery starts with a single decision. Here are your options:
                </p>
                <div className="space-y-3">
                    <Link to="/20questions" className="block text-blue-600 hover:text-blue-700 font-semibold">
                        → Take the 20 Questions Self-Assessment
                    </Link>
                    <Link to="/myfirstmeeting" className="block text-blue-600 hover:text-blue-700 font-semibold">
                        → Learn What to Expect at Your First Meeting
                    </Link>
                    <Link to="/contactus" className="block text-blue-600 hover:text-blue-700 font-semibold">
                        → Contact Us for More Information
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HelpForGambling;
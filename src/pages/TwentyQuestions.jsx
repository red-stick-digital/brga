import React from 'react';

/**
 * Twenty Questions Page
 * URL: /20questions
 * 
 * This page displays the "20 Questions" self-assessment tool
 * used by Gamblers Anonymous to help people identify if they
 * have a gambling problem.
 */
const TwentyQuestions = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Twenty Questions</h1>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
                <p className="text-gray-700">
                    These questions are designed to help you determine if you have a gambling problem.
                </p>
            </div>

            <div className="space-y-4">
                {/* TODO: Add the 20 questions with checkboxes or response options */}
                <p className="text-gray-600">The 20 Questions assessment will be displayed here.</p>
            </div>
        </div>
    );
};

export default TwentyQuestions;
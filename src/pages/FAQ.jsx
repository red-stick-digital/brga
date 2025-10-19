import React, { useState } from 'react';

/**
 * FAQ Page
 * URL: /faq
 * 
 * This page should display frequently asked questions about:
 * - Gamblers Anonymous
 * - How to get help
 * - Meeting information
 * - Confidentiality and privacy
 * - The recovery process
 */
const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    // Example FAQ items - replace with actual content
    const faqs = [
        {
            question: 'What is Gamblers Anonymous?',
            answer: 'Gamblers Anonymous is a support group for people with a gambling problem.',
        },
        {
            question: 'How do I find a meeting?',
            answer: 'Visit our Meetings page to find GA meetings in the Baton Rouge area.',
        },
        // TODO: Add more FAQ items
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h1>

            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-300 rounded-lg">
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full px-6 py-4 text-left font-semibold text-gray-900 hover:bg-gray-50 flex justify-between items-center"
                        >
                            {faq.question}
                            <span className="text-xl">{openIndex === index ? '−' : '+'}</span>
                        </button>

                        {openIndex === index && (
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-300">
                                <p className="text-gray-700">{faq.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-12 text-center">
                <p className="text-gray-600">
                    Don't see your question? Contact us at our email address.
                </p>
            </div>
        </div>
    );
};

export default FAQ;
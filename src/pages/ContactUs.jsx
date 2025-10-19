import React from 'react';

/**
 * Contact Us Page
 * URL: /contactus
 * 
 * This page should include:
 * - Contact form
 * - Phone numbers
 * - Email addresses
 * - Physical mailing address
 * - Hours of operation
 */
const ContactUs = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact Us</h1>

            <div className="grid gap-8 md:grid-cols-2">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Get In Touch</h2>
                    <form className="space-y-4">
                        {/* TODO: Add contact form with name, email, message fields */}
                        <p className="text-gray-600">Contact form will be added here</p>
                    </form>
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                    <div className="space-y-4 text-gray-600">
                        {/* TODO: Add phone, email, address, and hours */}
                        <p>Contact details will be displayed here</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
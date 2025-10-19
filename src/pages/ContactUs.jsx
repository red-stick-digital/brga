'use client'

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Contact Us Page
 * URL: /contactus
 * 
 * This page should include:
 * - Hero section with background image
 * - Contact form
 * - Phone numbers
 * - Email addresses
 * - Physical mailing address
 * - Hours of operation
 */
const ContactUs = () => {
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement form submission logic
        console.log('Form submitted:', formData);
    };

    return (
        <div className="w-full">
            {/* Hero Section */}
            <div
                className="relative w-full flex items-center justify-center pt-[250px]"
                style={{
                    backgroundImage: 'url(/images/contact%20jumping%20in%20the%20sun.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    height: '820px',
                }}
            >
                {/* Overlay for readability */}
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>

                {/* Content */}
                <div className="relative z-10 text-center px-6 max-w-6xl">
                    <h1 className="hero-h1 text-white mb-8">
                        Get In Touch With Us
                    </h1>

                    <p className="font-helvetica text-[24px] leading-[36px] font-normal text-white">
                        You are not alone.<br />
                        We're here to help. Reach out to us anytime.
                    </p>
                </div>
            </div>

            {/* Contact Form and Information Section */}
            <div className="w-full bg-white py-20">
                <div className="w-3/4 mx-auto px-6">
                    <div className="grid gap-12 md:grid-cols-2">
                        {/* Contact Form */}
                        <div>
                            <h2 className="font-league-spartan text-[56px] leading-[60px] font-bold text-[#6B92B0] mb-8">
                                Send Us a Message
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block font-helvetica text-[16px] font-semibold text-gray-700 mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md font-helvetica text-[16px] focus:outline-none focus:border-[#6B92B0] focus:ring-1 focus:ring-[#6B92B0]"
                                        placeholder="Your name"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block font-helvetica text-[16px] font-semibold text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md font-helvetica text-[16px] focus:outline-none focus:border-[#6B92B0] focus:ring-1 focus:ring-[#6B92B0]"
                                        placeholder="Your email"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block font-helvetica text-[16px] font-semibold text-gray-700 mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="6"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md font-helvetica text-[16px] focus:outline-none focus:border-[#6B92B0] focus:ring-1 focus:ring-[#6B92B0]"
                                        placeholder="Your message"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="px-8 py-3 bg-[#8BB7D1] text-black font-helvetica font-bold rounded-md hover:bg-opacity-90 transition-all"
                                >
                                    SEND MESSAGE
                                </button>
                            </form>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <h2 className="font-league-spartan text-[56px] leading-[60px] font-bold text-[#6B92B0] mb-8">
                                Better yet, see us in person!
                            </h2>
                            <div className="space-y-6">
                                <p className="font-helvetica text-[16px] leading-[26px] text-gray-700">
                                    <Link to="/meetings" className="text-[#6B92B0] font-semibold hover:underline">
                                        Come to a meeting
                                    </Link> or give us a call today. 24 hours a day you can speak with someone from our area who is a compulsive gambler in recovery. If you are anywhere in Louisiana and need help finding a meeting or just need to talk with someone reach out to us now.
                                </p>

                                <div>
                                    <p className="font-helvetica text-[18px] font-bold text-gray-900 mb-1">
                                        Baton Rouge Gamblers Anonymous
                                    </p>
                                    <p className="font-helvetica text-[16px] text-gray-700 mb-4">
                                        Baton Rouge, Louisiana, United States
                                    </p>
                                    <a
                                        href="tel:888-502-5610"
                                        className="font-helvetica text-[16px] font-semibold text-[#6B92B0] hover:underline"
                                    >
                                        888-502-5610
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
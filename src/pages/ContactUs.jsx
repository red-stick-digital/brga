'use client'

import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

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
    // SEO data for Contact Us page
    const seoData = {
        title: "Help for Gambling | Contact Baton Rouge Gamblers Anonymous | Stop Gambling Support",
        description: "Need help for gambling or wondering how to stop gambling? Contact Baton Rouge GA today. Speak with someone in recovery and find local meetings and support.",
        canonicalUrl: "/contactus",
        keywords: [
            "contact gamblers anonymous",
            "gambling help hotline",
            "GA baton rouge contact",
            "gambling addiction support",
            "help for gambling addiction",
            "GA meetings information",
            "gambling recovery contact",
            "stop gambling support"
        ],
        structuredData: {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Baton Rouge Gamblers Anonymous",
            "url": "https://batonrougega.org/contactus",
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-888-502-5610",
                "contactType": "Customer Support",
                "availableLanguage": "English"
            },
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Baton Rouge",
                "addressRegion": "LA",
                "postalCode": "70809",
                "addressCountry": "US"
            }
        }
    };

    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [submitStatus, setSubmitStatus] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('');
        setErrorMessage('');

        console.log('Form submitted:', formData);

        try {
            // Send email using our API endpoint (dev server for local, Vercel serverless for production)
            const apiUrl = import.meta.env.DEV ? 'http://localhost:3001/api/send-email' : '/api/send-email';
            console.log('Making request to:', apiUrl);

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                }),
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers));

            let result;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
            } else {
                const text = await response.text();
                console.log('Non-JSON response:', text);
                result = { error: 'Server returned non-JSON response: ' + text };
            }

            console.log('Response result:', result);

            if (!response.ok) {
                throw new Error(result.error || `Server error: ${response.status} ${response.statusText}`);
            }

            setSubmitStatus('success');
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error('Error sending email:', error);
            setSubmitStatus('error');
            setErrorMessage(error.message || 'An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <SEO {...seoData} />
            <div className="w-full">
                {/* Hero Section */}
                <div
                    className="relative w-full flex items-start justify-center pt-[280px] sm:pt-[220px] md:pt-[250px]"
                    style={{
                        backgroundImage: 'url(/images/contact%20jumping%20in%20the%20sun.webp)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        minHeight: '500px',
                    }}
                >
                    {/* Overlay for readability */}
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>

                    {/* Content */}
                    <div className="relative z-10 text-center px-6 max-w-6xl mt-0">
                        <h1 className="hero-h1 text-white mb-8">
                            Get In Touch With Us
                        </h1>

                        <p className="font-helvetica text-[24px] leading-[36px] font-normal text-white">
                            You are not alone.<br />
                            We're here to help. Reach out to us anytime.
                        </p>
                    </div>
                </div>

                {/* Need Help Section */}
                <div className="w-full bg-white py-20">
                    <div className="w-3/4 mx-auto px-6 text-center">
                        <h1 className="font-league-spartan text-[72px] leading-[76px] font-bold text-[#6B92B0] mb-8">
                            Need Help for Gambling?
                        </h1>
                        <p className="font-helvetica text-[20px] leading-[32px] text-gray-700 max-w-4xl mx-auto">
                            If you've been thinking <strong>"I can't stop gambling"</strong> or searching for <strong>"how do I stop gambling,"</strong> reaching out for support is a{' '}
                            <Link to="/my-first-meeting" className="text-[#6B92B0] font-semibold hover:underline">
                                courageous first step
                            </Link>
                            . Whether you're in Baton Rouge, Hammond, or anywhere in Louisiana, we are here to offer{' '}
                            <strong>help for gambling</strong> through local GA meetings and personal support. Call us any time — you don't have to face this alone.
                        </p>
                    </div>
                </div>

                {/* Contact Form and Information Section */}
                <div className="w-full bg-white py-8 sm:py-12 md:py-20">
                    <div className="w-3/4 mx-auto px-6">
                        <div className="grid gap-8 sm:gap-12 md:grid-cols-2">
                            {/* Contact Form */}
                            <div>
                                <h2 className="font-league-spartan text-[56px] leading-[60px] font-bold text-[#6B92B0] mb-8">
                                    Send Us a Message
                                </h2>

                                {/* Status Messages */}
                                {submitStatus === 'success' && (
                                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                                        Thank you for your message! We'll get back to you soon.
                                    </div>
                                )}
                                {submitStatus === 'error' && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                                        <p className="font-semibold">Error sending message:</p>
                                        <p>{errorMessage}</p>
                                        <p className="mt-2 text-sm">Please try again or call us directly at 888-502-5610.</p>
                                    </div>
                                )}

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
                                        disabled={isSubmitting}
                                        className={`px-8 py-3 font-helvetica font-bold rounded-md transition-all ${isSubmitting
                                            ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                                            : 'bg-[#8BB7D1] text-black hover:bg-opacity-90'
                                            }`}
                                    >
                                        {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                                    </button>
                                </form>
                            </div>

                            {/* Contact Information */}
                            <div>
                                <h2 className="font-league-spartan text-[36px] sm:text-[48px] md:text-[56px] leading-[40px] sm:leading-[52px] md:leading-[60px] font-bold text-[#6B92B0] mb-6 sm:mb-8">
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
        </>
    );
};

export default ContactUs;
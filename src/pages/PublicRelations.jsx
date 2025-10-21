import React from 'react';
import SEO from '../components/common/SEO';

/**
 * Public Relations Page
 * URL: /publicrelations
 * 
 * This page is for:
 * - Media inquiries
 * - Press releases
 * - Information for journalists
 * - Speaking engagements
 * - Public awareness information
 */
const PublicRelations = () => {
    // SEO data for Public Relations page
    const seoData = {
        title: "Public Relations | Baton Rouge Gamblers Anonymous Outreach",
        description: "Baton Rouge GA is committed to community outreach and public education. Learn how we partner with local organizations to spread awareness of recovery.",
        canonicalUrl: "/publicrelations",
        keywords: [
            "gamblers anonymous outreach",
            "gambling addiction awareness",
            "GA public relations",
            "gambling recovery education",
            "problem gambling speakers",
            "gambling addiction presentations",
            "community gambling awareness",
            "GA media resources"
        ],
        structuredData: {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Baton Rouge Gamblers Anonymous Public Relations",
            "description": "Community outreach and education services about gambling addiction and recovery",
            "provider": {
                "@type": "Organization",
                "name": "Baton Rouge Gamblers Anonymous",
                "url": "https://batonrougega.org"
            },
            "serviceType": "Community Education",
            "areaServed": {
                "@type": "City",
                "name": "Baton Rouge"
            }
        }
    };

    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        phone: '',
        organizationName: '',
        eventDate: ''
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
            const apiUrl = import.meta.env.DEV ? 'http://localhost:3001/api/send-speaker-request' : '/api/send-speaker-request';
            console.log('Making request to:', apiUrl);

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            console.log('Response status:', response.status);
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
            setFormData({
                name: '',
                email: '',
                phone: '',
                organizationName: '',
                eventDate: ''
            });
        } catch (error) {
            console.error('Error sending speaker request:', error);
            setSubmitStatus('error');
            setErrorMessage(error.message || 'An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <SEO {...seoData} />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Public Relations</h1>

                <div className="space-y-8">
                    <div>
                        <p className="text-gray-700 text-lg leading-relaxed mb-6">
                            Sharing stories of our addiction and recovery are vital for those in all stages of recovery: newcomers and old-timers alike. And, speaking about compulsive gambling and recovery brings awareness to the public at large.
                        </p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-[#6B92B0]">
                        <h2 className="font-league-spartan text-2xl font-bold text-[#6B92B0] mb-4">The 12th Step of Our Recovery Program</h2>
                        <p className="text-gray-800 font-semibold italic text-lg">
                            "Having made an effort to practice these principles in all our affairs, we tried to carry this message to other compulsive gamblers."
                        </p>
                    </div>

                    <div>
                        <h2 className="font-league-spartan text-[56px] leading-[60px] font-bold text-[#6B92B0] mb-4">Speaking Opportunities</h2>
                        <p className="text-gray-700 text-lg leading-relaxed mb-4">
                            GA members carry the message by speaking at treatment centers, colleges, universities, prisons, churches, and many other facilities. Not only are we eager to speak with those that think they may have a gambling problem, we are also pleased to speak with professionals and service providers.
                        </p>
                    </div>

                    <div>
                        <h2 className="font-league-spartan text-[56px] leading-[60px] font-bold text-[#6B92B0] mb-4">Request a Speaker</h2>
                        <p className="text-gray-700 text-lg leading-relaxed mb-4">
                            To request someone to speak at your organization, please call our hotline at <span className="font-semibold text-[#6B92B0]">888-502-5610</span>. Press inquiries may also be directed to that number.
                        </p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-[#8BB7D1]">
                        <h2 className="font-league-spartan text-2xl font-bold text-[#6B92B0] mb-4">Join Our PR Committee</h2>
                        <p className="text-gray-700 text-lg leading-relaxed">
                            If you are an active member of Gamblers Anonymous and would like to share your experience, strength, and hope, contact the PR Committee! We'll be delighted to add you into the rotation of speakers, answer any questions you may have, and support you in your story sharing efforts.
                        </p>
                    </div>

                    {/* Speaker Request Form */}
                    <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
                        <h2 className="font-league-spartan text-[40px] leading-[44px] font-bold text-[#6B92B0] mb-6">Request a Speaker</h2>
                        <p className="text-gray-700 text-lg leading-relaxed mb-8">
                            Fill out the form below to request a GA speaker for your organization, event, or facility. We'll review your request and get back to you as soon as possible.
                        </p>

                        {/* Status Messages */}
                        {submitStatus === 'success' && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                                Thank you for your speaker request! We'll be in touch soon.
                            </div>
                        )}
                        {submitStatus === 'error' && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                                <p className="font-semibold">Error submitting request:</p>
                                <p>{errorMessage}</p>
                                <p className="mt-2 text-sm">Please try again or call us directly at 888-502-5610.</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block font-semibold text-gray-700 mb-2">
                                    Your Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-[#6B92B0] focus:ring-1 focus:ring-[#6B92B0]"
                                    placeholder="Your full name"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block font-semibold text-gray-700 mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-[#6B92B0] focus:ring-1 focus:ring-[#6B92B0]"
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block font-semibold text-gray-700 mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-[#6B92B0] focus:ring-1 focus:ring-[#6B92B0]"
                                    placeholder="(555) 123-4567"
                                />
                            </div>

                            <div>
                                <label htmlFor="organizationName" className="block font-semibold text-gray-700 mb-2">
                                    Organization Name *
                                </label>
                                <input
                                    type="text"
                                    id="organizationName"
                                    name="organizationName"
                                    value={formData.organizationName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-[#6B92B0] focus:ring-1 focus:ring-[#6B92B0]"
                                    placeholder="Name of your organization or facility"
                                />
                            </div>

                            <div>
                                <label htmlFor="eventDate" className="block font-semibold text-gray-700 mb-2">
                                    Preferred Event Date *
                                </label>
                                <input
                                    type="date"
                                    id="eventDate"
                                    name="eventDate"
                                    value={formData.eventDate}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-[#6B92B0] focus:ring-1 focus:ring-[#6B92B0]"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-8 py-3 font-semibold rounded-md transition-all ${isSubmitting
                                    ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                                    : 'bg-[#6B92B0] text-white hover:bg-opacity-90'
                                    }`}
                            >
                                {isSubmitting ? 'SUBMITTING...' : 'SUBMIT REQUEST'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PublicRelations;
import React, { useState } from 'react';
import { useEmailService } from '../../hooks/useEmailService.js';

/**
 * Admin component for testing email functionality
 * This component allows administrators to test various email templates and functions
 */
const EmailTestPanel = () => {
    const {
        loading,
        error,
        success,
        resetState,
        sendCustomEmail,
        sendWelcomeEmail,
        sendMeetingReminder,
        sendEventAnnouncement,
    } = useEmailService();

    const [activeTab, setActiveTab] = useState('custom');
    const [formData, setFormData] = useState({
        to: '',
        subject: '',
        html: '',
        text: '',
        name: '',
        meetingTitle: '',
        meetingDate: '',
        meetingTime: '',
        meetingLocation: '',
        eventTitle: '',
        eventDate: '',
        eventTime: '',
        eventLocation: '',
        eventDescription: '',
        recipients: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSendCustomEmail = async (e) => {
        e.preventDefault();
        resetState();

        try {
            await sendCustomEmail({
                to: formData.to,
                subject: formData.subject,
                html: formData.html,
                text: formData.text || null,
            });
        } catch (err) {
            console.error('Failed to send custom email:', err);
        }
    };

    const handleSendWelcomeEmail = async (e) => {
        e.preventDefault();
        resetState();

        try {
            await sendWelcomeEmail(formData.to, formData.name);
        } catch (err) {
            console.error('Failed to send welcome email:', err);
        }
    };

    const handleSendMeetingReminder = async (e) => {
        e.preventDefault();
        resetState();

        try {
            await sendMeetingReminder(formData.to, formData.name, {
                title: formData.meetingTitle,
                date: formData.meetingDate,
                time: formData.meetingTime,
                location: formData.meetingLocation,
            });
        } catch (err) {
            console.error('Failed to send meeting reminder:', err);
        }
    };

    const handleSendEventAnnouncement = async (e) => {
        e.preventDefault();
        resetState();

        try {
            const recipients = formData.recipients.split(',').map(email => email.trim());
            await sendEventAnnouncement(recipients, {
                title: formData.eventTitle,
                date: formData.eventDate,
                time: formData.eventTime,
                location: formData.eventLocation,
                description: formData.eventDescription,
            });
        } catch (err) {
            console.error('Failed to send event announcement:', err);
        }
    };

    const tabs = [
        { id: 'custom', label: 'Custom Email' },
        { id: 'welcome', label: 'Welcome Email' },
        { id: 'meeting', label: 'Meeting Reminder' },
        { id: 'event', label: 'Event Announcement' },
    ];

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Email Testing Panel</h2>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                resetState();
                            }}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Status Messages */}
            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                    <strong>Success:</strong> Email sent successfully!
                </div>
            )}

            {/* Custom Email Tab */}
            {activeTab === 'custom' && (
                <form onSubmit={handleSendCustomEmail} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            To Email Address
                        </label>
                        <input
                            type="email"
                            name="to"
                            value={formData.to}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="recipient@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subject
                        </label>
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Email subject"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            HTML Content
                        </label>
                        <textarea
                            name="html"
                            value={formData.html}
                            onChange={handleInputChange}
                            required
                            rows={8}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                            placeholder="<h1>Hello World</h1><p>This is an HTML email.</p>"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Plain Text Content (Optional)
                        </label>
                        <textarea
                            name="text"
                            value={formData.text}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Plain text version of the email"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Sending...' : 'Send Custom Email'}
                    </button>
                </form>
            )}

            {/* Welcome Email Tab */}
            {activeTab === 'welcome' && (
                <form onSubmit={handleSendWelcomeEmail} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            To Email Address
                        </label>
                        <input
                            type="email"
                            name="to"
                            value={formData.to}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="member@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Member Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="John Doe"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Sending...' : 'Send Welcome Email'}
                    </button>
                </form>
            )}

            {/* Meeting Reminder Tab */}
            {activeTab === 'meeting' && (
                <form onSubmit={handleSendMeetingReminder} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                To Email Address
                            </label>
                            <input
                                type="email"
                                name="to"
                                value={formData.to}
                                onChange={handleInputChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="member@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Member Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Meeting Title
                            </label>
                            <input
                                type="text"
                                name="meetingTitle"
                                value={formData.meetingTitle}
                                onChange={handleInputChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Tuesday Evening Meeting"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Meeting Date
                            </label>
                            <input
                                type="date"
                                name="meetingDate"
                                value={formData.meetingDate}
                                onChange={handleInputChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Meeting Time
                            </label>
                            <input
                                type="time"
                                name="meetingTime"
                                value={formData.meetingTime}
                                onChange={handleInputChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Meeting Location
                            </label>
                            <input
                                type="text"
                                name="meetingLocation"
                                value={formData.meetingLocation}
                                onChange={handleInputChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Community Center, Room 101"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Sending...' : 'Send Meeting Reminder'}
                    </button>
                </form>
            )}

            {/* Event Announcement Tab */}
            {activeTab === 'event' && (
                <form onSubmit={handleSendEventAnnouncement} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Recipients (comma-separated emails)
                        </label>
                        <textarea
                            name="recipients"
                            value={formData.recipients}
                            onChange={handleInputChange}
                            required
                            rows={2}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="email1@example.com, email2@example.com, email3@example.com"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Event Title
                            </label>
                            <input
                                type="text"
                                name="eventTitle"
                                value={formData.eventTitle}
                                onChange={handleInputChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Annual GA Picnic"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Event Date
                            </label>
                            <input
                                type="date"
                                name="eventDate"
                                value={formData.eventDate}
                                onChange={handleInputChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Event Time
                            </label>
                            <input
                                type="time"
                                name="eventTime"
                                value={formData.eventTime}
                                onChange={handleInputChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Event Location
                            </label>
                            <input
                                type="text"
                                name="eventLocation"
                                value={formData.eventLocation}
                                onChange={handleInputChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="City Park Pavilion"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Event Description
                        </label>
                        <textarea
                            name="eventDescription"
                            value={formData.eventDescription}
                            onChange={handleInputChange}
                            required
                            rows={4}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Join us for our annual community picnic with food, fellowship, and fun activities for the whole family."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Sending...' : 'Send Event Announcement'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default EmailTestPanel;
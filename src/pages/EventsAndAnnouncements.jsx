import React from 'react';
import useAnnouncements from '../hooks/useAnnouncements';
import useEvents from '../hooks/useEvents';
import SEO from '../components/common/SEO';
import { format } from 'date-fns';

/**
 * Events and Announcements Page
 * URL: /eventsandannouncements
 * 
 * This page displays:
 * - Upcoming events from database
 * - Important announcements from database
 * - Admin controls for content management
 */
const EventsAndAnnouncements = () => {
    const { announcements, loading: announcementsLoading } = useAnnouncements();
    const { events, loading: eventsLoading, getUpcomingEvents } = useEvents();

    // SEO data for Events and Announcements page
    const seoData = {
        title: "GA Events & News | Baton Rouge Gamblers Anonymous",
        description: "Stay connected with Baton Rouge GA. View upcoming events, announcements, and news about our recovery community and local GA meetings.",
        canonicalUrl: "/eventsandannouncements",
        keywords: [
            "gamblers anonymous events",
            "GA announcements",
            "gambling recovery events",
            "baton rouge GA news",
            "GA community events",
            "gambling support meetings",
            "recovery announcements",
            "GA special events"
        ],
        structuredData: {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Baton Rouge Gamblers Anonymous Events and Announcements",
            "description": "Current events and announcements for the Baton Rouge Gamblers Anonymous community",
            "publisher": {
                "@type": "Organization",
                "name": "Baton Rouge Gamblers Anonymous",
                "url": "https://batonrougega.org"
            }
        }
    };

    const upcomingEvents = getUpcomingEvents();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    if (announcementsLoading || eventsLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-500">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <>
            <SEO {...seoData} />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Events and Announcements</h1>
                </div>

                <div className="space-y-12">
                    {/* Announcements Section */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Announcements</h2>
                        <div className="space-y-4">
                            {announcements.length === 0 ? (
                                <div className="bg-gray-100 rounded-lg p-6 text-center">
                                    <p className="text-gray-600">No announcements at this time.</p>
                                </div>
                            ) : (
                                announcements.map((announcement) => (
                                    <div
                                        key={announcement.id}
                                        className={`bg-white shadow rounded-lg p-6 ${announcement.type === 'urgent' ? 'border-l-4 border-red-500' : ''
                                            }`}
                                    >
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {announcement.title}
                                            {announcement.type === 'urgent' && (
                                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    Urgent
                                                </span>
                                            )}
                                        </h3>
                                        <p className="text-gray-600 whitespace-pre-wrap">{announcement.content}</p>
                                        {announcement.created_at && (
                                            <p className="mt-3 text-xs text-gray-500">
                                                Posted {format(new Date(announcement.created_at), 'MMM d, yyyy')}
                                            </p>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Upcoming Events Section */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {upcomingEvents.length === 0 ? (
                                <div className="col-span-full bg-gray-100 rounded-lg p-6 text-center">
                                    <p className="text-gray-600">No upcoming events scheduled.</p>
                                </div>
                            ) : (
                                upcomingEvents.map((event) => (
                                    <div key={event.id} className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {event.title}
                                        </h3>
                                        {event.event_date && (
                                            <p className="text-sm text-blue-600 mb-2">
                                                📅 {format(new Date(event.event_date), 'EEEE, MMMM d, yyyy')}
                                            </p>
                                        )}
                                        {(event.start_time || event.end_time) && (
                                            <p className="text-sm text-gray-600 mb-2">
                                                🕐 {event.start_time && formatTime(event.start_time)}
                                                {event.start_time && event.end_time && ' - '}
                                                {event.end_time && formatTime(event.end_time)}
                                            </p>
                                        )}
                                        {event.location && (
                                            <p className="text-sm text-gray-600 mb-2">
                                                📍 {event.location}
                                            </p>
                                        )}
                                        {event.address && (
                                            <p className="text-sm text-gray-600 mb-2">
                                                🏠 {event.address}
                                            </p>
                                        )}
                                        {event.recurrence_pattern && (
                                            <p className="text-sm text-gray-600 mb-2">
                                                🔄 {event.recurrence_pattern}
                                            </p>
                                        )}
                                        {event.description && (
                                            <p className="text-gray-600 mt-3 text-sm">{event.description}</p>
                                        )}
                                        {event.map_link && (
                                            <a
                                                href={event.map_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-block mt-3 text-sm text-blue-600 hover:text-blue-800 underline"
                                            >
                                                View on Map →
                                            </a>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* All Meetings/Recurring Events Section */}
                    {events.filter(event => event.is_recurring).length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Regular Meetings</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {events
                                    .filter(event => event.is_recurring)
                                    .map((event) => (
                                        <div key={event.id} className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                {event.title}
                                            </h3>
                                            {event.recurrence_pattern && (
                                                <p className="text-sm text-gray-600 mb-2">
                                                    🔄 {event.recurrence_pattern}
                                                </p>
                                            )}
                                            {(event.start_time || event.end_time) && (
                                                <p className="text-sm text-gray-600 mb-2">
                                                    🕐 {event.start_time && formatTime(event.start_time)}
                                                    {event.start_time && event.end_time && ' - '}
                                                    {event.end_time && formatTime(event.end_time)}
                                                </p>
                                            )}
                                            {event.location && (
                                                <p className="text-sm text-gray-600 mb-2">
                                                    📍 {event.location}
                                                </p>
                                            )}
                                            {event.address && (
                                                <p className="text-sm text-gray-600 mb-2">
                                                    🏠 {event.address}
                                                </p>
                                            )}
                                            {event.event_type && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 capitalize">
                                                    {event.event_type.replace('_', ' ')}
                                                </span>
                                            )}
                                            {event.description && (
                                                <p className="text-gray-600 mt-3 text-sm">{event.description}</p>
                                            )}
                                            {event.map_link && (
                                                <a
                                                    href={event.map_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-block mt-3 text-sm text-blue-600 hover:text-blue-800 underline"
                                                >
                                                    View on Map →
                                                </a>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Contact Information */}
                <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Have Something to Add?</h3>
                    <p className="text-blue-800">
                        Email{' '}
                        <a href="mailto:batonrougega@gmail.com" className="font-medium underline hover:text-blue-600">
                            batonrougega@gmail.com
                        </a>
                        {' '}and we'll add it to the website.
                    </p>
                </div>
            </div>
        </>
    );
};

export default EventsAndAnnouncements;
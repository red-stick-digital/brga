import React from 'react';
import useAnnouncements from '../hooks/useAnnouncements';
import useEvents from '../hooks/useEvents';
import SEO from '../components/common/SEO';

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
                        <h2 className="font-league-spartan text-[40px] leading-[44px] font-bold text-[#6B92B0] mb-6">Announcements</h2>
                        <div className="space-y-6">
                            {announcements.length === 0 ? (
                                <p className="text-gray-600 italic">No current announcements</p>
                            ) : (
                                announcements.map((announcement) => (
                                    <div key={announcement.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                                            {announcement.title}
                                        </h3>
                                        <div className="text-gray-700 whitespace-pre-wrap">
                                            {announcement.content}
                                        </div>
                                        {announcement.type === 'urgent' && (
                                            <div className="mt-3">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    Urgent
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Upcoming Events Section */}
                    <div>
                        <h2 className="font-league-spartan text-[40px] leading-[44px] font-bold text-[#6B92B0] mb-6">Upcoming Events</h2>
                        <div className="space-y-6">
                            {upcomingEvents.length === 0 ? (
                                <p className="text-gray-600 italic">No upcoming events scheduled</p>
                            ) : (
                                upcomingEvents.map((event) => (
                                    <div key={event.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-xl font-bold text-gray-900">
                                                {event.title}
                                            </h3>
                                            {event.event_type && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                                    {event.event_type.replace('_', ' ')}
                                                </span>
                                            )}
                                        </div>

                                        {event.description && (
                                            <p className="text-gray-700 mb-4">{event.description}</p>
                                        )}

                                        <div className="space-y-2 text-sm text-gray-600">
                                            {event.event_date && (
                                                <div className="flex items-center">
                                                    <strong className="w-16">Date:</strong>
                                                    <span>{formatDate(event.event_date)}</span>
                                                </div>
                                            )}

                                            {(event.start_time || event.end_time) && (
                                                <div className="flex items-center">
                                                    <strong className="w-16">Time:</strong>
                                                    <span>
                                                        {event.start_time && formatTime(event.start_time)}
                                                        {event.start_time && event.end_time && ' - '}
                                                        {event.end_time && formatTime(event.end_time)}
                                                    </span>
                                                </div>
                                            )}

                                            {event.location && (
                                                <div className="flex items-start">
                                                    <strong className="w-16 mt-0.5">Location:</strong>
                                                    <span>{event.location}</span>
                                                </div>
                                            )}

                                            {event.address && (
                                                <div className="flex items-start">
                                                    <strong className="w-16 mt-0.5">Address:</strong>
                                                    <span className="whitespace-pre-wrap">{event.address}</span>
                                                </div>
                                            )}

                                            {event.map_link && (
                                                <div className="mt-3">
                                                    <a
                                                        href={event.map_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                                                    >
                                                        View on Map
                                                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                        </svg>
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* All Meetings/Recurring Events Section */}
                    {events.filter(event => event.is_recurring).length > 0 && (
                        <div>
                            <h2 className="font-league-spartan text-[40px] leading-[44px] font-bold text-[#6B92B0] mb-6">Regular Meetings</h2>
                            <div className="space-y-4">
                                {events
                                    .filter(event => event.is_recurring)
                                    .map((event) => (
                                        <div key={event.id} className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {event.title}
                                                </h3>
                                                {event.event_type && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 capitalize">
                                                        {event.event_type.replace('_', ' ')}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="text-sm text-gray-600 space-y-1">
                                                {event.recurrence_pattern && (
                                                    <div><strong>Schedule:</strong> {event.recurrence_pattern}</div>
                                                )}
                                                {(event.start_time || event.end_time) && (
                                                    <div>
                                                        <strong>Time:</strong>
                                                        {event.start_time && formatTime(event.start_time)}
                                                        {event.start_time && event.end_time && ' - '}
                                                        {event.end_time && formatTime(event.end_time)}
                                                    </div>
                                                )}
                                                {event.location && <div><strong>Location:</strong> {event.location}</div>}
                                                {event.address && <div><strong>Address:</strong> {event.address}</div>}
                                            </div>
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
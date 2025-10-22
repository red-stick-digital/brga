import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const DirectoryMemberCard = ({ member, calculateSobriety }) => {
    const { user } = useAuth();
    const [showContactModal, setShowContactModal] = useState(false);

    const formatStartTime = (timeString) => {
        if (!timeString) return '';

        // Parse time string (assuming format like "19:00:00")
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const minute = minutes;

        if (hour === 0) {
            return `12:${minute} AM`;
        } else if (hour < 12) {
            return `${hour}:${minute} AM`;
        } else if (hour === 12) {
            return `12:${minute} PM`;
        } else {
            return `${hour - 12}:${minute} PM`;
        }
    };

    const ContactModal = () => (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Contact {member.full_name}
                    </h3>

                    <div className="mb-4 p-4 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-800">
                            <strong>Note:</strong> This member has indicated they are willing to sponsor.
                            Contact them through your home group leader or at a meeting for privacy and safety.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <span className="text-sm font-medium text-gray-700">Home Group:</span>
                            <p className="text-sm text-gray-900">{member.home_group?.name}</p>
                        </div>

                        {member.home_group?.start_time && (
                            <div>
                                <span className="text-sm font-medium text-gray-700">Meeting Time:</span>
                                <p className="text-sm text-gray-900">
                                    {formatStartTime(member.home_group.start_time)}
                                </p>
                            </div>
                        )}

                        {member.home_group?.location && (
                            <div>
                                <span className="text-sm font-medium text-gray-700">Location:</span>
                                <p className="text-sm text-gray-900">{member.home_group.location}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            onClick={() => setShowContactModal(false)}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {member.full_name}
                        </h3>
                        {member.officer_position && (
                            <p className="text-xs font-medium text-blue-600 mt-1">
                                {member.officer_position}
                            </p>
                        )}
                    </div>

                    {member.willing_to_sponsor && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Available Sponsor
                        </span>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{member.home_group?.name || 'No home group'}</span>
                    </div>

                    {member.home_group?.start_time && (
                        <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{formatStartTime(member.home_group.start_time)}</span>
                        </div>
                    )}

                    <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v3a1 1 0 01-.879.986L18 18.014a1 1 0 01-.293.707L16.707 19.5a1 1 0 01-1.414 0L14.5 18.707a1 1 0 01-.293-.707L13.086 13H11v-2h2.086l1.121-4.014A1 1 0 0115.293 6.5L16.707 7.5a1 1 0 011.414 0L19.707 9a1 1 0 01.293.707v9.586a1 1 0 01-.293.707L18.707 21a1 1 0 01-1.414 0L16 19.707V21a1 1 0 01-1 1H9a1 1 0 01-1-1v-1.293L6.707 21a1 1 0 01-1.414 0L4.293 20a1 1 0 01-.293-.707V9.707A1 1 0 014.293 9L5.707 7.5a1 1 0 011.414 0L8.293 6.5a1 1 0 01.879-.486L11 13h-2v2h2.086L10.293 19.5a1 1 0 01.707.293L12 18.707l.293-.707A1 1 0 0113.086 18L14.207 13H16v-2h-1.793L15.086 6.986A1 1 0 0114.207 6H13V3a1 1 0 00-1-1H8a1 1 0 00-1 1v4z" />
                        </svg>
                        <span className="font-medium">
                            {calculateSobriety(member.clean_date)} clean
                        </span>
                    </div>

                    {/* Contact Information (if shared) */}
                    {(member.share_phone_in_directory || member.share_email_in_directory) && (
                        <div className="pt-2 border-t border-gray-200 mt-2">
                            {member.share_phone_in_directory && member.phone && (
                                <div className="flex items-center text-sm text-gray-600 mt-2">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span className="font-medium">
                                        {member.phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}
                                    </span>
                                </div>
                            )}
                            {member.share_email_in_directory && member.email && (
                                <div className="flex items-center text-sm text-gray-600 mt-2">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="break-all">
                                        {member.email}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Contact Button - only show for logged-in users */}
                {user && member.willing_to_sponsor && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <button
                            onClick={() => setShowContactModal(true)}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium"
                        >
                            Contact for Sponsorship
                        </button>
                    </div>
                )}

                {/* Join Date - subtle footer */}
                {member.user_role?.created_at && (
                    <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-400">
                        Member since {new Date(member.user_role.created_at).toLocaleDateString()}
                    </div>
                )}
            </div>

            {/* Contact Modal */}
            {showContactModal && <ContactModal />}
        </>
    );
};

export default DirectoryMemberCard;
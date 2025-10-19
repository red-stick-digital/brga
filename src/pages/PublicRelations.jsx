import React from 'react';

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
    return (
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
            </div>
        </div>
    );
};

export default PublicRelations;
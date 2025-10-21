import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import SEO from '../components/common/SEO';

/**
 * My First Meeting Page
 * URL: /myfirstmeeting
 * 
 * This page guides newcomers through what to expect at their first Gamblers Anonymous meeting.
 */
const MyFirstMeeting = () => {
    // SEO data for My First Meeting page
    const seoData = {
        title: "Help for Gambling | Your First GA Meeting | Baton Rouge Gamblers Anonymous",
        description: "Nervous about your first GA meeting? Learn what to expect, how to prepare, and how Baton Rouge Gamblers Anonymous can help you begin recovery.",
        canonicalUrl: "/myfirstmeeting",
        keywords: [
            "first gamblers anonymous meeting",
            "what to expect at GA",
            "gambling addiction help",
            "first recovery meeting",
            "gambling support group",
            "GA meeting format",
            "gambling recovery baton rouge",
            "new to gamblers anonymous"
        ],
        structuredData: {
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "Attending Your First Gamblers Anonymous Meeting",
            "description": "A guide to what to expect at your first Gamblers Anonymous meeting in Baton Rouge",
            "step": [
                {
                    "@type": "HowToStep",
                    "name": "Find a Meeting",
                    "text": "Locate a Gamblers Anonymous meeting in your area using our meetings page or by calling our hotline."
                },
                {
                    "@type": "HowToStep",
                    "name": "Arrive at the Meeting",
                    "text": "Arrive a few minutes early to get comfortable with the surroundings and introduce yourself to others."
                },
                {
                    "@type": "HowToStep",
                    "name": "Participate as Comfortable",
                    "text": "You can share your story if you feel comfortable, but it's also perfectly fine to just listen."
                },
                {
                    "@type": "HowToStep",
                    "name": "Keep Coming Back",
                    "text": "Recovery is a process. Regular attendance at meetings is key to long-term recovery from gambling addiction."
                }
            ]
        }
    };

    return (
        <>
            <SEO {...seoData} />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1>What To Expect At Your First Meeting</h1>

                {/* Don't Be Ashamed */}
                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Don't Be Ashamed</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        It was hard for all of us to come to that first meeting. We know how you feel. If it is an open meeting, feel free to bring a friend or relative to support you. Sometimes, the second meeting is even harder than the first. Please keep coming back.
                    </p>
                </section>

                {/* Seeking Help for Gambling? */}
                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Seeking Help for Gambling?</h2>
                    <p className="text-gray-700 leading-relaxed">
                        If you've been wondering "how do I stop gambling" or thinking "I can't stop gambling," coming to your first <Link to="/meetings" className="text-blue-600 hover:text-blue-800 hover:underline">Gamblers Anonymous meeting</Link> is a big first step. Many of us felt the same way before attending our first meeting. You will find others who understand what you're going through and who can offer hope and support. <Link to="/contactus" className="text-blue-600 hover:text-blue-800 hover:underline">Help for gambling</Link> is available — and you do not have to face this alone.
                    </p>
                </section>

                {/* Meeting Format / Agenda */}
                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Meeting Format / Agenda</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Each meeting is a little bit different from another but there are some similarities.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Meeting Kickoff</li>
                        <li>Read Aloud From GA Literature</li>
                        <li>Keychains</li>
                        <li>Introductions and Donations</li>
                        <li>Discussion Topic</li>
                        <li>Sharing</li>
                        <li>News and Announcements</li>
                        <li>Closing</li>
                    </ul>
                </section>

                {/* New Members */}
                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">New Members</h2>
                    <p className="text-gray-700 leading-relaxed">
                        We tend to see the same faces at meetings each week, so it's very likely someone will ask if you are a new member or if it's your first meeting. We provide new members with literature packets and take a little extra time to explain various parts of the meeting. Some meetings will also forego their planned discussion topic when there are new members and instead, members will share their "story" with the group. These stories usually consist of the member's history with gambling, the impact it has had on their life, what led them to seek help, and how they are doing since beginning the recovery program. Many of our new members find they can relate to something from everyone's story. You may be asked if you would like to share, it is your choice whether you want to share or not. Do not feel pressured to speak at your first meeting.
                    </p>
                </section>

                {/* Introducing Yourself at a Meeting */}
                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Introducing Yourself at a Meeting</h2>
                    <p className="text-gray-700 leading-relaxed">
                        As an anonymous organization, GA works on a first-name basis only. Before speaking, each member introduces themselves by stating their first name, such as "Hi! My name is Jim." Many members also choose to identify themselves as a compulsive gambler; for example, "My name is Ann and I am a compulsive gambler." It is up to you to decide how you would like to introduce yourself - there is no right or wrong way - we only ask that you introduce yourself before speaking. If you are questioning whether you are a compulsive gambler or not, you may choose to say your name and "I'm glad to be here."
                    </p>
                </section>

                {/* Sharing During a Meeting */}
                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Sharing During a Meeting</h2>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        When GA members talk about their thoughts, feelings, and experiences during a meeting, we call it "sharing". Each member chooses to share as much or as little as they want during a meeting. Some members choose not to share at all. In order to maintain a respectful and safe environment for members to share, we have a few guidelines we expect all members to follow:
                    </p>

                    <ol className="list-decimal list-inside space-y-4 text-gray-700">
                        <li>
                            <span className="font-semibold">Cross Talk Is Discouraged</span> - Cross-talk is defined as interrupting, giving advice or making comments directly to another member about their share. It is also talking to another member or making distracting noise during the meeting. Some meetings are more rigid about cross-talk and others are more relaxed. We recommend refraining from cross-talk until you have been able to observe or ask about what is acceptable at a specific meeting.
                        </li>
                        <li>
                            <span className="font-semibold">All comments should be related to recovery from gambling addiction and should focus on our own experience</span> - We are here to share our experience, strength and hope so that we can help each other recover from a gambling addiction. While sharing our experience does include aspects of our gambling history, we want to refrain from sharing "war stories", specific win/loss amounts, or opinions on outside issues. We also need to talk about our own experiences, not others.
                        </li>
                        <li>
                            <span className="font-semibold">Insensitive or offensive comments will not be tolerated</span> - A GA meeting is intended to be a judgment-free zone for members. We will never tolerate comments that are disparaging to another member, or to groups of people based on race, gender, sexual orientation, religious or political affiliation, etc. While our members are entitled to their personal opinions, a GA meeting is not the place to express them. Anyone making offensive comments may be asked to leave the meeting and may not be welcome back.
                        </li>
                        <li>
                            <span className="font-semibold">Every member should have an opportunity to share during a meeting</span> - Be respectful of the time constraints of the meeting and limit your share to 5 minutes or less depending on the number of people attending and the duration of the meeting. Everyone should have an opportunity to share.
                        </li>
                    </ol>
                </section>

                {/* Navigation Buttons */}
                <div className="mt-12 mb-12">
                    <div className="w-full max-w-2xl mx-auto">
                        <div className="grid grid-cols-2 gap-4">
                            <Link to="/Meetings" className="flex">
                                <Button className="w-full">Meetings</Button>
                            </Link>
                            <Link to="/AboutGamblersAnonymous" className="flex">
                                <Button className="w-full">About Gamblers Anonymous</Button>
                            </Link>
                            <Link to="/TwelveStepsAndUnityProgram" className="flex">
                                <Button className="w-full">12 Steps and Unity Program</Button>
                            </Link>
                            <Link to="/TwentyQuestions" className="flex">
                                <Button className="w-full">Am I A Compulsive Gambler</Button>
                            </Link>
                            <Link to="/PublicRelations" className="flex">
                                <Button className="w-full">Public Relations</Button>
                            </Link>
                            <Link to="/EventsAndAnnouncements" className="flex">
                                <Button className="w-full">Events and Announcements</Button>
                            </Link>
                            <Link to="/FAQ" className="flex">
                                <Button className="w-full">Frequently Asked Questions</Button>
                            </Link>
                            <Link to="/" className="flex">
                                <Button className="w-full">Return To Home Page</Button>
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
            );
};

            export default MyFirstMeeting;
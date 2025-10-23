import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

/**
 * Help for Gambling Page
 * URL: /helpforgambling
 * 
 * This is a landing page designed to attract search traffic
 * from people searching for help with gambling problems.
 * 
 * Sections:
 * - SEO-optimized heading and intro
 * - Multiple text + image sections with CTAs
 * - Signs of gambling addiction
 * - What GA is
 * - How to get help (two-column layout)
 * - Recovery inspiration
 */
const HelpForGambling = () => {
    // SEO data for Help for Gambling page
    const seoData = {
        title: "How to Stop Gambling | Help for Gambling Addiction | Baton Rouge",
        description: "Can't stop gambling? Learn practical steps to quit gambling today. Free, confidential support in Baton Rouge for anyone ready to break the gambling cycle.",
        canonicalUrl: "/helpforgambling",
        keywords: [
            "how to stop gambling",
            "can't stop gambling",
            "i want to stop gambling",
            "quit gambling addiction",
            "help for gambling",
            "ways to stop gambling",
            "gambling addiction help",
            "stop gambling now",
            "gambling problem help",
            "compulsive gambling treatment",
            "gambling addiction support baton rouge",
            "gambling help louisiana",
            "how do i quit gambling"
        ],
        structuredData: {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Help for Gambling Addiction in Baton Rouge",
            "url": "https://batonrougega.org/helpforgambling",
            "description": "Resources and support for people struggling with gambling addiction in Baton Rouge and Hammond, Louisiana",
            "mainEntity": {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "How do I stop gambling?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "To stop gambling: 1) Admit you need help, 2) Call our helpline at 888-502-5610 or attend a GA meeting, 3) Block access to gambling sites and venues, 4) Follow the GA 12-step program, and 5) Take recovery one day at a time with support from others who have overcome gambling addiction."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "I can't stop gambling - what should I do?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "If you can't stop gambling despite trying, you're experiencing a common symptom of gambling addiction. The most effective next step is to connect with others who have overcome this same struggle. Call our 24/7 helpline at 888-502-5610 or attend a Gamblers Anonymous meeting in Baton Rouge where you'll find free, confidential support."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "What are practical ways to quit gambling?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Practical ways to quit gambling include: removing gambling apps from your devices, self-excluding from casinos and betting sites, having someone else manage your finances temporarily, attending GA meetings regularly, finding new hobbies to replace gambling time, and building a support network of people who understand addiction recovery."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Where can I find help for gambling addiction in Baton Rouge?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Baton Rouge has multiple Gamblers Anonymous meetings throughout the week. You can find a complete list of meetings on our website or call our 24/7 helpline at 888-502-5610 for immediate support from someone who understands what you're going through."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Is it possible to stop gambling for good?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes, thousands of people have stopped gambling permanently through Gamblers Anonymous. While recovery is a lifelong journey taken one day at a time, many members have remained gambling-free for decades by following the GA program, attending meetings, and helping others recover."
                        }
                    }
                ]
            }
        }
    };

    return (
        <>
            <SEO {...seoData} />
            <div className="w-full">
                {/* Main H1 - Centered at top */}
                <div className="w-full bg-white py-12 text-center">
                    <h1 className="font-league-spartan text-[56px] leading-[60px] font-bold text-[#6B92B0]">
                        How to Stop Gambling: Help & Support in Baton Rouge
                    </h1>
                </div>

                {/* Section 1: Intro with image - help for gambling circle meeting */}
                <div className="w-full bg-white py-16">
                    <div className="w-3/4 mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            {/* Text - Left */}
                            <div>
                                <p className="font-helvetica text-[18px] leading-[28px] text-gray-700 mb-4">
                                    If you've ever thought, <span className="font-bold">"I can't stop gambling"</span> or wondered <span className="font-bold">"how do I stop gambling?"</span>, you are not alone. Gambling addiction affects people from all walks of life, and many of us reached a point where we felt completely out of control.
                                </p>
                                <p className="font-helvetica text-[18px] leading-[28px] text-gray-700">
                                    <Link to="/aboutgamblersanonymous" className="text-[#6B92B0] underline hover:text-blue-600">Gamblers Anonymous</Link> <span className="font-bold">(GA)</span> offers free, confidential support for anyone struggling with gambling — whether it's casinos, sports betting, video poker, online apps, or any other form of gambling.
                                </p>
                            </div>
                            {/* Image - Right */}
                            <div className="flex justify-center">
                                <img
                                    src="/images/help for gambling circle meeting.webp"
                                    alt="Support group for gambling addiction in Baton Rouge"
                                    className="rounded-lg max-w-full h-auto"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Signs You May Need Help with image - help for gambling looking at phone */}
                <div className="w-full bg-gray-50 py-16">
                    <div className="w-3/4 mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            {/* Image - Left */}
                            <div className="flex justify-center order-2 md:order-1">
                                <img
                                    src="/images/help for gambling looking at phone.webp"
                                    alt="I can't stop gambling — help and recovery support"
                                    className="rounded-lg max-w-full h-auto"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                            {/* Text - Right */}
                            <div className="order-1 md:order-2">
                                <h2 className="font-league-spartan text-[56px] leading-[60px] font-bold text-[#6B92B0] mb-6">
                                    Signs You May Need Help
                                </h2>
                                <ul className="space-y-3 text-gray-700 mb-6">
                                    <li className="font-helvetica text-[18px] leading-[28px]">• You've tried to stop gambling, but can't</li>
                                    <li className="font-helvetica text-[18px] leading-[28px]">• You're hiding your gambling from family or friends</li>
                                    <li className="font-helvetica text-[18px] leading-[28px]">• You've lost time, money, relationships, or trust</li>
                                    <li className="font-helvetica text-[18px] leading-[28px]">• You feel guilt, shame, or anxiety about your gambling</li>
                                    <li className="font-helvetica text-[18px] leading-[28px]">• You've told yourself "this is the last time" — more than once</li>
                                </ul>
                                <p className="font-helvetica text-[18px] leading-[28px] text-gray-700">
                                    If any of this sounds familiar, <Link to="/meetings" className="text-[#6B92B0] underline hover:text-blue-600 font-semibold">help is available today</Link>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: What is Gamblers Anonymous with image - help for gambling next step */}
                <div className="w-full bg-white py-16">
                    <div className="w-3/4 mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            {/* Text - Left */}
                            <div>
                                <h2 className="font-league-spartan text-[56px] leading-[60px] font-bold text-[#6B92B0] mb-6">
                                    What is Gamblers Anonymous?
                                </h2>
                                <p className="font-helvetica text-[18px] leading-[28px] text-gray-700 mb-4">
                                    <Link to="/aboutgamblersanonymous" className="text-[#6B92B0] underline hover:text-blue-600">Gamblers Anonymous</Link> is a fellowship of people who share their experience, strength, and hope with each other to stop gambling and support others who want to stop.
                                </p>
                                <p className="font-helvetica text-[18px] leading-[28px] text-gray-700">
                                    There are <span className="font-bold">no fees, no registration, and no judgment</span> — only people who understand what you're going through.
                                </p>
                            </div>
                            {/* Image - Right */}
                            <div className="flex justify-center">
                                <img
                                    src="/images/help for gambling next step.webp"
                                    alt="Taking the next step in gambling addiction recovery with Gamblers Anonymous"
                                    className="rounded-lg max-w-full h-auto"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* NEW Section: Practical Steps to Stop Gambling */}
                <div className="w-full bg-white py-16">
                    <div className="w-3/4 mx-auto px-6">
                        <h2 className="font-league-spartan text-[56px] leading-[60px] font-bold text-[#6B92B0] mb-8 text-center">
                            5 Practical Steps to Stop Gambling Today
                        </h2>
                        <div className="space-y-6">
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="font-helvetica text-[24px] font-semibold text-[#6B92B0] mb-3">1. Admit You Can't Stop on Your Own</h3>
                                <p className="font-helvetica text-[18px] leading-[28px] text-gray-700">
                                    The first step to recovery is acknowledging that gambling has become a problem you can't control by yourself. This honest admission opens the door to getting the help you need.
                                </p>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="font-helvetica text-[24px] font-semibold text-[#6B92B0] mb-3">2. Reach Out for Support</h3>
                                <p className="font-helvetica text-[18px] leading-[28px] text-gray-700">
                                    Call our 24/7 helpline at <a href="tel:888-502-5610" className="text-[#6B92B0] underline hover:text-blue-600 font-semibold">888-502-5610</a> or <Link to="/meetings" className="text-[#6B92B0] underline hover:text-blue-600">attend a meeting</Link>. Speaking with others who have overcome gambling addiction provides hope and practical guidance.
                                </p>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="font-helvetica text-[24px] font-semibold text-[#6B92B0] mb-3">3. Make a Commitment to Recovery</h3>
                                <p className="font-helvetica text-[18px] leading-[28px] text-gray-700">
                                    Many members find that making a firm commitment to their recovery and attending meetings regularly helps them stay focused on their goal of abstaining from gambling one day at a time.
                                </p>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="font-helvetica text-[24px] font-semibold text-[#6B92B0] mb-3">4. Follow a Recovery Program</h3>
                                <p className="font-helvetica text-[18px] leading-[28px] text-gray-700">
                                    The <Link to="/12stepsandunityprogram" className="text-[#6B92B0] underline hover:text-blue-600">GA 12-Step Program</Link> provides a proven path to recovery. Thousands have successfully stopped gambling by working through these steps with the support of others in recovery.
                                </p>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="font-helvetica text-[24px] font-semibold text-[#6B92B0] mb-3">5. Rebuild One Day at a Time</h3>
                                <p className="font-helvetica text-[18px] leading-[28px] text-gray-700">
                                    Recovery happens gradually. Focus on staying gambling-free today, develop new hobbies, repair relationships, and celebrate each milestone. Many in our Baton Rouge GA community have found freedom from gambling this way.
                                </p>
                            </div>
                        </div>
                        <div className="mt-8 text-center">
                            <Link
                                to="/meetings"
                                className="px-8 py-4 bg-[#8BB7D1] text-black font-helvetica font-semibold rounded-md hover:bg-opacity-90 transition-all inline-block"
                            >
                                START YOUR RECOVERY TODAY
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Section 4: Two-column layout - How to Get Help + Do I Have a Problem */}
                <div className="w-full bg-gray-50 py-16">
                    <div className="w-3/4 mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[440px]">
                            {/* Left Column: How to Get Help Right Now */}
                            <div>
                                <h2 className="font-league-spartan text-[56px] leading-[60px] font-bold text-[#6B92B0] mb-6">
                                    How to Get Help Right Now
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <p className="font-helvetica text-[18px] leading-[28px] text-gray-700 mb-2">
                                            ✅ <span className="font-semibold">Attend a meeting</span> – <Link to="/meetings" className="text-[#6B92B0] underline hover:text-blue-600">View our local meeting schedule here</Link>
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-helvetica text-[18px] leading-[28px] text-gray-700 mb-2">
                                            ✅ <span className="font-semibold">Call our 24-hour local support line</span> – <a href="tel:888-502-5610" className="text-[#6B92B0] underline hover:text-blue-600 font-semibold">888-502-5610</a> – A compulsive gambler in the Baton Rouge area that has been exactly where you will answer anytime of the day or night
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-helvetica text-[18px] leading-[28px] text-gray-700 mb-2">
                                            ✅ <span className="font-semibold">Contact us online</span> – <Link to="/contactus" className="text-[#6B92B0] underline hover:text-blue-600">Contact Page</Link>
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-gray-300">
                                    <p className="font-helvetica text-[18px] leading-[28px] text-gray-700">
                                        You don't have to wait for things to get worse. You don't need to hit rock bottom. If you want to stop gambling — <span className="font-bold">we're here to help</span>.
                                    </p>
                                </div>
                            </div>

                            {/* Right Column: Do I Have a Gambling Problem */}
                            <div className="flex flex-col">
                                <h2 className="font-league-spartan text-[56px] leading-[60px] font-bold text-[#6B92B0] mb-6">
                                    Do I Have a Gambling Problem?
                                </h2>
                                <div className="flex-1 flex items-center justify-center text-center">
                                    <p className="font-helvetica text-[18px] leading-[28px] text-gray-700">
                                        Only you can decide. But we invite you to read the <Link to="/20questions" className="text-[#6B92B0] underline hover:text-blue-600 font-semibold">20 Questions</Link> — a helpful tool many of us used when we weren't sure.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 5: Recovery Is Possible with image - help for gambling sunrise */}
                <div className="w-full bg-white py-16">
                    <div className="w-3/4 mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            {/* Image - Left */}
                            <div className="flex justify-center order-2 md:order-1">
                                <img
                                    src="/images/help for gambling sunrise.webp"
                                    alt="Gamblers Anonymous success story — Baton Rouge meeting"
                                    className="rounded-lg max-w-full h-auto"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                            {/* Text - Right */}
                            <div className="order-1 md:order-2">
                                <h2 className="font-league-spartan text-[56px] leading-[60px] font-bold text-[#6B92B0] mb-6">
                                    Recovery Is Possible
                                </h2>
                                <p className="font-helvetica text-[18px] leading-[28px] text-gray-700 mb-6">
                                    Many of us have found peace, financial stability, and personal healing by working the GA program.
                                </p>
                                <p className="font-helvetica text-[18px] leading-[28px] text-gray-700 mb-6">
                                    You are not alone. <Link to="/meetings" className="text-[#6B92B0] underline hover:text-blue-600 font-semibold">Take the first step today</Link>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HelpForGambling;
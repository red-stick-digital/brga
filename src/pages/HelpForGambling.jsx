import React from 'react';
import { Link } from 'react-router-dom';

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
    return (
        <div className="w-full">
            {/* Main H1 - Centered at top */}
            <div className="w-full bg-white py-12 text-center">
                <h1 className="font-league-spartan text-[56px] leading-[60px] font-bold text-[#6B92B0]">
                    Help for Gambling in Baton Rouge
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
                                src="/images/help for gambling circle meeting.png"
                                alt="Help for gambling circle meeting"
                                className="rounded-lg max-w-full h-auto"
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
                                src="/images/help for gambling looking at phone.png"
                                alt="Help for gambling looking at phone"
                                className="rounded-lg max-w-full h-auto"
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
                                src="/images/help for gambling next step.png"
                                alt="Help for gambling next step"
                                className="rounded-lg max-w-full h-auto"
                            />
                        </div>
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
                                src="/images/help for gambling sunrise.png"
                                alt="Help for gambling sunrise recovery"
                                className="rounded-lg max-w-full h-auto"
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
    );
};

export default HelpForGambling;
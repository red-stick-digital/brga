import React from 'react';
import { Link } from 'react-router-dom';

/**
 * About Gamblers Anonymous Page
 * URL: /aboutgamblersanonymous
 * 
 * This page provides:
 * - About Gamblers Anonymous
 * - Mission statement
 * - Core values and principles
 * - Information about recovery
 */
const AboutGamblersAnonymous = () => {
    return (
        <div className="w-full bg-white">
            <div className="w-3/4 mx-auto px-6 py-20">
                {/* Heading */}
                <h1 className="font-league-spartan text-[56px] leading-[60px] font-bold text-[#6B92B0] text-center mb-12">
                    About Gamblers Anonymous
                </h1>

                {/* Content Sections */}
                <div className="space-y-8 max-w-4xl mx-auto">
                    <p className="font-helvetica text-[16px] leading-[26px] text-gray-700">
                        Gamblers Anonymous is a fellowship of men and women who share their experience, strength, and hope with each other that they may solve their common problem and help others to recover from a gambling problem.
                    </p>

                    <p className="font-helvetica text-[16px] leading-[26px] text-gray-700">
                        The only requirement for membership is a desire to stop gambling. There are no dues or fees for Gamblers Anonymous membership; we are self-supporting through our own contributions. Gamblers Anonymous is not allied with any sect, denomination, politics, organization, or institution; does not wish to engage in any controversy; neither endorses nor opposes any cause. Our primary purpose is to stop gambling and to help other compulsive gamblers do the same.
                    </p>

                    <p className="font-helvetica text-[16px] leading-[26px] text-gray-700">
                        Most of us have been unwilling to admit we were real problem gamblers. No one likes to think they are different from their fellows. Therefore, it is not surprising that our gambling careers have been characterized by countless vain attempts to prove we could gamble like other people. The idea that somehow, someday, we will control our gambling is the great obsession of every compulsive gambler. The persistence of this illusion is astonishing. Many pursue it into the gates of prison, insanity, or death.
                    </p>

                    <p className="font-helvetica text-[16px] leading-[26px] text-gray-700">
                        We learned we had to concede fully to our innermost selves that we are compulsive gamblers. This is the first step in our recovery. With reference to gambling, the delusion that we are like other people, or presently may be, has to be smashed. We have lost the ability to control our gambling. We know that no real compulsive gambler ever regains control. All of us felt at times we were regaining control, but such intervals - usually brief - were inevitably followed by still less control, which lead in time to pitiful and incomprehensible demoralization. We are convinced that gamblers of our type are in the grip of a progressive illness. Over any considerable period of time we get worse, never better. Therefore, in order to lead normal happy lives, we try to practice to the best of our ability, certain principles in our daily affairs.
                    </p>
                </div>

                {/* Buttons Section */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-16">
                    <Link
                        to="/meetings"
                        className="px-12 py-4 bg-[#8BB7D1] text-black font-helvetica font-bold text-base rounded-md hover:bg-opacity-90 transition-all whitespace-nowrap"
                    >
                        Get Started
                    </Link>

                    <Link
                        to="/twelvestepsandunityprogram"
                        className="px-12 py-4 bg-[#8BB7D1] text-black font-helvetica font-bold text-base rounded-md hover:bg-opacity-90 transition-all whitespace-nowrap"
                    >
                        12 Steps and Unity Program
                    </Link>

                    <Link
                        to="/20questions"
                        className="px-12 py-4 bg-[#8BB7D1] text-black font-helvetica font-bold text-base rounded-md hover:bg-opacity-90 transition-all whitespace-nowrap"
                    >
                        Am I a Compulsive Gambler?
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AboutGamblersAnonymous;
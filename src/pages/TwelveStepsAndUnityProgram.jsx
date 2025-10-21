import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import SEO from '../components/common/SEO';

/**
 * Twelve Steps and Unity Program Page
 * URL: /12stepsandunityprogram
 * 
 * This page displays:
 * - The 12 Steps of Gamblers Anonymous
 * - The 12 Traditions (Unity Program)
 * - Links to Meetings and 20 Questions
 */
const TwelveStepsAndUnityProgram = () => {
    // SEO data for Twelve Steps and Unity Program page
    const seoData = {
        title: "GA 12 Steps & Unity Program | Baton Rouge Gamblers Anonymous",
        description: "Explore the GA 12 Steps and Unity Program used by Baton Rouge Gamblers Anonymous members to support lasting recovery from compulsive gambling.",
        canonicalUrl: "/12stepsandunityprogram",
        keywords: [
            "gamblers anonymous 12 steps",
            "GA unity program",
            "gambling recovery steps",
            "GA traditions",
            "compulsive gambling recovery",
            "gambling addiction program",
            "GA spiritual principles",
            "gambling recovery baton rouge"
        ],
        structuredData: {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "The 12 Steps and Unity Program of Gamblers Anonymous",
            "description": "The spiritual principles that guide recovery in Gamblers Anonymous",
            "author": {
                "@type": "Organization",
                "name": "Baton Rouge Gamblers Anonymous"
            },
            "publisher": {
                "@type": "Organization",
                "name": "Baton Rouge Gamblers Anonymous",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://batonrougega.org/images/logo-white.png"
                }
            },
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://batonrougega.org/12stepsandunityprogram"
            }
        }
    };
    const twelveSteps = [
        "We admitted we were powerless over gambling, that our lives had become unmanageable.",
        "Came to believe that a Power greater than ourselves could restore us to a normal way of thinking and living.",
        "Made a decision to turn our will and our lives over to the care of this Power of our own understanding.",
        "Made a searching and fearless moral and financial inventory of ourselves.",
        "Admitted to ourselves and to another human being the exact nature of our wrongs.",
        "Were entirely ready to have these defects of character removed.",
        "Humbly asked God (of our understanding) to remove our shortcomings.",
        "Made a list of all persons we had harmed and became willing to make amends to them all.",
        "Made direct amends to such people wherever possible, except when to do so would injure them or others.",
        "Continued to take personal inventory, and when we were wrong, promptly admitted it.",
        "Sought through prayer and meditation to improve our conscious contact with God as we understood Him, praying only for knowledge of His will for us and the power to carry that out.",
        "Having made an effort to practice these principles in all our affairs, we tried to carry this message to other compulsive gamblers."
    ];

    const unityProgram = [
        "Our common welfare should come first; personal recovery depends upon group unity.",
        "Our leaders are but trusted servants; they do not govern.",
        "The only requirement for Gamblers Anonymous membership is a desire to stop gambling.",
        "Each group should be self-governing except in matters affecting other groups or Gamblers Anonymous as a whole.",
        "Gamblers Anonymous has but one primary purpose - to carry its message to the compulsive gambler who still suffers.",
        "Gamblers Anonymous ought never endorse, finance, or lend the Gamblers Anonymous name to any related facility or outside enterprise, lest problems of money, property, and prestige divert us from our primary purpose.",
        "Every Gamblers Anonymous group ought to be fully self-supporting, declining outside contributions.",
        "Gamblers Anonymous should remain forever non-professional, but our service centers may employ special workers.",
        "Gamblers Anonymous, as such, ought never be organized; but we may create service boards or committees directly responsible to those they serve.",
        "Gamblers Anonymous has no opinion on outside issues, hence the Gamblers Anonymous name ought never be drawn into public controversy.",
        "Our public relations policy is based on attraction rather than promotion; we need always maintain personal anonymity at the level of press, radio, films, television, and Internet.",
        "Anonymity is the spiritual foundation of the Gamblers Anonymous program, ever reminding us to place principles before personalities."
    ];

    return (
        <>
            <SEO {...seoData} />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold mb-6">The 12 Steps & Unity Program</h1>

                <p className="text-lg mb-8 text-gray-700">
                    The Gamblers Anonymous recovery program is based on the following spiritual principles. Our fellowship is filled with people who have worked with other GA members to follow these steps, recover from gambling, and develop a better way of life.
                </p>

                <div className="grid gap-12 md:grid-cols-2 mb-12">
                    <div>
                        <h2 className="text-2xl font-semibold mb-6">Here are the steps which are a program of recovery:</h2>
                        <ol className="space-y-4 text-gray-700">
                            {twelveSteps.map((step, index) => (
                                <li key={index} className="flex gap-3">
                                    <span className="font-semibold flex-shrink-0">{index + 1}.</span>
                                    <span>{step}</span>
                                </li>
                            ))}
                        </ol>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold mb-6">The Unity Program</h2>
                        <p className="text-gray-700 mb-4">In order to maintain unity our experience has shown that:</p>
                        <ol className="space-y-4 text-gray-700">
                            {unityProgram.map((tradition, index) => (
                                <li key={index} className="flex gap-3">
                                    <span className="font-semibold flex-shrink-0">{index + 1}.</span>
                                    <span>{tradition}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>

                <div className="flex flex-col gap-4 mt-12">
                    <Link to="/meetings" className="flex">
                        <Button className="w-full">Get Started</Button>
                    </Link>
                    <Link to="/twentyquestions" className="flex">
                        <Button className="w-full">Am I a Compulsive Gambler?</Button>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default TwelveStepsAndUnityProgram;
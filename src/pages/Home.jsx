'use client'

import { Link } from 'react-router-dom'
import Video from '../components/common/Video'
import Button from '../components/common/Button'
import SEO from '../components/common/SEO'

export default function Home() {
    const handleCallClick = () => {
        window.location.href = 'tel:888-502-5610'
    }

    // SEO data for Home page
    const seoData = {
        title: "Help for Gambling | Baton Rouge Gamblers Anonymous | How to Stop Gambling",
        description: "Struggling with gambling? Find hope and support through Baton Rouge Gamblers Anonymous. Join a local GA meeting and start your recovery journey today.",
        canonicalUrl: "/",
        keywords: [
            "gamblers anonymous baton rouge",
            "gambling addiction help",
            "how to stop gambling",
            "can't stop gambling",
            "i want to stop gambling",
            "compulsive gambling",
            "stop gambling",
            "gambling problem",
            "GA meetings baton rouge",
            "gambling addiction support",
            "hammond louisiana gamblers anonymous",
            "quit gambling addiction"
        ],
        structuredData: {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Baton Rouge Gamblers Anonymous",
            "url": "https://batonrougega.org",
            "logo": "https://batonrougega.org/images/logo-white.webp",
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-888-502-5610",
                "contactType": "Customer Support",
                "availableLanguage": "English"
            },
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Baton Rouge",
                "addressRegion": "LA",
                "postalCode": "70820",
                "addressCountry": "US"
            }
        }
    };

    return (
        <>
            <SEO {...seoData} />
            <div className="w-full">
                {/* Hero Section */}
                <div
                    className="relative w-full flex items-start justify-center pt-[280px] sm:pt-[200px] md:pt-[250px] pb-12 sm:pb-16"
                    style={{
                        backgroundImage: 'url(/images/Home%20Hand%20Up.webp)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        minHeight: '700px',
                    }}
                >
                    {/* Overlay for readability */}
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>

                    {/* Content */}
                    <div className="relative z-10 text-center px-6 max-w-6xl mt-0">
                        <h1 className="hero-h1 text-white mb-8">
                            Gambling Addiction?<br />Compulsive Gambler? We are<br />glad you are here.
                        </h1>

                        <p className="font-helvetica text-[24px] leading-[36px] font-normal text-white mb-12">
                            If you need immediate help in quitting gambling, please call us at<br />
                            <span className="font-semibold">888-502-5610</span>
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                to="/meetings"
                                className="px-8 py-4 min-w-[235px] bg-[#8BB7D1] text-black font-helvetica font-semibold rounded-md hover:bg-opacity-90 transition-all"
                            >
                                GET STARTED NOW
                            </Link>
                            <Button onClick={handleCallClick}>
                                CALL US NOW
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Video Section */}
                <div className="w-full sm:w-[90%] lg:w-[67.5%] mx-auto px-4 sm:px-6 py-8">
                    <Video />
                </div>

                {/* Help for Gambling Section */}
                <div className="w-full bg-gray-100 py-16">
                    <div className="w-3/4 mx-auto px-6 text-center">
                        <h2 className="font-league-spartan text-[56px] leading-[60px] font-bold text-[#6B92B0] mb-6">
                            Need Help for Gambling?
                        </h2>
                        <div className="w-full lg:w-[805px] mx-auto px-6 lg:px-0">
                            <p className="font-helvetica text-[18px] leading-[28px] text-gray-700">
                                If you've been wondering <span className="font-bold">"how do I stop gambling"</span> or feeling like <span className="font-bold">"I can't stop gambling,"</span> you are not alone. Many people in Baton Rouge and Hammond struggle with gambling addiction. We are here to offer <Link to="/helpforgambling" className="text-[#6B92B0] underline hover:text-blue-600">help for gambling</Link> through local <Link to="/meetings" className="text-[#6B92B0] underline hover:text-blue-600">Gamblers Anonymous meetings</Link> and the support of others who understand what you're going through. Whether you want to stop going to casinos, sports betting, video poker, racetracks, or any other form of gambling, we are here to help.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Welcome Section */}
                <div className="w-full bg-white py-20">
                    <div className="w-3/4 mx-auto px-6">
                        <h2 className="font-league-spartan text-[56px] leading-[60px] font-bold text-[#6B92B0] text-center mb-16">
                            Welcome to Baton Rouge Gamblers Anonymous
                        </h2>

                        {/* Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12 justify-items-center">
                            {/* Card 1: Our Story */}
                            <div className="flex flex-col items-center text-center max-w-[400px] w-full">
                                <img
                                    src="/images/home three rocks.webp"
                                    alt="Rocks that represent the first three steps of a twelve step program."
                                    className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] lg:w-[350px] lg:h-[350px] rounded-full object-cover mb-4"
                                    loading="lazy"
                                    decoding="async"
                                />
                                <h3 className="font-helvetica text-[24px] font-normal text-gray-800 mb-3">
                                    Our Story
                                </h3>
                                <div className="w-full max-w-[380px] min-h-[150px] flex items-center">
                                    <p className="font-helvetica font-light text-[20px] leading-[30px] text-[#5E5E5E]">
                                        We are a group of compulsive gamblers in the Baton Rouge and Hammond area that share our experience strength and hope so that we may solve our common problem which is gambling addiction.
                                    </p>
                                </div>
                            </div>

                            {/* Card 2: Local Meetings */}
                            <div className="flex flex-col items-center text-center max-w-[400px] w-full">
                                <img
                                    src="/images/home bonsai.webp"
                                    alt="A bonsai tree that invokes hope to be able to stop gambling."
                                    className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] lg:w-[350px] lg:h-[350px] rounded-full object-cover mb-4"
                                    loading="lazy"
                                    decoding="async"
                                />
                                <h3 className="font-helvetica text-[24px] font-normal text-gray-800 mb-3">
                                    Local Meetings
                                </h3>
                                <div className="w-full max-w-[380px] min-h-[150px] flex flex-col justify-center">
                                    <p className="font-helvetica font-light text-[20px] leading-[30px] mb-4 text-[#5E5E5E]">
                                        There are multiple meetings of recovery available throughout the week in our area.
                                    </p>
                                    <Link
                                        to="/meetings"
                                        className="px-6 py-2 bg-[#8BB7D1] text-black font-helvetica font-bold text-sm rounded hover:bg-opacity-90 transition-all"
                                    >
                                        LEARN MORE
                                    </Link>
                                </div>
                            </div>

                            {/* Card 3: Am I a compulsive gambler? */}
                            <div className="flex flex-col items-center text-center max-w-[400px] w-full">
                                <img
                                    src="/images/home head down.webp"
                                    alt="A sad woman crying because she wants to stop gambling."
                                    className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] lg:w-[350px] lg:h-[350px] rounded-full object-cover mb-4"
                                    loading="lazy"
                                    decoding="async"
                                />
                                <h3 className="font-helvetica text-[24px] font-normal text-gray-800 mb-3">
                                    Am I a compulsive gambler?
                                </h3>
                                <div className="w-full max-w-[380px] min-h-[150px] flex flex-col justify-center">
                                    <p className="font-helvetica font-light text-[20px] leading-[30px] mb-4 text-[#5E5E5E]">
                                        Only you can decide that. Answering these 20 questions can help you make that decision.
                                    </p>
                                    <Link
                                        to="/20questions"
                                        className="px-6 py-2 bg-[#8BB7D1] text-black font-helvetica font-bold text-sm rounded hover:bg-opacity-90 transition-all"
                                    >
                                        ANSWER NOW
                                    </Link>
                                </div>
                            </div>

                            {/* Card 4: Stop Now */}
                            <div className="flex flex-col items-center text-center max-w-[400px] w-full">
                                <img
                                    src="/images/home slot machine.webp"
                                    alt="A group of people addicted to gambling staring at a slot machine in a casino."
                                    className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] lg:w-[350px] lg:h-[350px] rounded-full object-cover mb-4"
                                    loading="lazy"
                                    decoding="async"
                                />
                                <h3 className="font-helvetica text-[24px] font-normal text-gray-800 mb-3">
                                    Stop Now
                                </h3>
                                <div className="w-full max-w-[380px] min-h-[150px] flex flex-col justify-center">
                                    <p className="font-helvetica font-light text-[20px] leading-[30px] mb-4 text-[#5E5E5E]">
                                        Whether you want to stop going to casinos, sports betting, video poker, racetracks or any other type of gambling we are here to help.
                                    </p>
                                    <Link
                                        to="/meetings"
                                        className="px-6 py-2 bg-[#8BB7D1] text-black font-helvetica font-bold text-sm rounded hover:bg-opacity-90 transition-all"
                                    >
                                        STOP NOW
                                    </Link>
                                </div>
                            </div>

                            {/* Card 5: GA International */}
                            <div className="flex flex-col items-center text-center max-w-[400px] w-full">
                                <img
                                    src="/images/home walking on rocks.webp"
                                    alt="A person walking on the rocks taking steps to improve their life."
                                    className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] lg:w-[350px] lg:h-[350px] rounded-full object-cover mb-4"
                                    loading="lazy"
                                    decoding="async"
                                />
                                <h3 className="font-helvetica text-[24px] font-normal text-gray-800 mb-3">
                                    GA International
                                </h3>
                                <div className="w-full max-w-[380px] min-h-[150px] flex flex-col justify-center">
                                    <p className="font-helvetica font-light text-[20px] leading-[30px] mb-4 text-[#5E5E5E]">
                                        Click below to be taken to the Gamblers Anonymous International Service Office website.
                                    </p>
                                    <a
                                        href="https://gamblersanonymous.org/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-6 py-2 bg-[#8BB7D1] text-black font-helvetica font-bold text-sm rounded hover:bg-opacity-90 transition-all"
                                    >
                                        GO NOW
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Someone's Gambling Affecting You Section */}
                <div className="w-full flex items-center justify-center py-12 px-4">
                    <div className="flex flex-col items-center justify-center text-center max-w-4xl">
                        <p className="font-helvetica font-normal text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] leading-[1.3] text-[#151515] mb-6 sm:mb-8 text-center px-2">
                            Are you concerned about someone else gambling in your life?
                        </p>
                        <Button className="font-bold text-center text-sm sm:text-base px-4 sm:px-6 whitespace-normal sm:whitespace-nowrap max-w-full">
                            IS SOMEONE'S GAMBLING AFFECTING YOU? CLICK HERE
                        </Button>
                    </div>
                </div>

                {/* Contact Us Section */}
                <div className="w-full bg-white py-16">
                    <div className="w-3/4 mx-auto px-6 text-center">
                        <h2 className="font-league-spartan text-[56px] leading-[60px] font-bold text-[#6B92B0] mb-8">
                            Contact Us
                        </h2>
                        <p className="font-helvetica text-[18px] leading-[28px] text-gray-700 mb-4">
                            We hope to see you at a meeting soon!
                        </p>
                        <p className="font-helvetica text-[18px] leading-[28px] text-gray-700 font-bold mb-2">
                            Baton Rouge Area Gamblers Anonymous
                        </p>
                        <p className="font-helvetica text-[18px] leading-[28px] text-gray-700 mb-6">
                            Baton Rouge, Louisiana 70820, United States
                        </p>
                        <p className="font-helvetica text-[18px] leading-[28px] text-gray-700 mb-6">
                            <a href="tel:888-502-5610" className="text-[#6B92B0] font-semibold hover:underline">
                                888-502-5610
                            </a>
                        </p>
                        <p className="font-helvetica text-[18px] leading-[28px] text-gray-700 font-bold mb-3">
                            Hours
                        </p>
                        <p className="font-helvetica text-[18px] leading-[28px] text-gray-700">
                            A local compulsive gambler is available to answer your phone call 24 hours a day, 7 days a week.
                        </p>
                    </div>
                </div>

                {/* Connect With Us Section */}
                <div className="w-full bg-white py-16">
                    <div className="w-3/4 mx-auto px-6 text-center">
                        <h2 className="font-league-spartan text-[56px] leading-[60px] font-bold text-[#6B92B0] mb-12">
                            Connect With Us
                        </h2>
                        <div className="flex justify-center items-center gap-8">
                            {/* Facebook Icon */}
                            <a
                                href="https://www.facebook.com/profile.php?id=61556538624235#"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-80 transition-opacity"
                            >
                                <img
                                    src="/images/Facebook_Logo_Primary.webp"
                                    alt="Facebook"
                                    className="social-icon"
                                />
                            </a>

                            {/* X Icon */}
                            <a
                                href="https://x.com/BatonRougeGA"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-80 transition-opacity"
                            >
                                <div
                                    className="flex items-center justify-center bg-black rounded-full social-icon"
                                >
                                    <img
                                        src="/images/logo-white.webp"
                                        alt="X"
                                        className="social-icon-small"
                                    />
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
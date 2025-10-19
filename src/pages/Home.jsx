'use client'

import { Link } from 'react-router-dom'
import Video from '../components/common/Video'

export default function Home() {
    const handleCallClick = () => {
        window.location.href = 'tel:888-502-5610'
    }

    return (
        <div className="w-full">
            {/* Hero Section */}
            <div
                className="relative w-full flex items-center justify-center"
                style={{
                    backgroundImage: 'url(/images/Home%20Hand%20Up.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    height: '650px',
                }}
            >
                {/* Overlay for readability */}
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>

                {/* Content */}
                <div className="relative z-10 text-center px-6 max-w-4xl">
                    <h1 className="font-league-spartan text-[64px] leading-[76.8px] font-normal text-white mb-8">
                        Gambling Addiction? Compulsive Gambler? We are glad you are here.
                    </h1>

                    <p className="font-helvetica text-[24px] leading-[36px] font-normal text-white mb-12">
                        If you need immediate help in quitting gambling, please call us at<br />
                        <span className="font-semibold">888-502-5610</span>
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            to="/meetings"
                            className="px-8 py-4 bg-[#8BB7D1] text-black font-helvetica font-semibold rounded-md hover:bg-opacity-90 transition-all"
                        >
                            Get Started Now
                        </Link>
                        <button
                            onClick={handleCallClick}
                            className="px-8 py-4 bg-[#8BB7D1] text-black font-helvetica font-semibold rounded-md hover:bg-opacity-90 transition-all"
                        >
                            Call Us Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Video Section */}
            <div className="w-3/4 mx-auto px-6 py-8">
                <Video />
            </div>

            {/* Help for Gambling Section */}
            <div className="w-full bg-gray-100 py-16">
                <div className="w-3/4 mx-auto px-6 text-center">
                    <h2 className="font-league-spartan text-[48px] leading-[57.6px] font-bold text-[#6B92B0] mb-6">
                        Need Help for Gambling?
                    </h2>
                    <p className="font-helvetica text-[18px] leading-[28px] text-gray-700">
                        If you've been wondering <span className="font-bold">"how do I stop gambling"</span> or feeling like <span className="font-bold">"I can't stop gambling,"</span> you are not alone. Many people in Baton Rouge and Hammond struggle with gambling addiction. We are here to offer <Link to="/helpforgambling" className="text-[#6B92B0] underline hover:text-blue-600">help for gambling</Link> through local <Link to="/meetings" className="text-[#6B92B0] underline hover:text-blue-600">Gamblers Anonymous meetings</Link> and the support of others who understand what you're going through. Whether you want to stop going to casinos, sports betting, video poker, racetracks, or any other form of gambling, we are here to help.
                    </p>
                </div>
            </div>

            {/* Welcome Section */}
            <div className="w-full bg-white py-20">
                <div className="w-3/4 mx-auto px-6">
                    <h2 className="font-league-spartan text-[48px] leading-[57.6px] font-bold text-[#6B92B0] text-center mb-16">
                        Welcome to Baton Rouge Gamblers Anonymous
                    </h2>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                        {/* Card 1: Our Story */}
                        <div className="flex flex-col items-center text-center" style={{ width: '427px', height: '675px' }}>
                            <img
                                src="/images/home three rocks.png"
                                alt="Our Story"
                                className="rounded-full object-cover mb-4"
                                style={{ width: '378px', height: '378px' }}
                            />
                            <h3 className="font-league-spartan text-[24px] font-bold text-gray-800 mb-3">
                                Our Story
                            </h3>
                            <p className="font-helvetica text-[16px] leading-[24px] text-gray-700">
                                We are a group of compulsive gamblers in the Baton Rouge and Hammond area that share our experience strength and hope so that we may solve our common problem which is gambling addiction.
                            </p>
                        </div>

                        {/* Card 2: Local Meetings */}
                        <div className="flex flex-col items-center text-center" style={{ width: '427px', height: '675px' }}>
                            <img
                                src="/images/home bonsai.png"
                                alt="Local Meetings"
                                className="rounded-full object-cover mb-4"
                                style={{ width: '378px', height: '378px' }}
                            />
                            <h3 className="font-league-spartan text-[24px] font-bold text-gray-800 mb-3">
                                Local Meetings
                            </h3>
                            <p className="font-helvetica text-[16px] leading-[24px] text-gray-700 mb-4">
                                There are multiple meetings of recovery available throughout the week in our area.
                            </p>
                            <Link
                                to="/meetings"
                                className="px-6 py-2 bg-[#8BB7D1] text-black font-helvetica font-bold text-sm rounded hover:bg-opacity-90 transition-all"
                            >
                                LEARN MORE
                            </Link>
                        </div>

                        {/* Card 3: Am I a compulsive gambler? */}
                        <div className="flex flex-col items-center text-center" style={{ width: '427px', height: '675px' }}>
                            <img
                                src="/images/home head down.png"
                                alt="Am I a compulsive gambler?"
                                className="rounded-full object-cover mb-4"
                                style={{ width: '378px', height: '378px' }}
                            />
                            <h3 className="font-league-spartan text-[24px] font-bold text-gray-800 mb-3">
                                Am I a compulsive gambler?
                            </h3>
                            <p className="font-helvetica text-[16px] leading-[24px] text-gray-700 mb-4">
                                Only you can decide that. Answering these 20 questions can help you make that decision.
                            </p>
                            <Link
                                to="/20questions"
                                className="px-6 py-2 bg-[#8BB7D1] text-black font-helvetica font-bold text-sm rounded hover:bg-opacity-90 transition-all"
                            >
                                ANSWER NOW
                            </Link>
                        </div>

                        {/* Card 4: Stop Now */}
                        <div className="flex flex-col items-center text-center" style={{ width: '427px', height: '675px' }}>
                            <img
                                src="/images/home slot machine.png"
                                alt="Stop Now"
                                className="rounded-full object-cover mb-4"
                                style={{ width: '378px', height: '378px' }}
                            />
                            <p className="font-helvetica text-[16px] leading-[24px] text-gray-700 mb-4">
                                Whether you want to stop going to casinos, sports betting, video poker, racetracks or any other type of gambling we are here to help.
                            </p>
                            <Link
                                to="/meetings"
                                className="px-6 py-2 bg-[#8BB7D1] text-black font-helvetica font-bold text-sm rounded hover:bg-opacity-90 transition-all"
                            >
                                STOP NOW
                            </Link>
                        </div>

                        {/* Card 5: GA International */}
                        <div className="flex flex-col items-center text-center" style={{ width: '427px', height: '675px' }}>
                            <img
                                src="/images/home walking on rocks.png"
                                alt="Gamblers Anonymous International"
                                className="rounded-full object-cover mb-4"
                                style={{ width: '378px', height: '378px' }}
                            />
                            <p className="font-helvetica text-[16px] leading-[24px] text-gray-700 mb-4">
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

            {/* Someone's Gambling Affecting You Section */}
            <div className="w-full flex items-center justify-center py-12" style={{ height: '312px' }}>
                <div className="flex flex-col items-center justify-center text-center" style={{ width: '805px', height: '200px' }}>
                    <p className="font-helvetica text-[18px] leading-[26px] text-gray-800 mb-6" style={{ width: '747px', height: '115px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        Are you concerned about someone else gambling in your life?
                    </p>
                    <button
                        className="bg-[#8BB7D1] text-black font-helvetica font-bold rounded hover:bg-opacity-90 transition-all"
                        style={{ width: '507px', height: '19px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 0' }}
                    >
                        Is Someone's Gambling Affecting You? Click Here
                    </button>
                </div>
            </div>

            {/* Contact Us Section */}
            <div className="w-full bg-white py-16">
                <div className="w-3/4 mx-auto px-6 text-center">
                    <h2 className="font-league-spartan text-[48px] leading-[57.6px] font-bold text-[#6B92B0] mb-8">
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
                    <h2 className="font-league-spartan text-[48px] leading-[57.6px] font-bold text-[#6B92B0] mb-12">
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
                                src="/images/Facebook_Logo_Primary.png"
                                alt="Facebook"
                                style={{ width: '50px', height: '50px' }}
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
                                className="flex items-center justify-center bg-black rounded-full"
                                style={{ width: '50px', height: '50px' }}
                            >
                                <img
                                    src="/images/logo-white.png"
                                    alt="X"
                                    style={{ width: '30px', height: '30px' }}
                                />
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
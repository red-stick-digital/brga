import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const Meetings = () => {
    return (
        <div className="flex flex-col items-center py-12">
            {/* Main Heading */}
            <h1 className="page-heading">
                In Person Meeting List
            </h1>

            {/* Content Container - 805px wide, centered */}
            <div className="content-container">
                {/* Mondays Section */}
                <div className="mt-12 mb-8">
                    <h2 className="section-heading mb-6">
                        Mondays
                    </h2>

                    <div className="space-y-6">
                        {/* South Baton Rouge Church of Christ - Open GA Meeting */}
                        <div>
                            <div className="meeting-header">
                                <p className="meeting-title">
                                    South Baton Rouge Church of Christ, Open GA Meeting
                                </p>
                                <p className="meeting-time">
                                    7p - 8p
                                </p>
                            </div>
                            <p className="text-gray-700 mt-2">8725 Jefferson Highway</p>
                            <p className="text-gray-700">Baton Rouge, LA 70809</p>
                            <p className="text-gray-700">Education Building to the Right of the Church</p>
                        </div>

                        {/* South Baton Rouge Church of Christ - Open Gam-Anon Meeting */}
                        <div>
                            <div className="meeting-header">
                                <p className="meeting-title">
                                    South Baton Rouge Church of Christ, Open Gam-Anon Meeting
                                </p>
                                <p className="meeting-time">
                                    7p - 8p
                                </p>
                            </div>
                            <p className="text-gray-700 mt-2">8725 Jefferson Highway</p>
                            <p className="text-gray-700">Baton Rouge, LA 70809</p>
                            <p className="text-gray-700">Education Building to the Right of the Church</p>
                        </div>
                    </div>
                </div>

                {/* Tuesdays Section */}
                <div className="mt-12 mb-8">
                    <h2 className="section-heading mb-6">
                        Tuesdays
                    </h2>

                    <div className="space-y-6">
                        {/* Broadmoor Baptist Church */}
                        <div>
                            <div className="meeting-header">
                                <p className="meeting-title">
                                    Broadmoor Baptist Church, Open GA Meeting
                                </p>
                                <p className="meeting-time">
                                    7p - 8p
                                </p>
                            </div>
                            <p className="text-gray-700 mt-2">9755 Goodwood Blvd.</p>
                            <p className="text-gray-700">Baton Rouge, LA 70815</p>
                            <p className="text-gray-700">Small Building on the Right Side of the Parking Lot - Click Here for Exact Location</p>
                            <p className="special-note">
                                2nd Tuesday of the Month - Intergroup Meeting at 6pm
                            </p>
                        </div>
                    </div>
                </div>

                {/* Wednesdays Section */}
                <div className="mt-12 mb-8">
                    <h2 className="section-heading mb-6">
                        Wednesdays
                    </h2>

                    <div className="space-y-6">
                        {/* Grace Baptist Church */}
                        <div>
                            <div className="meeting-header">
                                <p className="meeting-title">
                                    Grace Baptist Church, Open GA Meeting
                                </p>
                                <p className="meeting-time">
                                    6:30p - 7:30p
                                </p>
                            </div>
                            <p className="text-gray-700 mt-2">630 Richland Ave.</p>
                            <p className="text-gray-700">Baton Rouge, LA 70806</p>
                            <p className="text-gray-700">Building on the Left Side of the Church, 1st Floor - Click Here for Exact Location</p>
                            <p className="special-note">
                                1st Wednesday of the Month - Speaker Meeting
                            </p>
                        </div>
                    </div>
                </div>

                {/* Thursdays Section */}
                <div className="mt-12 mb-8">
                    <h2 className="section-heading mb-6">
                        Thursdays
                    </h2>

                    <div className="space-y-6">
                        {/* South Baton Rouge Church of Christ - Noon */}
                        <div>
                            <div className="meeting-header">
                                <p className="meeting-title">
                                    South Baton Rouge Church of Christ, Open GA Meeting
                                </p>
                                <p className="meeting-time">
                                    12p - 1p
                                </p>
                            </div>
                            <p className="text-gray-700 mt-2">8725 Jefferson Highway</p>
                            <p className="text-gray-700">Baton Rouge, LA 70809</p>
                            <p className="text-gray-700">Education Building to the Right of the Church</p>
                        </div>

                        {/* Broadmoor United Methodist Church */}
                        <div>
                            <div className="meeting-header">
                                <p className="meeting-title">
                                    Broadmoor United Methodist Church, Open GA Meeting
                                </p>
                                <p className="meeting-time">
                                    7p - 8p
                                </p>
                            </div>
                            <p className="text-gray-700 mt-2">10230 Mollylea Dr.</p>
                            <p className="text-gray-700">Baton Rouge, LA 70815</p>
                            <p className="text-gray-700">Community Ministries Building on the Back Side of the Grounds - Click Here for Exact Location</p>
                            <p className="special-note">
                                1st Thursday of the Month - Step Meeting
                            </p>
                        </div>

                        {/* Holy Ghost Catholic Church */}
                        <div>
                            <div className="meeting-header">
                                <p className="meeting-title">
                                    Holy Ghost Catholic Church, Open GA Meeting
                                </p>
                                <p className="meeting-time">
                                    7p - 8p
                                </p>
                            </div>
                            <p className="text-gray-700 mt-2">600 North Oaks Dr.</p>
                            <p className="text-gray-700">Hammond, LA 70401</p>
                        </div>

                        {/* Location TBA */}
                        <div>
                            <div className="meeting-header">
                                <p className="meeting-title">
                                    Location TBA, Open GA Meeting
                                </p>
                                <p className="meeting-time">
                                    7p - 8p
                                </p>
                            </div>
                            <p className="text-gray-700 mt-2">Alexandria, LA</p>
                        </div>
                    </div>
                </div>

                {/* Fridays Section */}
                <div className="mt-12 mb-8">
                    <h2 className="section-heading mb-6">
                        Fridays
                    </h2>

                    <div className="space-y-6">
                        {/* Blackwater Methodist Church */}
                        <div>
                            <div className="meeting-header">
                                <p className="meeting-title">
                                    Blackwater Methodist Church, Open GA Meeting
                                </p>
                                <p className="meeting-time">
                                    12p - 1p
                                </p>
                            </div>
                            <p className="text-gray-700 mt-2">10000 Blackwater Rd.</p>
                            <p className="text-gray-700">Baker, LA 70818</p>
                            <p className="text-gray-700">Meeting Room Building Behind the Church - Click Here for Exact Location</p>
                            <p className="special-note">
                                1st Friday of the Month - Step Meeting
                            </p>
                        </div>
                    </div>
                </div>

                {/* Saturdays Section */}
                <div className="mt-12 mb-8">
                    <h2 className="section-heading mb-6">
                        Saturdays
                    </h2>

                    <div className="space-y-6">
                        {/* Luke 10:27 Church */}
                        <div>
                            <div className="meeting-header">
                                <p className="meeting-title">
                                    Luke 10:27 Church, Open GA Meeting
                                </p>
                                <p className="meeting-time">
                                    10a - 11a
                                </p>
                            </div>
                            <p className="text-gray-700 mt-2">536 Centerville St. NE</p>
                            <p className="text-gray-700">Denham Springs, LA 70726</p>
                            <p className="text-gray-700">Second Building on the Left - Up the Wheelchair Ramp in Back - Click Here for Exact Location</p>
                        </div>
                    </div>
                </div>

                {/* Sundays Section */}
                <div className="mt-12 mb-8">
                    <h2 className="section-heading mb-6">
                        Sundays
                    </h2>

                    <div className="space-y-6">
                        {/* Stepping Stones Club House */}
                        <div>
                            <div className="meeting-header">
                                <p className="meeting-title">
                                    Stepping Stones Club House, Open GA Meeting
                                </p>
                                <p className="meeting-time">
                                    7p - 8p
                                </p>
                            </div>
                            <p className="text-gray-700 mt-2">1027 N. Burnside Dr.</p>
                            <p className="text-gray-700">Gonzales, LA 70737 - Click Here for Exact Location</p>
                            <p className="special-note">
                                3rd Sunday of the Month - Blue Book Meeting
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Info about open vs closed meetings */}
            <div className="mt-12 mb-8 bg-gray-100 p-6 rounded-lg info-box">
                <p className="text-gray-700">
                    Anyone may attend an open meeting whether they are a gambler or not. Closed meetings require that you identify or think you may be a compulsive gambler.
                </p>
            </div>

            {/* Download Section */}
            <div className="mt-12 mb-12 flex flex-col items-center">
                <h2 className="page-heading">
                    Download The Meeting List Here
                </h2>

                <div className="flex flex-col gap-4">
                    <a
                        href="/documents/meeting-list.pdf"
                        download
                        className="inline-block"
                    >
                        <Button>Baton Rouge Area Meetings (pdf)</Button>
                    </a>
                </div>
            </div>

            {/* Virtual Meetings Section */}
            <div className="mt-12 mb-8 bg-gray-100 p-6 rounded-lg flex flex-col items-center info-box">
                <p className="text-gray-700 mb-6">
                    If you do not live in the area or for some other reason cannot attend in person meetings please look at this list of virtual meetings. You can attend a virtual meeting in any city or state, regardless of where you currently live.
                </p>
                <a href="https://gamblersanonymous.org/virtual-meetings/" target="_blank" rel="noopener noreferrer">
                    <Button>Virtual Meetings</Button>
                </a>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-12 mb-12">
                <div className="w-full max-w-2xl mx-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <Link to="/MyFirstMeeting" className="flex">
                            <Button className="w-full">Guide to Your First Meeting</Button>
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

export default Meetings;
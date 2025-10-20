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
                            <a
                                href="https://www.google.com/maps/place/South+Baton+Rouge+Church+of+Christ/@30.4192982,-91.0927394,16z/data=!3m1!4b1!4m6!3m5!1s0x8626a488a4d875c7:0x6b3b292a874fbcab!8m2!3d30.4192982!4d-91.0927394!16s%2Fg%2F1vv2sls2?entry=ttu&g_ep=EgoyMDI1MTAxNC4wIKXMDSoASAFQAw%3D%3D"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline mt-2 block"
                            >
                                8725 Jefferson Highway
                            </a>
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
                            <a
                                href="https://www.google.com/maps/place/South+Baton+Rouge+Church+of+Christ/@30.4192982,-91.0927394,16z/data=!3m1!4b1!4m6!3m5!1s0x8626a488a4d875c7:0x6b3b292a874fbcab!8m2!3d30.4192982!4d-91.0927394!16s%2Fg%2F1vv2sls2?entry=ttu&g_ep=EgoyMDI1MTAxNC4wIKXMDSoASAFQAw%3D%3D"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline mt-2 block"
                            >
                                8725 Jefferson Highway
                            </a>
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
                            <a
                                href="https://www.google.com/maps/search/?api=1&query=30.444005934036213%2C-91.0782889999624&query_place_id=ChIJ36anY2ijJoYRCQwfV_yk9T0"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline mt-2 block"
                            >
                                9755 Goodwood Blvd.
                            </a>
                            <p className="text-gray-700">Baton Rouge, LA 70815</p>
                            <p className="text-gray-700">Small Building on the Right Side of the Parking Lot - <a
                                href="https://www.google.com/maps/place/30%C2%B026'38.4%22N+91%C2%B004'41.9%22W/@30.4440276,-91.080457,17z/data=!4m4!3m3!8m2!3d30.4440091!4d-91.0783112?entry=ttu&g_ep=EgoyMDI1MTAxNC4wIKXMDSoASAFQAw%3D%3D"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                                Click Here for Exact Location
                            </a></p>
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
                            <a
                                href="https://www.google.com/maps/search/?api=1&query=30.44302736703997%2C-91.1489680607058&query_place_id=ChIJQw0s8EWhJoYR5AlpxIXW4y8"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline mt-2 block"
                            >
                                630 Richland Ave.
                            </a>
                            <p className="text-gray-700">Baton Rouge, LA 70806</p>
                            <p className="text-gray-700">Building on the Left Side of the Church, 1st Floor - <a
                                href="https://www.google.com/maps/place/30%C2%B026'34.9%22N+91%C2%B008'56.3%22W/@30.4431072,-91.1501182,17.79z/data=!4m4!3m3!8m2!3d30.4430222!4d-91.148973?entry=ttu&g_ep=EgoyMDI1MTAxNC4wIKXMDSoASAFQAw%3D%3D"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                                Click Here for Exact Location
                            </a></p>
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
                            <a
                                href="https://www.google.com/maps/place/South+Baton+Rouge+Church+of+Christ/@30.4192982,-91.0927394,16z/data=!3m1!4b1!4m6!3m5!1s0x8626a488a4d875c7:0x6b3b292a874fbcab!8m2!3d30.4192982!4d-91.0927394!16s%2Fg%2F1vv2sls2?entry=ttu&g_ep=EgoyMDI1MTAxNC4wIKXMDSoASAFQAw%3D%3D"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline mt-2 block"
                            >
                                8725 Jefferson Highway
                            </a>
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
                            <a
                                href="https://www.google.com/maps/search/?api=1&query=30.45127722697914%2C-91.0723423962657&query_place_id=ChIJP1L7MEejJoYRsgyz4GNd5Mo"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline mt-2 block"
                            >
                                10230 Mollylea Dr.
                            </a>
                            <p className="text-gray-700">Baton Rouge, LA 70815</p>
                            <p className="text-gray-700">Community Ministries Building on the Back Side of the Grounds - <a
                                href="https://www.google.com/maps/search/?api=1&query=30.451278851192694%2C-91.07234308493572"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                                Click Here for Exact Location
                            </a></p>
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
                            <a
                                href="https://www.google.com/maps/search/?api=1&query=30.509231042058477%2C-90.4633630131272&query_place_id=ChIJvRomRrkiJ4YRQw677QC5_TA"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline mt-2 block"
                            >
                                600 North Oaks Dr.
                            </a>
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
                            <a
                                href="https://www.google.com/maps/search/?api=1&query=30.542229312288875%2C-91.08537507770156&query_place_id=ChIJwb5cnNeZJoYRESJMNtaxJNs"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline mt-2 block"
                            >
                                10000 Blackwater Rd.
                            </a>
                            <p className="text-gray-700">Baker, LA 70818</p>
                            <p className="text-gray-700">Meeting Room Building Behind the Church - <a
                                href="https://www.google.com/maps/search/?api=1&query=30.542250475778584%2C-91.08532410301632"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                                Click Here for Exact Location
                            </a></p>
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
                            <a
                                href="https://www.google.com/maps/search/?api=1&query=30.486381376265832%2C-90.94755857393369&query_place_id=ChIJZ2jHU1--JoYRm8Cvzn0APFo"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline mt-2 block"
                            >
                                536 Centerville St. NE
                            </a>
                            <p className="text-gray-700">Denham Springs, LA 70726</p>
                            <p className="text-gray-700">Second Building on the Left - Up the Wheelchair Ramp in Back - <a
                                href="https://www.google.com/maps/search/?api=1&query=30.486299169615744%2C-90.9475544307773"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                                Click Here for Exact Location
                            </a></p>
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
                            <a
                                href="https://www.google.com/maps/search/?api=1&query=30.240825309924702%2C-90.92096583628728&query_place_id=ChIJV2_4lea1JoYRM3jjz6gecrs"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline mt-2 block"
                            >
                                1027 N. Burnside Dr.
                            </a>
                            <p className="text-gray-700">Gonzales, LA 70737 - <a
                                href="https://www.google.com/maps/search/?api=1&query=30.24080090868117%2C-90.92102596603577"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                                Click Here for Exact Location
                            </a></p>
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
                        href="/documents/meetinglist.pdf"
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
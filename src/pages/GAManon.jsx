import React from 'react';
import Button from '../components/common/Button';

/**
 * Gam-Anon Page
 * URL: /gamanon
 * 
 * This page provides information about Gam-Anon, which is the support group
 * for families and friends of problem gamblers.
 */
const GAManon = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-8">Gam-Anon</h1>

            <p className="text-lg mb-6 text-gray-700">
                Gam-Anon is a 12 Step self-help fellowship of men and women who have been affected by the gambling problem of a loved one.
            </p>

            <p className="mb-6 text-gray-700">
                We understand as perhaps few can. We are familiar with worry and sleepless nights and promises made only to be broken. The message of Gam-Anon is: Come join with us.
            </p>

            <p className="mb-6 text-gray-700">
                We too were alone, afraid, and unable to cope with the deterioration in our relationships, the financial problems, and the debt caused by the gambling problem. We know that living with the effects of a loved one's gambling can be too devastating to bear without help. Through Gam-Anon we find our way back to a normal way of thinking and living whether or not our loved ones continue to gamble.
            </p>

            <p className="mb-8 text-gray-700">
                If a gambling problem is affecting your life, you may find help at a Gam-Anon meeting.
            </p>

            <div className="bg-gray-50 border-l-4 border-blue-400 p-6 mb-12">
                <h2 className="text-2xl font-semibold mb-4">Join us at our Monday night Gam-Anon meeting</h2>
                <p className="mb-2 text-gray-700"><strong>Time:</strong> 7pm - 8pm</p>
                <p className="mb-2 text-gray-700"><strong>Location:</strong></p>
                <p className="text-gray-700">
                    South Baton Rouge Church of Christ<br />
                    8725 Jefferson Highway<br />
                    Baton Rouge, LA 70809<br />
                    Education Building to the Right of the Church
                </p>
            </div>

            <div className="flex flex-col gap-4">
                <a href="https://www.gam-anon.org/meeting-directory" target="_blank" rel="noopener noreferrer" className="flex">
                    <Button className="w-full">Locate Other Gam-Anon Meetings</Button>
                </a>
                <a href="https://gam-anon.org/" target="_blank" rel="noopener noreferrer" className="flex">
                    <Button className="w-full">Gam-Anon International Service Office</Button>
                </a>
            </div>
        </div>
    );
};

export default GAManon;
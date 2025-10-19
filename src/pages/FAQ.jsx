import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

/**
 * FAQ Page
 * URL: /faq
 * 
 * This page should display frequently asked questions about:
 * - Gamblers Anonymous
 * - How to get help
 * - Meeting information
 * - Confidentiality and privacy
 * - The recovery process
 */
const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);
    const navigate = useNavigate();

    const faqs = [
        {
            question: 'Looking for Help for Gambling?',
            answer: () => (
                <p>If you've been wondering "<b>how do I stop gambling</b>" or feeling like "<b>I can't stop gambling,</b>" you are not alone. This FAQ is here to provide information and hope for anyone seeking <b>help for gambling</b> or wanting to learn more about how Gamblers Anonymous can support your recovery journey. You can also <Link to="/meetings" className="text-blue-600 hover:text-blue-800 underline">find a meeting here</Link> or <Link to="/contact-us" className="text-blue-600 hover:text-blue-800 underline">contact us here</Link>.</p>
            ),
        },
        {
            question: 'What is Gamblers Anonymous?',
            answer: () => (
                <>
                    <p>Gamblers Anonymous is a fellowship of people who share their experience, strength, and hope with each other that they may solve their common problem and help others to recover from a gambling problem.</p>
                    <p className="mt-4">The only requirement for membership is a desire to stop gambling. There are no dues or fees for Gamblers Anonymous membership; we are self-supporting through our own contributions. Gamblers Anonymous is not allied with any sect, denomination, politics, organization, or institution; does not wish to engage in any controversy; neither endorses nor opposes any cause. Our primary purpose is to stop gambling and to help other compulsive gamblers do the same.</p>
                    <p className="mt-4">We are a twelve step fellowship that meets for help and mutual support in dealing with our common obsession to gamble. There is no hierarchy or ruling class among the members. Newcomers and long time members are equally valued in our fellowship. The operating structure of Gamblers Anonymous is based upon voluntary service by its members. Our International Service Office (ISO) is the only part of Gamblers Anonymous with paid professional staff, as it handles the business side of Gamblers Anonymous.</p>
                </>
            ),
        },
        {
            question: 'How Do I Find a Gamblers Anonymous Meeting?',
            answer: () => (
                <>
                    <p>Gamblers Anonymous meetings are found in most states in the USA and in a growing number of other countries around the globe. A good starting point is to visit the <Link to="/meetings" className="text-blue-600 hover:text-blue-800 underline">Find a Meeting page</Link> on this site, or the ISO website: <a href="https://gamblersanonymous.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">www.gamblersanonymous.org</a>.</p>
                    <p className="mt-4">You can call our local hotline at <a href="tel:888-502-5610" className="text-blue-600 hover:text-blue-800 underline">888-502-5610</a> or call the Gamblers Anonymous hotline: 1-855-2-CALL-GA (1-855-222-5542).</p>
                </>
            ),
        },
        {
            question: 'What Is Compulsive Gambling?',
            answer: () => (
                <p>Compulsive gambling is an illness, progressive in nature, which can never be cured, but can be arrested. Before coming to Gamblers Anonymous many compulsive gamblers thought of themselves as morally weak, or at times just plain "no good." The Gamblers Anonymous concept is that compulsive gamblers are really very sick people who can recover if they will follow to the best of their ability a simple program that has proved successful for thousands of other people with a gambling or compulsive gambling problem.</p>
            ),
        },
        {
            question: 'What does a compulsive gambler need to do in order to stop gambling?',
            answer: () => (
                <p>We as compulsive gamblers need to have a desire to get well. We need to be willing to accept the fact that we are in the grip of a progressive illness. Our experience has shown that the Gamblers Anonymous program will always work for any person who has a desire to stop gambling. However, it will never work for the person who will not face squarely the facts about this illness.</p>
            ),
        },
        {
            question: 'How can you tell whether you are a compulsive gambler?',
            answer: () => (
                <p>Only you can make that decision. Most people turn to Gamblers Anonymous when they become willing to admit that gambling has defeated them. Also, in Gamblers Anonymous, a compulsive gambler is described as a person whose gambling has caused growing and continuing problems in any department of their life. Many Gamblers Anonymous members went through terrifying experiences before they were ready to accept help. Others were faced with a slow, subtle deterioration which finally brought them to the point of admitting defeat. Answering the <Link to="/twenty-questions" className="text-blue-600 hover:text-blue-800 underline">20 Questions</Link> may help you decide.</p>
            ),
        },
        {
            question: 'Can a compulsive gambler ever gamble normally again?',
            answer: () => (
                <p>No. The first bet to a problem gambler is like the first drink to an alcoholic. Sooner or later they fall back into the same old destructive pattern. Once a person has crossed the invisible line into irresponsible, uncontrolled gambling, they never seem to regain control. After abstaining a few months, some of our members have tried some small bet experimentation, always with disastrous results. The old obsession inevitably returned. Our Gamblers Anonymous experience seems to point to these alternatives: To gamble, risking progressive deterioration, or not to gamble, and develop a better way of life.</p>
            ),
        },
        {
            question: 'Why can\'t a compulsive gambler simply use willpower to stop gambling?',
            answer: () => (
                <p>We believe that most people, if they are honest, will recognize their lack of power to solve certain problems. When it comes to gambling, we have known many problem gamblers who could abstain for long stretches, but caught off guard and under the right set of circumstances, they started gambling without thought of the consequences. The defenses they relied upon, through willpower alone, gave way before some trivial reason for placing a bet. We have found that willpower and self-knowledge will not help in those mental blank spots, but adherence to spiritual principles seems to solve our problems. Most of us feel that a belief in a Power greater than ourselves is necessary in order for us to sustain a desire to refrain from gambling.</p>
            ),
        },
        {
            question: 'I only go on gambling binges periodically. Do I need Gamblers Anonymous?',
            answer: () => (
                <p>Yes. Compulsive gamblers who have joined Gamblers Anonymous tell us that though their gambling binges were periodic, the intervals between were not periods of constructive thinking. Symptomatic of these periods were nervousness, irritability, frustration, indecision, and a continued breakdown in personal relationships. These same people have often found the Gamblers Anonymous program the answer to the elimination of character defects and a guide to moral progress in their lives.</p>
            ),
        },
        {
            question: 'How can I stop gambling?',
            answer: () => (
                <p>Many people come to Gamblers Anonymous when they realize they need <b>help for gambling</b>. Through local <Link to="/meetings" className="text-blue-600 hover:text-blue-800 underline">meetings</Link>, the support of other compulsive gamblers, and working the <Link to="/about-gamblers-anonymous" className="text-blue-600 hover:text-blue-800 underline">GA recovery program</Link>, many of us have found a path to recovery and hope. If you are looking for <b>help for gambling</b>, you are welcome here.</p>
            ),
        },
        {
            question: 'Can a person recover by reading Gamblers Anonymous literature or medical books on the problem of compulsive gambling?',
            answer: () => (
                <p>The foundation of the Gamblers Anonymous program is compulsive gamblers sharing experience, strength, and hope with each other. GA literature is most helpful when used in the context of meetings, sponsors, and the GA fellowship. As for medical or reference books, Gamblers Anonymous has no opinion on outside literature.</p>
            ),
        },
        {
            question: 'Is knowing why we gambled important?',
            answer: () => (
                <p>Perhaps, however insofar as stopping gambling, many Gamblers Anonymous members have abstained from gambling without the knowledge of why they gambled.</p>
            ),
        },
        {
            question: 'What are some characteristics of a person who is a compulsive gambler?',
            answer: () => (
                <>
                    <p>1. INABILITY AND UNWILLINGNESS TO ACCEPT REALITY: Hence the escape into the dream world of gambling.</p>
                    <p className="mt-4">2. EMOTIONAL INSECURITY: A compulsive gambler finds they are emotionally comfortable only when in action. It is not uncommon to hear a Gamblers Anonymous member say, "The only time I really felt like I belonged was when I was gambling. Then I felt secure and comfortable. No great demands were made on me. I knew I was destroying myself, yet at the same time, I had a certain sense of security."</p>
                    <p className="mt-4">3. IMMATURITY: A desire to have all the good things in life without any great effort on their part seems to be a common character pattern of compulsive gamblers. Many Gamblers Anonymous members accept the fact they were unwilling to grow up. Subconsciously they felt they could avoid mature responsibility by wagering on the spin of a wheel or the turn of a card, and so the struggle to escape responsibility finally became a subconscious obsession. Some compulsive gamblers seem to have a strong urge to be a "big shot" and need to have a feeling of being all powerful. The compulsive gambler is willing to do anything, often of an antisocial nature, to maintain the image they want others to see.</p>
                </>
            ),
        },
        {
            question: 'What is the dream world of a compulsive gambler?',
            answer: () => (
                <>
                    <p>This is another common characteristic of compulsive gamblers. A lot of time is spent creating images of the great and wonderful things they are going to do as soon as they make the big win. They often see themselves as quite philanthropic and charming people. They may dream of providing families and friends with a variety of luxuries. Compulsive gamblers picture themselves leading a pleasant, gracious life, made possible by the huge sums of money they think they will accrue from their "system." These wonderful things are always just around the corner as they chase the big win.</p>
                    <p className="mt-4">Pathetically, there never seems to be a big enough winning to make even the smallest dreams come true. When compulsive gamblers succeed, they gamble to dream still greater dreams. When failing, they gamble in reckless desperation, and the depths of their misery are fathomless as their dream world comes crashing down. Sadly, they will struggle back, dream more dreams, and of course suffer more misery. No one can convince them that their great schemes will not someday come true. They believe they will, for without this dream world, life for them would not be tolerable.</p>
                </>
            ),
        },
        {
            question: 'Isn\'t compulsive gambling basically a financial problem?',
            answer: () => (
                <>
                    <p>No. Compulsive gambling is an emotional problem. A person in the grip of this illness creates mountains of apparently insolvable problems. Of course financial problems are created, but they also find themselves facing marital, employment, or legal problems. Compulsive gamblers find friends have been lost, and relatives have rejected them. Of the many serious difficulties created, the financial problems often seem the easiest to solve. When a compulsive gambler enters Gamblers Anonymous and stops gambling, there is no longer the financial drain that was caused by gambling, and very shortly the financial pressures may be lessened.</p>
                    <p className="mt-4">Gamblers Anonymous members have found the best road to financial recovery is through hard work and repayment of our debts. Bankruptcy, borrowing and or lending of money [bailouts] in Gamblers Anonymous is detrimental to our recovery and should not take place.</p>
                    <p className="mt-4">The most difficult and time-consuming problem with which they will be faced is that of bringing about a character change within themselves. Most Gamblers Anonymous members look upon this as their greatest challenge which should be worked on immediately and continued throughout their lives.</p>
                </>
            ),
        },
        {
            question: 'Who can join Gamblers Anonymous?',
            answer: () => (
                <p>Anyone who has a desire to stop gambling. There are no other rules or regulations concerning Gamblers Anonymous membership.</p>
            ),
        },
        {
            question: 'How much does it cost to join Gamblers Anonymous?',
            answer: () => (
                <p>There are no dues or fees for Gamblers Anonymous membership. However, we do have expenses related to our group meetings and our Gamblers Anonymous service structure. Since Gamblers Anonymous is fully self-supporting and declines outside contributions, these expenses are met through voluntary financial support by the members. Experience has shown that acceptance of these financial responsibilities is a vital part of our individual and group growth.</p>
            ),
        },
        {
            question: 'Why are gamblers anonymous members anonymous?',
            answer: () => (
                <p>New members may worry about employers, family, or friends finding out about their compulsive gambling illness. In Gamblers Anonymous we want people to feel safe in our meetings, so we respect each other's privacy. This means that we use first names only, and that no individual speaks for Gamblers Anonymous at the level of press, radio, films, television, and internet.</p>
            ),
        },
        {
            question: 'Is Gamblers Anonymous a religious society?',
            answer: () => (
                <p>No. Gamblers Anonymous is composed of people from many faiths, along with agnostics and atheists. Since membership in Gamblers Anonymous requires no particular religious belief as a condition of membership, it cannot be described as a religious organization. The Gamblers Anonymous Recovery Program is based on the practice of certain spiritual principles, and the member is free to interpret these as they choose.</p>
            ),
        },
        {
            question: 'Is there support available for families and friends of compulsive gamblers?',
            answer: () => (
                <>
                    <p>Our compulsive gambling spread pain, misery, and chaos. Our loved ones are often the most deeply hurt. Certainly financial damage has been done, but often even more harmful is the emotional damage our gambling has caused. Just as we gamblers need the Gamblers Anonymous program, the fellowship and support of our fellow gamblers, our family and friends also need a place where their experiences are understood.</p>
                    <p className="mt-4">Gam-Anon is a fellowship of people whose lives have been impacted by another person's compulsive gambling. The Gam-Anon program is designed to provide growth and support for affected individuals whether the compulsive gambler is still gambling or not.</p>
                    <p className="mt-4">A bond exists between the Fellowships of Gamblers Anonymous and Gam-Anon; however, they are distinct and separate Fellowships. If you have people in your life who might benefit from participating in the Gam-Anon program, we encourage you to help them find a <Link to="/meetings" className="text-blue-600 hover:text-blue-800 underline">meeting</Link>. We try to be supportive of their recovery journeys, just as we hope they will be of ours. <a href="https://www.gam-anon.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Find the Gam-Anon website here</a>.</p>
                </>
            ),
        },
        {
            question: 'What should I do if I can\'t stop gambling?',
            answer: () => (
                <p>If you feel like your gambling is out of control, you're not alone. Many people feel powerless over gambling before they find <b>help for gambling</b>. Gamblers Anonymous offers a safe and supportive space to share your experience and begin recovery. You can attend a <Link to="/meetings" className="text-blue-600 hover:text-blue-800 underline">meeting in Baton Rouge</Link> or call us at <a href="tel:888-502-5610" className="text-blue-600 hover:text-blue-800 underline">888-502-5610</a> for immediate support.</p>
            ),
        },
        {
            question: 'Where can I find help for gambling addiction?',
            answer: () => (
                <p>You can find <b>help for gambling</b> through <Link to="/meetings" className="text-blue-600 hover:text-blue-800 underline">local Gamblers Anonymous meetings</Link> in the Baton Rouge area. Meetings are free and confidential, and they connect you with others who understand what you're going through. Whether you're dealing with casino gambling, sports betting, or other forms of gambling, there is hope and support available.</p>
            ),
        },
        {
            question: 'I\'ve lost everything because of gambling. Can I get my life back?',
            answer: () => (
                <p>Many of us in Gamblers Anonymous hit rock bottom — losing money, relationships, jobs, and hope. The good news is recovery is possible. Our members have rebuilt their lives by working the <Link to="/about-gamblers-anonymous" className="text-blue-600 hover:text-blue-800 underline">GA program</Link> and finding strength in community. You are not alone, and it's never too late to get help.</p>
            ),
        },
        {
            question: 'How do I quit gambling for good?',
            answer: () => (
                <p>Quitting gambling takes support, structure, and honesty. GA offers a path through shared experience, 12-step recovery, and consistent <Link to="/meetings" className="text-blue-600 hover:text-blue-800 underline">meetings</Link>. We believe anyone who has a desire to stop gambling can recover with help.</p>
            ),
        },
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h1>
            <p className="text-center text-gray-600 mb-8">
                Please reach us at <a href="tel:888-502-5610" className="text-blue-600 hover:text-blue-800 underline">888-502-5610</a> if you cannot find an answer to your question.
            </p>

            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-300 rounded-lg">
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full px-6 py-4 text-left font-semibold text-gray-900 hover:bg-gray-50 flex justify-between items-center"
                        >
                            {faq.question}
                            <span className="text-xl">{openIndex === index ? '−' : '+'}</span>
                        </button>

                        {openIndex === index && (
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-300 text-gray-700">
                                {faq.answer()}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-12 text-center">
                <p className="text-gray-600">
                    Don't see your question? Please reach us at <a href="tel:888-502-5610" className="text-blue-600 hover:text-blue-800 underline">888-502-5610</a> if you cannot find an answer to your question.
                </p>
            </div>

            <div className="mt-16 text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">If you think you may be a compulsive gambler, please come to a Gamblers Anonymous meeting.</h2>
                <Button onClick={() => navigate('/meetings')}>FIND A MEETING</Button>
            </div>
        </div>
    );
};

export default FAQ;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Twenty Questions Page
 * URL: /20questions
 * 
 * This page displays the "20 Questions" self-assessment tool
 * used by Gamblers Anonymous to help people identify if they
 * have a gambling problem.
 */
const TwentyQuestions = () => {
    const questions = [
        "Did you ever lose time from work or school due to gambling?",
        "Has gambling ever made your home life unhappy?",
        "Did gambling affect your reputation?",
        "Have you ever felt remorse after gambling?",
        "Did you ever gamble to get money with which to pay debts or otherwise solve financial difficulties?",
        "Did gambling cause a decrease in your ambition or efficiency?",
        "After losing did you feel you must return as soon as possible and win back your losses?",
        "After a win did you have a strong urge to return and win more?",
        "Did you often gamble until all your money was gone?",
        "Did you ever borrow to finance your gambling?",
        "Have you ever sold anything to finance gambling?",
        "Were you reluctant to use \"gambling money\" for normal expenditures?",
        "Did gambling make you careless of the welfare of yourself or your family?",
        "Did you ever gamble longer than you had planned?",
        "Have you ever gambled to escape worry, trouble, boredom, loneliness, grief, or loss?",
        "Have you ever committed, or considered committing, an illegal act to finance gambling?",
        "Did gambling cause you to have difficulty in sleeping?",
        "Do arguments, disappointments, or frustrations create within you an urge to gamble?",
        "Did you ever have an urge to celebrate any good fortune by a few hours of gambling?",
        "Have you ever considered self-destruction or suicide as a result of your gambling?"
    ];

    const [responses, setResponses] = useState(new Array(20).fill(false));
    const [showResults, setShowResults] = useState(false);

    const handleToggle = (index) => {
        const newResponses = [...responses];
        newResponses[index] = !newResponses[index];
        setResponses(newResponses);
    };

    const yesCount = responses.filter(Boolean).length;
    const isCompulsiveGambler = yesCount >= 7;

    const handleReset = () => {
        setResponses(new Array(20).fill(false));
        setShowResults(false);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">20 Questions</h1>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
                <p className="text-gray-700">
                    Gamblers Anonymous offers the following questions to help you decide if you are a compulsive gambler.
                </p>
            </div>

            <form className="space-y-6 mb-8">
                {questions.map((question, index) => (
                    <div key={index} className="flex items-start gap-4">
                        <input
                            type="checkbox"
                            id={`question-${index}`}
                            checked={responses[index]}
                            onChange={() => handleToggle(index)}
                            className="w-5 h-5 mt-1 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        />
                        <label htmlFor={`question-${index}`} className="text-gray-700 cursor-pointer flex-1">
                            <span className="font-semibold">{index + 1}.</span> {question}
                        </label>
                    </div>
                ))}
            </form>

            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setShowResults(true)}
                    className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                    See Results
                </button>
                <button
                    onClick={handleReset}
                    className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                    Reset
                </button>
            </div>

            {showResults && (
                <div className={`p-6 rounded-lg border-l-4 ${isCompulsiveGambler ? 'bg-red-50 border-red-400' : 'bg-green-50 border-green-400'}`}>
                    <h2 className="text-2xl font-bold mb-4">Your Results</h2>
                    <p className="text-lg font-semibold mb-4">
                        You answered "Yes" to <span className={isCompulsiveGambler ? 'text-red-600' : 'text-green-600'}>{yesCount}</span> out of 20 questions.
                    </p>

                    {isCompulsiveGambler ? (
                        <div className="text-gray-800">
                            <p className="mb-4">
                                Most compulsive gamblers will answer "yes" to at least seven of these questions. Based on your responses, you may have a gambling problem.
                            </p>
                            <p className="font-semibold text-lg mb-2">
                                Please reach out for support:
                            </p>
                            <p className="text-xl font-bold text-red-600 mb-4">
                                📞 Call our hotline: <a href="tel:888-502-5610" className="underline hover:text-red-800">888-502-5610</a>
                            </p>
                            <p className="mb-4">
                                We encourage you to attend a Gamblers Anonymous <Link to="/meetings" className="font-semibold text-blue-600 hover:underline">meeting</Link> in your area. You're not alone, and help is available.
                            </p>
                        </div>
                    ) : (
                        <div className="text-gray-800">
                            <p className="mb-4">
                                Based on your responses, you answered "yes" to fewer than seven questions. However, if you have concerns about your gambling habits, we still encourage you to reach out.
                            </p>
                            <p>
                                For more information or support, call our hotline: <a href="tel:888-502-5610" className="font-semibold text-blue-600 hover:underline">888-502-5610</a> or <Link to="/meetings" className="font-semibold text-blue-600 hover:underline">come to a meeting</Link> for help.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TwentyQuestions;
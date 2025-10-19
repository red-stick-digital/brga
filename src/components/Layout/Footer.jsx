import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto text-center">
                {/* Social Icons */}
                <div className="flex justify-center items-center gap-6 mb-8">
                    {/* Facebook Icon */}
                    <a
                        href="https://www.facebook.com/profile.php?id=61556538624235#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80 transition-opacity"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                    </a>

                    {/* X Icon */}
                    <a
                        href="https://x.com/BatonRougeGA"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80 transition-opacity"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.165-6.75-5.896 6.75h-3.308l7.73-8.835L2.6 2.25h6.602l4.699 6.203 5.343-6.203zm-1.1 14.646h1.828L7.671 3.912H5.759l10.385 12.984z" />
                        </svg>
                    </a>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-wrap justify-center items-center gap-6">
                    <Link
                        to="/meetings"
                        className="box-border inline text-base font-normal h-auto w-auto text-center uppercase antialiased break-words cursor-pointer hover:text-blue-400 transition-colors"
                        style={{
                            color: 'rgb(247, 247, 247)',
                            fontFamily: 'Helvetica, arial, sans-serif',
                            letterSpacing: '1.136px',
                            WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
                            WebkitFontSmoothing: 'antialiased',
                            textSizeAdjust: '100%'
                        }}
                    >
                        Meetings
                    </Link>
                    <Link
                        to="/eventsandannouncements"
                        className="box-border inline text-base font-normal h-auto w-auto text-center uppercase antialiased break-words cursor-pointer hover:text-blue-400 transition-colors"
                        style={{
                            color: 'rgb(247, 247, 247)',
                            fontFamily: 'Helvetica, arial, sans-serif',
                            letterSpacing: '1.136px',
                            WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
                            WebkitFontSmoothing: 'antialiased',
                            textSizeAdjust: '100%'
                        }}
                    >
                        Events & Announcements
                    </Link>
                    <Link
                        to="/12stepsandunityprogram"
                        className="box-border inline text-base font-normal h-auto w-auto text-center uppercase antialiased break-words cursor-pointer hover:text-blue-400 transition-colors"
                        style={{
                            color: 'rgb(247, 247, 247)',
                            fontFamily: 'Helvetica, arial, sans-serif',
                            letterSpacing: '1.136px',
                            WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
                            WebkitFontSmoothing: 'antialiased',
                            textSizeAdjust: '100%'
                        }}
                    >
                        12 Steps & Unity Program
                    </Link>
                    <Link
                        to="/gamanon"
                        className="box-border inline text-base font-normal h-auto w-auto text-center uppercase antialiased break-words cursor-pointer hover:text-blue-400 transition-colors"
                        style={{
                            color: 'rgb(247, 247, 247)',
                            fontFamily: 'Helvetica, arial, sans-serif',
                            letterSpacing: '1.136px',
                            WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
                            WebkitFontSmoothing: 'antialiased',
                            textSizeAdjust: '100%'
                        }}
                    >
                        Gam Anon
                    </Link>
                    <Link
                        to="/publicrelations"
                        className="box-border inline text-base font-normal h-auto w-auto text-center uppercase antialiased break-words cursor-pointer hover:text-blue-400 transition-colors"
                        style={{
                            color: 'rgb(247, 247, 247)',
                            fontFamily: 'Helvetica, arial, sans-serif',
                            letterSpacing: '1.136px',
                            WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
                            WebkitFontSmoothing: 'antialiased',
                            textSizeAdjust: '100%'
                        }}
                    >
                        Public Relations
                    </Link>
                    <Link
                        to="/faq"
                        className="box-border inline text-base font-normal h-auto w-auto text-center uppercase antialiased break-words cursor-pointer hover:text-blue-400 transition-colors"
                        style={{
                            color: 'rgb(247, 247, 247)',
                            fontFamily: 'Helvetica, arial, sans-serif',
                            letterSpacing: '1.136px',
                            WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
                            WebkitFontSmoothing: 'antialiased',
                            textSizeAdjust: '100%'
                        }}
                    >
                        FAQ
                    </Link>
                    <Link
                        to="/helpforgambling"
                        className="box-border inline text-base font-normal h-auto w-auto text-center uppercase antialiased break-words cursor-pointer hover:text-blue-400 transition-colors"
                        style={{
                            color: 'rgb(247, 247, 247)',
                            fontFamily: 'Helvetica, arial, sans-serif',
                            letterSpacing: '1.136px',
                            WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
                            WebkitFontSmoothing: 'antialiased',
                            textSizeAdjust: '100%'
                        }}
                    >
                        Help for Gambling
                    </Link>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;
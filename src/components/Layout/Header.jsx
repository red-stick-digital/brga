'use client'

import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

/**
 * Navigation Structure
 * 
 * Direct Desktop Links (always visible):
 * - Home
 * - Meetings
 * - My First Meeting
 * - 20 Questions
 * - Contact Us
 * - Login (button on right)
 * 
 * Hamburger Menu (desktop + mobile):
 * - About GA
 * - Help for Gambling
 * - Gam-Anon
 * - FAQ
 * - Members
 */
const directLinks = [
    { name: 'Home', href: '/' },
    { name: 'Meetings', href: '/meetings' },
    { name: 'My First Meeting', href: '/myfirstmeeting' },
    { name: '20 Questions', href: '/20questions' },
    { name: 'Contact Us', href: '/contactus' },
]

const hamburgerLinks = [
    { name: 'About GA', href: '/aboutgamblersanonymous' },
    { name: 'Help for Gambling', href: '/helpforgambling' },
    { name: 'Events & Announcements', href: '/eventsandannouncements' },
    { name: '12 Steps & Unity Program', href: '/12stepsandunityprogram' },
    { name: 'Gam-Anon', href: '/gamanon' },
    { name: 'Public Relations', href: '/publicrelations' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Members', href: '/membersonly' },
]

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [desktopMenuOpen, setDesktopMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const location = useLocation()
    const isHome = location.pathname === '/'

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header
            className={isHome ? `fixed top-0 left-0 right-0 z-20 transition-colors duration-300 ${isScrolled ? 'bg-black' : 'bg-transparent'}` : "bg-black"}
        >
            <nav aria-label="Global" className={`mx-auto flex w-full items-center justify-between p-6 lg:py-5 lg:px-0 ${isHome ? "relative z-10" : ""}`}>
                <div className="flex items-center gap-x-12 lg:pl-[50px]">
                    <Link to="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">Gamblers Anonymous - Baton Rouge</span>
                        <div className="font-league-spartan text-[40px] leading-[41px] font-bold text-[#F7F7F7]">
                            <div>Baton Rouge Area</div>
                            <div>Gamblers Anonymous</div>
                        </div>
                    </Link>
                    <div className="hidden lg:flex lg:gap-x-12 lg:flex-1 lg:pl-[80px]">
                        {directLinks.map((item) => (
                            <Link key={item.name} to={item.href} className="font-helvetica text-base leading-6 font-normal text-[#F7F7F7] hover:text-gray-300 tracking-[1.1px]">
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-[#F7F7F7]"
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon aria-hidden="true" className="size-6" />
                    </button>
                </div>
                <div className="hidden lg:flex lg:items-center lg:gap-x-8 lg:pr-[50px]">
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setDesktopMenuOpen(!desktopMenuOpen)}
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-[#F7F7F7] hover:text-gray-300"
                        >
                            <span className="sr-only">Open menu</span>
                            <Bars3Icon aria-hidden="true" className="size-6" />
                        </button>
                        {desktopMenuOpen && (
                            <div className="absolute right-0 z-50 mt-2 w-48 rounded-md bg-gray-900 py-2 shadow-lg">
                                {hamburgerLinks.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        onClick={() => setDesktopMenuOpen(false)}
                                        className="block px-4 py-2 font-helvetica text-base font-normal text-[#F7F7F7] hover:bg-gray-800 tracking-[1.1px]"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                    <Link to="/login" className="font-helvetica text-base leading-6 font-normal text-[#F7F7F7] hover:text-gray-300 tracking-[1.1px]">
                        Log in <span aria-hidden="true">&rarr;</span>
                    </Link>
                </div>
            </nav>
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-50" />
                <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-black p-6 sm:max-w-sm">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="-m-1.5 p-1.5">
                            <span className="sr-only">Gamblers Anonymous - Baton Rouge</span>
                            <div className="font-league-spartan text-[31px] leading-[37.2px] font-bold text-[#F7F7F7]">
                                <div>Baton Rouge Area</div>
                                <div>Gamblers Anonymous</div>
                            </div>
                        </Link>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="-m-2.5 rounded-md p-2.5 text-[#F7F7F7]"
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                {directLinks.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="font-helvetica text-base leading-6 font-normal text-[#F7F7F7] -mx-3 block rounded-lg px-3 py-2 hover:bg-gray-900 tracking-[1.1px]"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                {hamburgerLinks.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="font-helvetica text-base leading-6 font-normal text-[#F7F7F7] -mx-3 block rounded-lg px-3 py-2 hover:bg-gray-900 tracking-[1.1px]"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                            <div className="py-6">
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="font-helvetica text-base leading-6 font-normal text-[#F7F7F7] -mx-3 block rounded-lg px-3 py-2.5 hover:bg-gray-900 tracking-[1.1px]"
                                >
                                    Log in
                                </Link>
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    )
}
import React from 'react';

const Header = () => {
    return (
        <header className="bg-gray-800 text-white p-4">
            <h1 className="text-2xl">Baton Rouge GA</h1>
            <nav>
                <ul className="flex space-x-4">
                    <li><a href="/" className="hover:underline">Home</a></li>
                    <li><a href="/dashboard" className="hover:underline">Dashboard</a></li>
                    <li><a href="/login" className="hover:underline">Login</a></li>
                    <li><a href="/signup" className="hover:underline">Sign Up</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
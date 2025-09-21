import React from 'react';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">Welcome to Baton Rouge GA</h1>
            <p className="text-lg text-center mb-8">
                Your one-stop solution for all things Baton Rouge. Explore our features and get started!
            </p>
            <a href="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Login
            </a>
            <a href="/signup" className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Sign Up
            </a>
        </div>
    );
};

export default Home;
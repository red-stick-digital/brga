import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            {user ? (
                <div>
                    <p className="mt-4">Welcome, {user.email}!</p>
                    <button 
                        onClick={logout} 
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <p className="mt-4">Please log in to see your dashboard.</p>
            )}
        </div>
    );
};

export default Dashboard;
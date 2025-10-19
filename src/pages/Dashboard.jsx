import React from 'react';
import useAuth from '../hooks/useAuth';
import Button from '../components/common/Button';

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            {user ? (
                <div>
                    <p className="mt-4">Welcome, {user.email}!</p>
                    <Button onClick={logout} className="mt-4">
                        LOGOUT
                    </Button>
                </div>
            ) : (
                <p className="mt-4">Please log in to see your dashboard.</p>
            )}
        </div>
    );
};

export default Dashboard;
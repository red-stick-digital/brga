import React, { useState } from 'react';
import { setupInitialAdmin } from '../../utils/adminSetup';
import useAuth from '../../hooks/useAuth';
import Button from '../common/Button';

/**
 * AdminSetup Component
 * 
 * This component allows the initial setup of the admin user.
 * Should only be used once during initial setup.
 */
const AdminSetup = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { user } = useAuth();

    const handleSetupAdmin = async () => {
        if (!user) {
            setError('You must be logged in to set up admin role');
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        try {
            const result = await setupInitialAdmin(user.email);

            if (result.success) {
                setMessage(result.message);
                setError('');
            } else {
                setError(result.error || 'Failed to setup admin');
                setMessage('');
            }
        } catch (err) {
            setError('An unexpected error occurred');
            console.error('Setup error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Admin Setup</h2>
                    <p className="text-gray-600 mb-4">You must be logged in to access admin setup.</p>
                    <Button onClick={() => window.location.href = '/login'}>
                        Go to Login
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">Admin Setup</h2>

                <div className="mb-6">
                    <p className="text-gray-600 mb-2">Current User:</p>
                    <p className="font-semibold text-gray-800">{user.email}</p>
                </div>

                {message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="text-center">
                    <Button
                        onClick={handleSetupAdmin}
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? 'Setting up Admin...' : 'Setup as Admin'}
                    </Button>
                </div>

                <div className="mt-4 text-sm text-gray-500 text-center">
                    <p>This will grant full administrative access to this account.</p>
                    <p>Only use this during initial setup.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminSetup;
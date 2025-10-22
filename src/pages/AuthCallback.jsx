import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../services/supabase';

const AuthCallback = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                // Extract the auth tokens from the URL
                const { data, error } = await supabase.auth.getSession();

                if (error) {
                    console.error('Auth callback error:', error);
                    setError('Authentication failed. Please try logging in again.');
                    setLoading(false);
                    return;
                }

                if (data.session) {
                    // User is now confirmed and logged in
                    console.log('User confirmed and logged in:', data.session.user);
                    navigate('/dashboard');
                } else {
                    // No session found, redirect to login
                    navigate('/login');
                }
            } catch (err) {
                console.error('Unexpected error during auth callback:', err);
                setError('Something went wrong. Please try logging in again.');
            } finally {
                setLoading(false);
            }
        };

        handleAuthCallback();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <h2 className="font-league-spartan text-3xl font-bold text-[#6B92B0] mb-4">
                    Confirming your account...
                </h2>
                <p className="text-gray-600">Please wait while we verify your email.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <h2 className="font-league-spartan text-3xl font-bold text-red-600 mb-4">
                    Authentication Error
                </h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                    onClick={() => navigate('/login')}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Go to Login
                </button>
            </div>
        );
    }

    return null;
};

export default AuthCallback;
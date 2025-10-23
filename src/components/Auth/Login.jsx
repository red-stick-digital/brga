import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import supabase from '../../services/supabase';
import Button from '../common/Button';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [resetSent, setResetSent] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        // Check for success message from navigation state
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            // Clear the state to prevent showing the message on refresh
            navigate(location.pathname, { replace: true });
        }
    }, [location.state, navigate, location.pathname]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else if (data.user) {
            // Login successful - check approval status to determine redirect
            console.log('Login successful for user:', data.user.email);

            try {
                // Check user's approval status
                const { data: roleData, error: roleError } = await supabase
                    .from('user_roles')
                    .select('approval_status, role')
                    .eq('user_id', data.user.id)
                    .single();

                if (roleError) {
                    console.error('Error fetching user role:', roleError);
                    // Default to authhome if we can't fetch role
                    navigate('/authhome');
                } else if (roleData?.approval_status === 'pending') {
                    // Pending users go directly to profile
                    console.log('User has pending approval - redirecting to profile');
                    navigate('/member/profile');
                } else {
                    // Approved users go to auth home
                    navigate('/authhome');
                }
            } catch (err) {
                console.error('Error during post-login redirect:', err);
                // Default to authhome on error
                navigate('/authhome');
            }

            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setError('Please enter your email address first');
            return;
        }

        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            setError(error.message);
        } else {
            setResetSent(true);
        }

        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-start pt-16 min-h-[80vh]">
            <h1 className="font-league-spartan text-[56px] leading-[60px] font-bold text-[#6B92B0] mb-8">Login</h1>
            <div className="w-full max-w-sm">
                <form onSubmit={handleLogin} className="mb-6">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            <p>{error}</p>
                            {error.includes('Email not confirmed') && (
                                <p className="text-sm mt-2">
                                    If you're the admin setting up for the first time, you can use the{' '}
                                    <a href="/initial-setup" className="underline text-blue-600">
                                        initial setup page
                                    </a>{' '}
                                    to bypass email confirmation.
                                </p>
                            )}
                        </div>
                    )}
                    {resetSent && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            <p>Password reset email sent! Check your inbox for instructions.</p>
                        </div>
                    )}
                    {successMessage && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            <p>{successMessage}</p>
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? 'LOGGING IN...' : 'LOGIN'}
                        </Button>
                    </div>
                </form>

                {/* Action Links */}
                <div className="text-center space-y-4">
                    <button
                        onClick={handleForgotPassword}
                        disabled={loading}
                        className="text-[#6B92B0] hover:text-[#8BB7D1] underline text-sm disabled:opacity-50"
                    >
                        {loading ? 'Sending...' : 'Forgot Password?'}
                    </button>

                    <div className="border-t pt-4">
                        <p className="text-gray-600 text-sm mb-2">Don't have an account?</p>
                        <Link
                            to="/signup"
                            className="text-[#6B92B0] hover:text-[#8BB7D1] font-semibold underline"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../services/supabase';
import Button from '../common/Button';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isValidSession, setIsValidSession] = useState(null); // null = checking, true = valid, false = invalid

    useEffect(() => {
        let mounted = true;

        const checkRecoverySession = async () => {
            // FIRST: Check URL hash for password recovery tokens
            const urlParams = new URLSearchParams(window.location.hash.replace('#', ''));
            const accessToken = urlParams.get('access_token');
            const type = urlParams.get('type');

            console.log('🔐 Reset Password - Checking recovery session');
            console.log('🔐 URL hash parameters:', {
                hasAccessToken: !!accessToken,
                type,
                fullHash: window.location.hash
            });

            // If we have recovery tokens in URL, we're good
            if (type === 'recovery' && accessToken) {
                console.log('🔐 Valid recovery tokens in URL hash');
                if (mounted) setIsValidSession(true);
                return;
            }

            // SECOND: Check if we have an active session (user just got redirected from Supabase)
            try {
                const { data: { session }, error } = await supabase.auth.getSession();

                console.log('🔐 Current session check:', {
                    hasSession: !!session,
                    hasUser: !!session?.user,
                    error: error?.message
                });

                if (session?.user) {
                    // We have a session - this means the user came from the magic link
                    // and Supabase already authenticated them
                    console.log('🔐 Active session found - user authenticated via magic link');
                    if (mounted) setIsValidSession(true);
                } else {
                    // No session and no recovery tokens
                    console.log('🔐 No valid session or recovery tokens found');
                    if (mounted) setIsValidSession(false);
                }
            } catch (err) {
                console.error('🔐 Error checking session:', err);
                if (mounted) setIsValidSession(false);
            }
        };

        checkRecoverySession();

        // THIRD: Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('🔐 Auth state change:', event);

            if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
                console.log('🔐 Password recovery event detected');
                if (mounted) setIsValidSession(true);
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [navigate]); const handleResetPassword = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        try {
            // CRITICAL: Extract recovery tokens from URL hash
            const urlParams = new URLSearchParams(window.location.hash.replace('#', ''));
            const accessToken = urlParams.get('access_token');
            const refreshToken = urlParams.get('refresh_token');

            console.log('🔐 Attempting to update password...');
            console.log('🔐 Setting session from recovery tokens...');

            // If we have recovery tokens, set the session explicitly
            if (accessToken && refreshToken) {
                const { data, error: sessionError } = await supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: refreshToken
                });

                if (sessionError) {
                    console.error('❌ Failed to set session:', sessionError);
                    setError('Failed to authenticate. Please request a new reset link.');
                    setLoading(false);
                    return;
                }

                console.log('✅ Session established successfully');
            }

            // Now update the password with an active session
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) {
                console.error('❌ Password update failed:', error);
                setError(error.message);
                setLoading(false);
            } else {
            console.log('✅ Password updated successfully');
            console.log('🔐 Signing out recovery session and redirecting to login');

            // CRITICAL: Sign out the recovery session to prevent automatic login
            await supabase.auth.signOut({ scope: 'global' });

            // Clear any residual auth tokens from storage
            const storageKeys = Object.keys(localStorage);
            storageKeys.forEach(key => {
                if (key.includes('supabase') || key.includes('auth')) {
                    localStorage.removeItem(key);
                }
            });

            // Password updated successfully, redirect to login
            navigate('/login', {
                state: { message: 'Password updated successfully! Please log in with your new password.' }
            });

            setLoading(false);
            }
        } catch (err) {
            console.error('❌ Unexpected error during password reset:', err);
            setError('An unexpected error occurred. Please try again.');
            setLoading(false);
        }
    };

    if (isValidSession === null) {
        // Still checking
        return (
            <div className="flex flex-col items-center justify-start pt-16 min-h-[80vh]">
                <h1 className="font-league-spartan text-[56px] leading-[60px] font-bold text-[#6B92B0] mb-8">Reset Password</h1>
                <div className="w-full max-w-sm text-center">
                    <p className="text-gray-600 mb-4">
                        Verifying your reset link...
                    </p>
                </div>
            </div>
        );
    }

    if (isValidSession === false) {
        return (
            <div className="flex flex-col items-center justify-start pt-16 min-h-[80vh]">
                <h1 className="font-league-spartan text-[56px] leading-[60px] font-bold text-[#6B92B0] mb-8">Reset Password</h1>
                <div className="w-full max-w-sm text-center">
                    <p className="text-gray-600 mb-4">
                        Invalid or expired reset link. Please request a new password reset from the login page.
                    </p>
                    <Button
                        onClick={() => navigate('/login')}
                        className="w-full"
                    >
                        Back to Login
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-start pt-16 min-h-[80vh]">
            <h1 className="font-league-spartan text-[56px] leading-[60px] font-bold text-[#6B92B0] mb-8">Reset Password</h1>
            <div className="w-full max-w-sm">
                <form onSubmit={handleResetPassword} className="mb-6">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="mb-6">
                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? 'UPDATING PASSWORD...' : 'UPDATE PASSWORD'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
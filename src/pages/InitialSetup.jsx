import React, { useState } from 'react';
import supabase from '../services/supabase';
import Button from '../components/common/Button';
import { getEmailConfirmationInstructions } from '../utils/adminSetup';

/**
 * Initial Setup Page
 * 
 * This page allows for initial admin setup without requiring email confirmation.
 * Should only be accessible during initial deployment.
 */
const InitialSetup = () => {
    const [email, setEmail] = useState('marsh11272@yahoo.com');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [step, setStep] = useState(1); // 1: Check user, 2: Set role

    const handleCheckUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            // Try to sign in to get the user ID
            const { data, error: loginError } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (loginError && loginError.message.includes('Email not confirmed')) {
                // User exists but email not confirmed - this is expected
                setMessage('User found but email not confirmed. Proceeding to set up admin role...');
                setStep(2);
            } else if (loginError) {
                setError(`Login error: ${loginError.message}`);
            } else if (data.user) {
                setMessage('User logged in successfully! Setting up admin role...');
                await setupAdminRole(data.user.id);
            }
        } catch (error) {
            setError(`Unexpected error: ${error.message}`);
        }

        setLoading(false);
    };

    const setupAdminRole = async (userId) => {
        try {
            // First check if role already exists
            const { data: existingRole, error: fetchError } = await supabase
                .from('user_roles')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (existingRole) {
                // Update existing role to admin
                const { error: updateError } = await supabase
                    .from('user_roles')
                    .update({ role: 'admin' })
                    .eq('user_id', userId);

                if (updateError) {
                    setError(`Role update error: ${updateError.message}`);
                    return;
                }
            } else {
                // Insert new admin role
                const { error: insertError } = await supabase
                    .from('user_roles')
                    .insert({
                        user_id: userId,
                        role: 'admin'
                    });

                if (insertError) {
                    setError(`Role insert error: ${insertError.message}`);
                    return;
                }
            }

            // Show email confirmation instructions
            const instructions = getEmailConfirmationInstructions(email);
            setMessage('Admin role set up successfully! Please confirm your email in Supabase dashboard to complete setup.');
            setStep(3);
        } catch (error) {
            setError(`Role setup error: ${error.message}`);
        }
    };

    const handleManualSetup = async () => {
        setLoading(true);
        setError('');
        setMessage('');

        try {
            // Get all users with the specified email (for manual setup)
            const { data: users, error: userError } = await supabase
                .from('auth.users')
                .select('id')
                .eq('email', email);

            if (userError) {
                setError(`Error finding user: ${userError.message}`);
                setLoading(false);
                return;
            }

            if (users && users.length > 0) {
                await setupAdminRole(users[0].id);
            } else {
                setError('User not found. Please make sure you have signed up first.');
            }
        } catch (error) {
            setError(`Manual setup error: ${error.message}`);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">Initial Admin Setup</h2>

                {step === 1 && (
                    <>
                        <p className="text-gray-600 mb-4">
                            This page is for initial admin setup. Enter your credentials to set up admin access.
                        </p>

                        <form onSubmit={handleCheckUser}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>

                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? 'Setting Up...' : 'Setup Admin'}
                            </Button>
                        </form>
                    </>
                )}

                {step === 2 && (
                    <>
                        <p className="text-gray-600 mb-4">
                            Email confirmation is required but we can bypass this for admin setup.
                        </p>

                        <Button
                            onClick={handleManualSetup}
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? 'Setting Up Admin Role...' : 'Setup Admin Role Manually'}
                        </Button>
                    </>
                )}

                {step === 3 && (
                    <>
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            <div className="font-bold">✓ Admin Role Setup Complete!</div>
                        </div>
                        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4">
                            <div className="font-bold">⚠️ Email Confirmation Required</div>
                            <p className="text-sm mt-2">
                                To complete the setup and enable login, please confirm your email in the Supabase dashboard:
                            </p>
                            <ol className="text-sm mt-2 ml-4 list-decimal">
                                <li>Go to your Supabase project dashboard</li>
                                <li>Navigate to Authentication → Users</li>
                                <li>Find user: {email}</li>
                                <li>Click the user row and toggle "Email Confirmed" to ON</li>
                                <li>Return here and try normal login</li>
                            </ol>
                        </div>
                        <p className="text-gray-600 mb-4 text-center">
                            After confirming your email in Supabase, you can use the normal login process.
                        </p>
                        <Button
                            onClick={() => window.location.href = '/login'}
                            className="w-full"
                        >
                            Go to Login
                        </Button>
                    </>
                )}

                {message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
                        {error}
                    </div>
                )}

                <div className="mt-4 text-xs text-gray-500 text-center">
                    <p>This page should only be used during initial setup.</p>
                    <p>Remove this route after admin setup is complete.</p>
                </div>
            </div>
        </div>
    );
};

export default InitialSetup;
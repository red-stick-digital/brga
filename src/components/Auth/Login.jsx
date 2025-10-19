import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../services/supabase';
import Button from '../common/Button';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

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
        } else if (data.user) {
            // Login successful - redirect to home page or admin dashboard
            console.log('Login successful for user:', data.user.email);
            navigate('/');
        }

        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            <form onSubmit={handleLogin} className="w-full max-w-sm">
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
                <div className="mb-6">
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
                <Button type="submit" disabled={loading}>
                    {loading ? 'LOGGING IN...' : 'LOGIN'}
                </Button>
            </form>
        </div>
    );
};

export default Login;
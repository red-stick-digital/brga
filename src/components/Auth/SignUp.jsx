import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import useApprovalCode from '../../hooks/useApprovalCode';
import Button from '../common/Button';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [approvalCode, setApprovalCode] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isValidating, setIsValidating] = useState(false);

    const { signup } = useAuth();
    const { validateCode, loading: codeLoading } = useApprovalCode();

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsValidating(true);

        // First validate the approval code
        const codeValidation = await validateCode(approvalCode);

        if (!codeValidation.valid) {
            setError(codeValidation.error);
            setIsValidating(false);
            return;
        }

        // If code is valid, proceed with signup
        const { user, error: signupError } = await signup(email, password, approvalCode);

        if (signupError) {
            setError(signupError.message);
        } else {
            setSuccess('Sign up successful! Your account is pending approval. Please check your email for confirmation.');
        }

        setIsValidating(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="font-league-spartan text-[56px] leading-[60px] font-bold text-[#6B92B0] mb-4">Sign Up</h2>
            <form onSubmit={handleSignUp} className="w-full max-w-sm">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="approvalCode">
                        Approval Code
                    </label>
                    <input
                        type="text"
                        id="approvalCode"
                        value={approvalCode}
                        onChange={(e) => setApprovalCode(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="word-word-word (e.g., fish-taco-burrito)"
                        required
                    />
                    <p className="text-gray-600 text-xs mt-1">
                        Enter the three-word approval code provided by an admin
                    </p>
                </div>
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
                {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                {success && <p className="text-green-500 text-xs italic mb-4">{success}</p>}
                <Button type="submit" disabled={isValidating || codeLoading}>
                    {isValidating ? 'VALIDATING...' : 'SIGN UP'}
                </Button>
            </form>
        </div>
    );
};

export default SignUp;
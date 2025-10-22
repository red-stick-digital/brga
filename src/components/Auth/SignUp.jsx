import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
    const [showCodeDialog, setShowCodeDialog] = useState(false);
    const [pendingSubmission, setPendingSubmission] = useState(null);

    const { signup } = useAuth();
    const { validateCode, loading: codeLoading } = useApprovalCode();

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // If no approval code is provided, show dialog to confirm
        if (!approvalCode.trim()) {
            setPendingSubmission({ email, password });
            setShowCodeDialog(true);
            return;
        }

        // If approval code is provided, validate it first
        await processSignup(email, password, approvalCode);
    };

    const processSignup = async (userEmail, userPassword, userApprovalCode = '') => {
        setIsValidating(true);

        // If approval code is provided, validate it
        if (userApprovalCode.trim()) {
            const codeValidation = await validateCode(userApprovalCode);
            if (!codeValidation.valid) {
                setError(codeValidation.error);
                setIsValidating(false);
                return;
            }
        }

        // Proceed with signup (with or without approval code)
        const { user, error: signupError } = await signup(userEmail, userPassword, userApprovalCode);

        if (signupError) {
            setError(signupError.message);
        } else {
            const message = userApprovalCode.trim()
                ? 'Sign up successful! Your account has been approved. Please check your email to confirm your address.'
                : 'Sign up successful! Your account is pending admin approval. Please check your email to confirm your address.';
            setSuccess(message);
        }

        setIsValidating(false);
    };

    const handleDialogContinue = () => {
        setShowCodeDialog(false);
        if (pendingSubmission) {
            processSignup(pendingSubmission.email, pendingSubmission.password, '');
            setPendingSubmission(null);
        }
    };

    const handleDialogCancel = () => {
        setShowCodeDialog(false);
        setPendingSubmission(null);
    };

    return (
        <div className="flex flex-col items-center justify-start pt-16 min-h-[80vh]">
            <h2 className="font-league-spartan text-[56px] leading-[60px] font-bold text-[#6B92B0] mb-8">Sign Up</h2>
            <div className="w-full max-w-sm">
                <form onSubmit={handleSignUp} className="mb-6">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="approvalCode">
                            Approval Code <span className="font-normal text-gray-600">(Optional)</span>
                        </label>
                        <input
                            type="text"
                            id="approvalCode"
                            value={approvalCode}
                            onChange={(e) => setApprovalCode(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="word-word-word (e.g., fish-taco-burrito)"
                        />
                        <p className="text-gray-600 text-xs mt-1">
                            Enter the three-word approval code if provided by an admin. You can still sign up without one.
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
                    {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                    {success && <p className="text-green-500 text-xs italic mb-4">{success}</p>}
                    <div className="mb-6">
                        <Button type="submit" disabled={isValidating || codeLoading} className="w-full">
                            {isValidating ? 'VALIDATING...' : 'SIGN UP'}
                        </Button>
                    </div>
                </form>

                {/* Action Links */}
                <div className="text-center">
                    <div className="border-t pt-4">
                        <p className="text-gray-600 text-sm mb-2">Already have an account?</p>
                        <Link
                            to="/login"
                            className="text-[#6B92B0] hover:text-[#8BB7D1] font-semibold underline"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </div>

            {/* Approval Code Reminder Dialog */}
            {showCodeDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            No Approval Code Entered
                        </h3>
                        <p className="text-gray-600 mb-6">
                            You haven't entered an approval code. You can still sign up, but your account will be pending approval until an admin reviews your request.
                        </p>
                        <p className="text-gray-600 mb-6">
                            If you have an approval code from an admin, you can go back and enter it to speed up the approval process.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                onClick={handleDialogCancel}
                                className="flex-1 bg-gray-500 hover:bg-gray-600"
                            >
                                Go Back
                            </Button>
                            <Button
                                onClick={handleDialogContinue}
                                className="flex-1"
                            >
                                Continue Without Code
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignUp;
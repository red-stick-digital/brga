import React, { useState } from 'react';
import { XMarkIcon, KeyIcon } from '@heroicons/react/24/outline';
import useUserManagement from '../../hooks/useUserManagement';

const ResetPasswordModal = ({ member, onClose, onSuccess }) => {
    const { requestPasswordReset } = useUserManagement();
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');

    const handleResetPassword = async () => {
        setSending(true);
        setError('');

        try {
            const result = await requestPasswordReset(member.email);

            if (result.success) {
                onSuccess();
            } else {
                setError(result.error || 'Failed to send password reset email');
            }
        } catch (err) {
            setError('Failed to send password reset email. Please try again.');
        } finally {
            setSending(false);
        }
    };

    if (!member) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <KeyIcon className="h-6 w-6 mr-2 text-green-600" />
                            Reset Password
                        </h3>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 p-1"
                            disabled={sending}
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-4">
                    {/* Error Display */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {/* Member Information */}
                    <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-800 mb-2">Member Details:</h4>
                        <div className="bg-gray-50 p-3 rounded-md">
                            <div className="text-sm text-gray-700">
                                <div><strong>Name:</strong> {member.profile?.full_name || 'No name provided'}</div>
                                <div><strong>Email:</strong> {member.email}</div>
                            </div>
                        </div>
                    </div>

                    {/* Confirmation Message */}
                    <div className="mb-6">
                        <p className="text-sm text-gray-700">
                            A password reset email will be sent to <strong>{member.email}</strong>.
                            The member will receive instructions on how to create a new password.
                        </p>
                    </div>

                    {/* Important Notice */}
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-6">
                        <div className="text-sm text-amber-800">
                            <strong>Important:</strong> The reset link will expire after 24 hours. Make sure to
                            inform the member to check their email (including spam folder) and complete
                            the reset process promptly.
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        disabled={sending}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleResetPassword}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        disabled={sending}
                    >
                        {sending ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Sending...
                            </>
                        ) : (
                            <>
                                <KeyIcon className="h-4 w-4 mr-2" />
                                Send Reset Email
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordModal;
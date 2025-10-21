import React, { useState } from 'react';
import { XMarkIcon, TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import useUserManagement from '../../hooks/useUserManagement';

const SuperAdminDeleteModal = ({ member, onClose, onSuccess }) => {
    const { approveMemberDeletion } = useUserManagement();
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');

    const handleDeleteMember = async () => {
        setDeleting(true);
        setError('');

        try {
            const result = await approveMemberDeletion(member.user_id);

            if (result.success) {
                onSuccess();
            } else {
                setError(result.error || 'Failed to delete member');
            }
        } catch (err) {
            setError('Failed to delete member. Please try again.');
        } finally {
            setDeleting(false);
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
                            <TrashIcon className="h-6 w-6 mr-2 text-red-600" />
                            Delete Member
                        </h3>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 p-1"
                            disabled={deleting}
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

                    {/* Warning Notice */}
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                            </div>
                            <div className="ml-3">
                                <h4 className="text-sm font-medium text-red-800">
                                    Permanent Deletion Warning
                                </h4>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>
                                        <strong>This action cannot be undone.</strong> The member's account will be
                                        permanently disabled and marked as deleted. They will lose access to
                                        their account and all associated data.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Member Information */}
                    <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-800 mb-2">Member to Delete:</h4>
                        <div className="bg-gray-50 p-3 rounded-md">
                            <div className="text-sm text-gray-700">
                                <div><strong>Name:</strong> {member.profile?.full_name || 'No name provided'}</div>
                                <div><strong>Email:</strong> {member.email}</div>
                                <div><strong>Status:</strong> {member.approval_status}</div>
                                <div><strong>Home Group:</strong> {member.profile?.home_group?.name || 'None'}</div>
                                {member.profile?.phone && (
                                    <div><strong>Phone:</strong> {member.profile.phone}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Confirmation Text */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-6">
                        <div className="text-sm text-yellow-800">
                            <p className="font-medium">Please confirm:</p>
                            <p className="mt-1">
                                Are you sure you want to permanently delete this member?
                                This will immediately disable their account and cannot be reversed.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        disabled={deleting}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleDeleteMember}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        disabled={deleting}
                    >
                        {deleting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Deleting...
                            </>
                        ) : (
                            <>
                                <TrashIcon className="h-4 w-4 mr-2" />
                                Delete Member
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDeleteModal;
import React, { useState } from 'react';
import {
    CheckIcon,
    XMarkIcon,
    TrashIcon,
    ExclamationTriangleIcon,
    EyeIcon
} from '@heroicons/react/24/outline';
import useUserManagement from '../../hooks/useUserManagement';

const PendingDeletionsList = ({ members, loading }) => {
    const { approveMemberDeletion, rejectMemberDeletion } = useUserManagement();
    const [selectedMember, setSelectedMember] = useState(null);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');

    const handleViewDetails = (member) => {
        setSelectedMember(member);
        setShowDetailsModal(true);
    };

    const handleApprove = (member) => {
        setSelectedMember(member);
        setShowApproveModal(true);
    };

    const handleReject = (member) => {
        setSelectedMember(member);
        setShowRejectModal(true);
        setRejectionReason('');
    };

    const confirmApprove = async () => {
        if (!selectedMember) return;

        setActionLoading(true);
        setError('');

        try {
            const result = await approveMemberDeletion(selectedMember.user_id);

            if (result.success) {
                setShowApproveModal(false);
                setSelectedMember(null);
            } else {
                setError(result.error || 'Failed to approve deletion');
            }
        } catch (err) {
            setError('Failed to approve deletion. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const confirmReject = async () => {
        if (!selectedMember || !rejectionReason.trim()) {
            setError('Please provide a reason for rejection');
            return;
        }

        setActionLoading(true);
        setError('');

        try {
            const result = await rejectMemberDeletion(selectedMember.user_id, rejectionReason.trim());

            if (result.success) {
                setShowRejectModal(false);
                setSelectedMember(null);
                setRejectionReason('');
            } else {
                setError(result.error || 'Failed to reject deletion request');
            }
        } catch (err) {
            setError('Failed to reject deletion request. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="animate-pulse space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded"></div>
                ))}
            </div>
        );
    }

    if (members.length === 0) {
        return (
            <div className="text-center py-12">
                <TrashIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Deletions</h3>
                <p className="text-gray-500">
                    There are no member deletion requests awaiting your approval.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <ExclamationTriangleIcon className="h-5 w-5 text-amber-600" />
                        </div>
                        <div className="ml-3">
                            <h4 className="text-sm font-medium text-amber-800">
                                Superadmin Review Required
                            </h4>
                            <div className="mt-1 text-sm text-amber-700">
                                The following members have been requested for deletion by admins.
                                Review each request carefully before approving or rejecting.
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {members.map((member) => (
                        <div key={member.user_id} className="bg-white border border-red-200 rounded-lg p-6">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center mb-3">
                                        <div>
                                            <h4 className="text-lg font-medium text-gray-800">
                                                {member.profile?.full_name || 'No name provided'}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                {member.email}
                                            </p>
                                        </div>
                                        <span className="ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            Pending Deletion
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Requested By:</span>
                                            <p className="text-sm text-gray-800">
                                                {member.deletion_requested_by || 'Unknown'}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Requested Date:</span>
                                            <p className="text-sm text-gray-800">
                                                {formatDate(member.deletion_requested_at)}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Home Group:</span>
                                            <p className="text-sm text-gray-800">
                                                {member.profile?.home_group?.name || 'None'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Deletion Reason */}
                                    {member.notes && (
                                        <div className="mb-4">
                                            <span className="text-sm font-medium text-gray-500">Deletion Reason:</span>
                                            <div className="mt-1 text-sm text-gray-800 bg-gray-50 p-2 rounded border">
                                                {member.notes}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => handleViewDetails(member)}
                                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center"
                                        title="View member details"
                                    >
                                        <EyeIcon className="h-4 w-4 mr-1" />
                                        Details
                                    </button>
                                    <button
                                        onClick={() => handleApprove(member)}
                                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
                                        title="Approve deletion"
                                    >
                                        <CheckIcon className="h-4 w-4 mr-1" />
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(member)}
                                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
                                        title="Reject deletion request"
                                    >
                                        <XMarkIcon className="h-4 w-4 mr-1" />
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Member Details Modal */}
            {showDetailsModal && selectedMember && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Member Details</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-medium text-gray-700 mb-3">Account Information</h4>
                                <div className="space-y-2 text-sm">
                                    <div><strong>Name:</strong> {selectedMember.profile?.full_name || 'Not provided'}</div>
                                    <div><strong>Email:</strong> {selectedMember.email}</div>
                                    <div><strong>Phone:</strong> {selectedMember.profile?.phone || 'Not provided'}</div>
                                    <div><strong>Status:</strong> {selectedMember.approval_status}</div>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-700 mb-3">Member Information</h4>
                                <div className="space-y-2 text-sm">
                                    <div><strong>Home Group:</strong> {selectedMember.profile?.home_group?.name || 'None'}</div>
                                    <div><strong>Clean Date:</strong> {formatDate(selectedMember.profile?.clean_date)}</div>
                                    <div><strong>Directory Listed:</strong> {selectedMember.profile?.listed_in_directory ? 'Yes' : 'No'}</div>
                                    <div><strong>Willing to Sponsor:</strong> {selectedMember.profile?.willing_to_sponsor ? 'Yes' : 'No'}</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h4 className="font-medium text-gray-700 mb-2">Deletion Request Details</h4>
                            <div className="bg-red-50 p-3 rounded border text-sm">
                                <div className="mb-2"><strong>Requested by:</strong> {selectedMember.deletion_requested_by}</div>
                                <div className="mb-2"><strong>Requested on:</strong> {formatDate(selectedMember.deletion_requested_at)}</div>
                                <div><strong>Reason:</strong></div>
                                <div className="mt-1 text-gray-700">{selectedMember.notes || 'No reason provided'}</div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    setShowDetailsModal(false);
                                    handleApprove(selectedMember);
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Approve Deletion
                            </button>
                            <button
                                onClick={() => {
                                    setShowDetailsModal(false);
                                    handleReject(selectedMember);
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Reject Request
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Approve Deletion Modal */}
            {showApproveModal && selectedMember && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center">
                            <TrashIcon className="h-6 w-6 mr-2" />
                            Confirm Deletion
                        </h3>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                                {error}
                            </div>
                        )}

                        <div className="mb-6">
                            <p className="text-gray-700">
                                Are you sure you want to <strong>permanently delete</strong> this member account?
                            </p>
                            <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
                                <div><strong>Member:</strong> {selectedMember.profile?.full_name || selectedMember.email}</div>
                                <div><strong>Email:</strong> {selectedMember.email}</div>
                            </div>
                            <div className="mt-3 text-sm text-red-600">
                                <strong>Warning:</strong> This action cannot be undone. The member's account and data will be permanently deleted.
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowApproveModal(false);
                                    setError('');
                                }}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                                disabled={actionLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmApprove}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={actionLoading}
                            >
                                {actionLoading ? 'Deleting...' : 'Delete Member'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Request Modal */}
            {showRejectModal && selectedMember && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
                            <XMarkIcon className="h-6 w-6 mr-2" />
                            Reject Deletion Request
                        </h3>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                                {error}
                            </div>
                        )}

                        <div className="mb-4">
                            <p className="text-gray-700 mb-3">
                                Rejecting this deletion request will restore the member to active status.
                            </p>
                            <div className="p-3 bg-gray-50 rounded text-sm">
                                <div><strong>Member:</strong> {selectedMember.profile?.full_name || selectedMember.email}</div>
                                <div><strong>Email:</strong> {selectedMember.email}</div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="rejection_reason" className="block text-sm font-medium text-gray-700 mb-2">
                                Reason for Rejection *
                            </label>
                            <textarea
                                id="rejection_reason"
                                value={rejectionReason}
                                onChange={(e) => {
                                    setRejectionReason(e.target.value);
                                    if (error) setError('');
                                }}
                                rows={3}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                placeholder="Explain why this deletion request is being rejected..."
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectionReason('');
                                    setError('');
                                }}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                                disabled={actionLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmReject}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={actionLoading || !rejectionReason.trim()}
                            >
                                {actionLoading ? 'Rejecting...' : 'Reject Request'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PendingDeletionsList;
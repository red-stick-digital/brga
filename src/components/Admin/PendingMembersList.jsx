import React, { useState, useEffect } from 'react';
import useApprovals from '../../hooks/useApprovals';
import { formatMemberName } from '../../utils/nameUtils';

const PendingMembersList = () => {
    const {
        pendingMembers,
        loading,
        error,
        fetchPendingMembers,
        approveMember,
        rejectMember
    } = useApprovals();

    const [selectedMember, setSelectedMember] = useState(null);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [approvalNotes, setApprovalNotes] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    // Load pending members on component mount
    useEffect(() => {
        fetchPendingMembers();
    }, []);

    const handleViewMember = (member) => {
        setSelectedMember(member);
    };

    const handleApprove = (member) => {
        setSelectedMember(member);
        setShowApproveModal(true);
        setApprovalNotes('');
    };

    const handleReject = (member) => {
        setSelectedMember(member);
        setShowRejectModal(true);
        setRejectionReason('');
    };

    const confirmApprove = async () => {
        if (!selectedMember) return;

        setActionLoading(true);
        const result = await approveMember(selectedMember.user_id, approvalNotes);

        if (result.success) {
            setShowApproveModal(false);
            setSelectedMember(null);
            setApprovalNotes('');
        }
        setActionLoading(false);
    };

    const confirmReject = async () => {
        if (!selectedMember || !rejectionReason.trim()) return;

        setActionLoading(true);
        const result = await rejectMember(selectedMember.user_id, rejectionReason);

        if (result.success) {
            setShowRejectModal(false);
            setSelectedMember(null);
            setRejectionReason('');
        }
        setActionLoading(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const calculateSobrietyTime = (cleanDate) => {
        if (!cleanDate) return '-';

        const clean = new Date(cleanDate);
        const now = new Date();
        const diffTime = Math.abs(now - clean);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 30) {
            return `${diffDays} days`;
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return `${months} month${months !== 1 ? 's' : ''}`;
        } else {
            const years = Math.floor(diffDays / 365);
            const remainingMonths = Math.floor((diffDays % 365) / 30);
            if (remainingMonths === 0) {
                return `${years} year${years !== 1 ? 's' : ''}`;
            } else {
                return `${years} year${years !== 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
            }
        }
    };

    if (loading && pendingMembers.length === 0) {
        return (
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white shadow-md rounded-lg">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Pending Member Approvals ({pendingMembers.length})
                    </h3>
                </div>

                {error && (
                    <div className="p-4 bg-red-100 border border-red-400 text-red-700">
                        {error}
                    </div>
                )}

                {pendingMembers.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        No pending member approvals.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {pendingMembers.map((member) => (
                            <div key={member.user_id} className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div>
                                                <h4 className="text-lg font-medium text-gray-800">
                                                    {formatMemberName(member.profile) || 'Name not provided'}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    {member.user?.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Phone:</span>
                                                <p className="text-sm text-gray-800">
                                                    {member.profile?.phone || 'Not provided'}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Clean Date:</span>
                                                <p className="text-sm text-gray-800">
                                                    {formatDate(member.profile?.clean_date)}
                                                    {member.profile?.clean_date && (
                                                        <span className="block text-xs text-gray-500">
                                                            {calculateSobrietyTime(member.profile.clean_date)}
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Home Group:</span>
                                                <p className="text-sm text-gray-800">
                                                    {member.profile?.home_group?.name || 'Not selected'}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Applied:</span>
                                                <p className="text-sm text-gray-800">
                                                    {formatDate(member.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 ml-4">
                                        <button
                                            onClick={() => handleViewMember(member)}
                                            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                                        >
                                            View Details
                                        </button>
                                        <button
                                            onClick={() => handleApprove(member)}
                                            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(member)}
                                            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Member Details Modal */}
            {selectedMember && !showApproveModal && !showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Member Details</h3>

                        <div className="space-y-3">
                            <div>
                                <span className="font-medium text-gray-700">Name:</span>
                                <p className="text-gray-600">{formatMemberName(selectedMember.profile || {})}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Email:</span>
                                <p className="text-gray-600">{selectedMember.user?.email}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Phone:</span>
                                <p className="text-gray-600">{selectedMember.profile?.phone || 'Not provided'}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Clean Date:</span>
                                <p className="text-gray-600">
                                    {formatDate(selectedMember.profile?.clean_date)}
                                    {selectedMember.profile?.clean_date && (
                                        <span className="block text-sm text-gray-500">
                                            ({calculateSobrietyTime(selectedMember.profile.clean_date)} sober)
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Home Group:</span>
                                <p className="text-gray-600">
                                    {selectedMember.profile?.home_group?.name || 'Not selected'}
                                    {selectedMember.profile?.home_group?.start_time && (
                                        <span className="block text-sm text-gray-500">
                                            Meets at {selectedMember.profile.home_group.start_time}
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Applied:</span>
                                <p className="text-gray-600">{formatDate(selectedMember.created_at)}</p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setSelectedMember(null)}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => handleApprove(selectedMember)}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => handleReject(selectedMember)}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Approval Modal */}
            {showApproveModal && selectedMember && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Approve Member: {formatMemberName(selectedMember.profile || {})}
                        </h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notes (Optional)
                            </label>
                            <textarea
                                value={approvalNotes}
                                onChange={(e) => setApprovalNotes(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="3"
                                placeholder="Add any notes about this approval..."
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowApproveModal(false);
                                    setSelectedMember(null);
                                }}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmApprove}
                                disabled={actionLoading}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                            >
                                {actionLoading ? 'Approving...' : 'Approve Member'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Rejection Modal */}
            {showRejectModal && selectedMember && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Reject Member: {formatMemberName(selectedMember.profile || {})}
                        </h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reason for Rejection <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="3"
                                placeholder="Please provide a reason for rejection..."
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setSelectedMember(null);
                                }}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmReject}
                                disabled={actionLoading || !rejectionReason.trim()}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                            >
                                {actionLoading ? 'Rejecting...' : 'Reject Member'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PendingMembersList;
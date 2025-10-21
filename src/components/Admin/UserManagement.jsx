import React, { useState } from 'react';
import { UserPlusIcon, UsersIcon } from '@heroicons/react/24/outline';
import useUserManagement from '../../hooks/useUserManagement';
import useAuth from '../../hooks/useAuth';
import useUserRole from '../../hooks/useUserRole';
import MembersList from './MembersList';
import AddMemberForm from './AddMemberForm';
import PendingDeletionsList from './PendingDeletionsList';

const UserManagement = () => {
    const { user } = useAuth();
    const { isSuperAdmin, loading: roleLoading } = useUserRole();
    const { members, loading, error, getPendingDeletionsCount, fetchAllMembers } = useUserManagement();
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [activeView, setActiveView] = useState('all'); // 'all', 'deletions'
    const [refreshing, setRefreshing] = useState(false);

    const pendingDeletionsCount = getPendingDeletionsCount();

    const handleMemberDeleted = async () => {
        setRefreshing(true);
        // Delay slightly to allow database to update
        await new Promise(resolve => setTimeout(resolve, 500));
        // Refresh the entire members list
        await fetchAllMembers();
        setRefreshing(false);
    };

    if (loading && members.length === 0) {
        return (
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-md rounded-lg">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <UsersIcon className="h-6 w-6 mr-2 text-blue-600" />
                            User Management
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage member accounts, profiles, and permissions
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAddMemberModal(true)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                    >
                        <UserPlusIcon className="h-5 w-5 mr-2" />
                        Add New Member
                    </button>
                </div>

                {/* View Toggle Tabs */}
                <div className="mt-4 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setActiveView('all')}
                            className={`${activeView === 'all'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                        >
                            All Members
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {members.filter(m => m.approval_status !== 'pending_deletion' && m.approval_status !== 'deleted').length}
                            </span>
                        </button>

                        {isSuperAdmin() && (
                            <button
                                onClick={() => setActiveView('deletions')}
                                className={`${activeView === 'deletions'
                                    ? 'border-red-500 text-red-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                            >
                                Pending Deletions
                                {pendingDeletionsCount > 0 && (
                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        {pendingDeletionsCount}
                                    </span>
                                )}
                            </button>
                        )}
                    </nav>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700">
                    {error}
                </div>
            )}

            {/* Content Area */}
            <div className="p-6">
                {activeView === 'all' ? (
                    <MembersList
                        members={members.filter(m => m.approval_status !== 'pending_deletion' && m.approval_status !== 'deleted')}
                        loading={loading || refreshing}
                        onMemberDeleted={handleMemberDeleted}
                    />
                ) : (
                    isSuperAdmin() && (
                        <PendingDeletionsList
                            members={members.filter(m => m.approval_status === 'pending_deletion')}
                            loading={loading || refreshing}
                        />
                    )
                )}
            </div>

            {/* Add Member Modal */}
            {showAddMemberModal && (
                <AddMemberForm
                    onClose={() => setShowAddMemberModal(false)}
                    onSuccess={() => {
                        setShowAddMemberModal(false);
                        // Members list will be updated automatically by the hook
                    }}
                />
            )}
        </div>
    );
};

export default UserManagement;
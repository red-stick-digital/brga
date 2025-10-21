import React, { useState } from 'react';
import {
    PencilIcon,
    KeyIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    CheckIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import useUserManagement from '../../hooks/useUserManagement';
import useAuth from '../../hooks/useAuth';
import useUserRole from '../../hooks/useUserRole';
import EditMemberPanel from './EditMemberPanel';
import ResetPasswordModal from './ResetPasswordModal';
import DeleteMemberRequestModal from './DeleteMemberRequestModal';
import SuperAdminDeleteModal from './SuperAdminDeleteModal';

const MembersList = ({ members, loading, onMemberDeleted }) => {
    const { user } = useAuth();
    const { isSuperAdmin, loading: roleLoading } = useUserRole();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name'); // 'name', 'email', 'created_at', 'status'
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'

    // Modal states
    const [selectedMember, setSelectedMember] = useState(null);
    const [showEditPanel, setShowEditPanel] = useState(false);
    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
    const [showDeleteRequestModal, setShowDeleteRequestModal] = useState(false);
    const [showSuperAdminDeleteModal, setShowSuperAdminDeleteModal] = useState(false);
    const [localMembers, setLocalMembers] = useState([]);

    // Sync local state with passed members
    React.useEffect(() => {
        setLocalMembers(members);
    }, [members]);

    // Filter and sort members
    const filteredAndSortedMembers = React.useMemo(() => {
        // Use localMembers for rendering so deletions update immediately
        let filtered = localMembers;

        // Apply search filter
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = localMembers.filter(member =>
                (member.profile?.full_name || '').toLowerCase().includes(term) ||
                (member.email || '').toLowerCase().includes(term) ||
                (member.profile?.phone || '').includes(term)
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case 'name':
                    aValue = a.profile?.full_name || '';
                    bValue = b.profile?.full_name || '';
                    break;
                case 'email':
                    aValue = a.email || '';
                    bValue = b.email || '';
                    break;
                case 'created_at':
                    aValue = new Date(a.created_at);
                    bValue = new Date(b.created_at);
                    break;
                case 'status':
                    aValue = a.approval_status || '';
                    bValue = b.approval_status || '';
                    break;
                default:
                    aValue = '';
                    bValue = '';
            }

            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [localMembers, searchTerm, sortBy, sortOrder]);

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const handleEditMember = (member) => {
        setSelectedMember(member);
        setShowEditPanel(true);
    };

    const handleResetPassword = (member) => {
        setSelectedMember(member);
        setShowResetPasswordModal(true);
    };

    const handleDeleteRequest = (member) => {
        setSelectedMember(member);
        // SuperAdmins get direct deletion with confirmation, regular admins get request workflow
        if (isSuperAdmin()) {
            setShowSuperAdminDeleteModal(true);
        } else {
            setShowDeleteRequestModal(true);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
            'approved': { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
            'rejected': { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
            'editor': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Editor' },
            'admin': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Admin' },
            'superadmin': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Super Admin' }
        };

        const config = statusConfig[status] || statusConfig['pending'];

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                {/* Search and Controls */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Search by name, email, or phone..."
                        />
                    </div>

                    <div className="text-sm text-gray-600">
                        {filteredAndSortedMembers.length} member{filteredAndSortedMembers.length !== 1 ? 's' : ''}
                    </div>
                </div>

                {/* Members Table */}
                {filteredAndSortedMembers.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-500">
                            {searchTerm ? 'No members found matching your search.' : 'No members found.'}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('name')}
                                    >
                                        <div className="flex items-center">
                                            Name
                                            {sortBy === 'name' && (
                                                <span className="ml-1">
                                                    {sortOrder === 'asc' ? '↑' : '↓'}
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('email')}
                                    >
                                        <div className="flex items-center">
                                            Email
                                            {sortBy === 'email' && (
                                                <span className="ml-1">
                                                    {sortOrder === 'asc' ? '↑' : '↓'}
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('status')}
                                    >
                                        <div className="flex items-center">
                                            Status
                                            {sortBy === 'status' && (
                                                <span className="ml-1">
                                                    {sortOrder === 'asc' ? '↑' : '↓'}
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide"
                                    >
                                        Home Group
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('created_at')}
                                    >
                                        <div className="flex items-center">
                                            Created
                                            {sortBy === 'created_at' && (
                                                <span className="ml-1">
                                                    {sortOrder === 'asc' ? '↑' : '↓'}
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredAndSortedMembers.map((member) => (
                                    <tr key={member.user_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex flex-col">
                                                <div className="font-medium text-gray-900">
                                                    {member.profile?.full_name || 'No name'}
                                                </div>
                                                {member.profile?.phone && (
                                                    <div className="text-gray-500">
                                                        {member.profile.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {member.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(member.approval_status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {member.profile?.home_group?.name || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(member.created_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleEditMember(member)}
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                                    title="Edit member"
                                                >
                                                    <PencilIcon className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleResetPassword(member)}
                                                    className="text-green-600 hover:text-green-900 p-1 rounded"
                                                    title="Reset password"
                                                >
                                                    <KeyIcon className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteRequest(member)}
                                                    className="text-red-600 hover:text-red-900 p-1 rounded"
                                                    title="Request deletion"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showEditPanel && selectedMember && (
                <EditMemberPanel
                    member={selectedMember}
                    onClose={() => {
                        setShowEditPanel(false);
                        setSelectedMember(null);
                    }}
                    onSuccess={() => {
                        setShowEditPanel(false);
                        setSelectedMember(null);
                    }}
                />
            )}

            {showResetPasswordModal && selectedMember && (
                <ResetPasswordModal
                    member={selectedMember}
                    onClose={() => {
                        setShowResetPasswordModal(false);
                        setSelectedMember(null);
                    }}
                    onSuccess={() => {
                        setShowResetPasswordModal(false);
                        setSelectedMember(null);
                    }}
                />
            )}

            {showDeleteRequestModal && selectedMember && (
                <DeleteMemberRequestModal
                    member={selectedMember}
                    onClose={() => {
                        setShowDeleteRequestModal(false);
                        setSelectedMember(null);
                    }}
                    onSuccess={() => {
                        setShowDeleteRequestModal(false);
                        setSelectedMember(null);
                        // Remove from local display (moves to Pending Deletions)
                        setLocalMembers(prev => prev.filter(m => m.user_id !== selectedMember.user_id));
                        // Trigger parent refresh
                        if (onMemberDeleted) {
                            onMemberDeleted(selectedMember.user_id);
                        }
                    }}
                />
            )}

            {showSuperAdminDeleteModal && selectedMember && (
                <SuperAdminDeleteModal
                    member={selectedMember}
                    onClose={() => {
                        setShowSuperAdminDeleteModal(false);
                        setSelectedMember(null);
                    }}
                    onSuccess={() => {
                        setShowSuperAdminDeleteModal(false);
                        setSelectedMember(null);
                        // Immediately remove from local display
                        setLocalMembers(prev => prev.filter(m => m.user_id !== selectedMember.user_id));
                        if (onMemberDeleted) {
                            onMemberDeleted(selectedMember.user_id);
                        }
                    }}
                />
            )}
        </>
    );
};

export default MembersList;
import React, { useState, useEffect } from 'react';
import { XMarkIcon, PencilIcon } from '@heroicons/react/24/outline';
import useUserManagement from '../../hooks/useUserManagement';
import useAuth from '../../hooks/useAuth';
import { formatMemberName } from '../../utils/nameUtils';

const EditMemberPanel = ({ member, onClose, onSuccess }) => {
    const { updateMemberProfile, updateMemberRole, homeGroups, loading, createSampleHomeGroups } = useUserManagement();
    const { user } = useAuth();
    const isSuperAdmin = user?.user_metadata?.role === 'superadmin';

    // Debug logging
    console.log('EditMemberPanel homeGroups:', homeGroups, 'length:', homeGroups.length);

    const handleCreateSampleGroups = async () => {
        const result = await createSampleHomeGroups();
        if (result.success) {
            alert('Sample home groups created successfully!');
        } else {
            alert(`Error creating sample groups: ${result.error}`);
        }
    };

    const [profileData, setProfileData] = useState({
        first_name: '',
        middle_initial: '',
        last_name: '',
        phone: '',
        clean_date: '',
        home_group_id: '',
        listed_in_directory: false,
        willing_to_sponsor: false
    });

    const [roleData, setRoleData] = useState({
        approval_status: 'pending',
        notes: ''
    });

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    // Initialize form data when member prop changes
    useEffect(() => {
        if (member) {
            setProfileData({
                first_name: member.profile?.first_name || '',
                middle_initial: member.profile?.middle_initial || '',
                last_name: member.profile?.last_name || '',
                phone: member.profile?.phone || '',
                clean_date: member.profile?.clean_date || '',
                home_group_id: member.profile?.home_group_id || '',
                listed_in_directory: member.profile?.listed_in_directory || false,
                willing_to_sponsor: member.profile?.willing_to_sponsor || false
            });

            setRoleData({
                approval_status: member.approval_status || 'pending',
                notes: member.notes || ''
            });
        }
    }, [member]);

    const handleProfileInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleRoleInputChange = (e) => {
        const { name, value } = e.target;
        setRoleData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateProfileData = () => {
        const newErrors = {};

        if (!profileData.first_name.trim()) {
            newErrors.first_name = 'First name is required';
        }

        if (!profileData.last_name.trim()) {
            newErrors.last_name = 'Last name is required';
        }

        if (profileData.middle_initial && profileData.middle_initial.length > 1) {
            newErrors.middle_initial = 'Middle initial should be a single character';
        }

        if (profileData.clean_date) {
            const cleanDate = new Date(profileData.clean_date);
            const today = new Date();
            if (cleanDate > today) {
                newErrors.clean_date = 'Clean date cannot be in the future';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveProfile = async () => {
        if (!validateProfileData()) {
            return;
        }

        setSaving(true);
        try {
            const result = await updateMemberProfile(member.user_id, {
                ...profileData,
                home_group_id: profileData.home_group_id ? parseInt(profileData.home_group_id) : null
            });

            if (result.success) {
                onSuccess();
            } else {
                setErrors({ submit: result.error || 'Failed to update profile' });
            }
        } catch (error) {
            setErrors({ submit: 'Failed to update profile. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    const handleSaveRole = async () => {
        setSaving(true);
        try {
            const result = await updateMemberRole(
                member.user_id,
                roleData.approval_status,
                roleData.notes
            );

            if (result.success) {
                onSuccess();
            } else {
                setErrors({ submit: result.error || 'Failed to update role' });
            }
        } catch (error) {
            setErrors({ submit: 'Failed to update role. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not provided';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!member) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <PencilIcon className="h-6 w-6 mr-2 text-blue-600" />
                            Edit Member: {formatMemberName(member.profile || {}) || member.email}
                        </h3>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 p-1"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Tab Navigation */}
                    <div className="mt-4">
                        <nav className="flex space-x-8" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`${activeTab === 'profile'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                            >
                                Profile Information
                            </button>
                            {isSuperAdmin && (
                                <button
                                    onClick={() => setActiveTab('role')}
                                    className={`${activeTab === 'role'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                                >
                                    Role & Status
                                </button>
                            )}
                            <button
                                onClick={() => setActiveTab('info')}
                                className={`${activeTab === 'info'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                            >
                                Member Info
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-4">
                    {/* Error Display */}
                    {errors.submit && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                            {errors.submit}
                        </div>
                    )}

                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* First Name */}
                                <div>
                                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="first_name"
                                        name="first_name"
                                        value={profileData.first_name}
                                        onChange={handleProfileInputChange}
                                        className={`block w-full px-3 py-2 border ${errors.first_name ? 'border-red-300' : 'border-gray-300'
                                            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                        required
                                    />
                                    {errors.first_name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="last_name"
                                        name="last_name"
                                        value={profileData.last_name}
                                        onChange={handleProfileInputChange}
                                        className={`block w-full px-3 py-2 border ${errors.last_name ? 'border-red-300' : 'border-gray-300'
                                            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                        required
                                    />
                                    {errors.last_name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
                                    )}
                                </div>

                                {/* Middle Initial */}
                                <div>
                                    <label htmlFor="middle_initial" className="block text-sm font-medium text-gray-700 mb-1">
                                        Middle Initial
                                    </label>
                                    <input
                                        type="text"
                                        id="middle_initial"
                                        name="middle_initial"
                                        value={profileData.middle_initial}
                                        onChange={handleProfileInputChange}
                                        maxLength={1}
                                        className={`block w-full px-3 py-2 border ${errors.middle_initial ? 'border-red-300' : 'border-gray-300'
                                            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                        placeholder="M"
                                    />
                                    {errors.middle_initial && (
                                        <p className="mt-1 text-sm text-red-600">{errors.middle_initial}</p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={profileData.phone}
                                        onChange={handleProfileInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="(555) 123-4567"
                                    />
                                </div>

                                {/* Clean Date */}
                                <div>
                                    <label htmlFor="clean_date" className="block text-sm font-medium text-gray-700 mb-1">
                                        Clean Date
                                    </label>
                                    <input
                                        type="date"
                                        id="clean_date"
                                        name="clean_date"
                                        value={profileData.clean_date}
                                        onChange={handleProfileInputChange}
                                        max={new Date().toISOString().split('T')[0]}
                                        className={`block w-full px-3 py-2 border ${errors.clean_date ? 'border-red-300' : 'border-gray-300'
                                            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                    />
                                    {errors.clean_date && (
                                        <p className="mt-1 text-sm text-red-600">{errors.clean_date}</p>
                                    )}
                                </div>

                                {/* Home Group */}
                                <div>
                                    <label htmlFor="home_group_id" className="block text-sm font-medium text-gray-700 mb-1">
                                        Home Group
                                    </label>
                                    <select
                                        id="home_group_id"
                                        name="home_group_id"
                                        value={profileData.home_group_id}
                                        onChange={handleProfileInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    >
                                        <option value="">Select a home group</option>
                                        {homeGroups.map((group) => (
                                            <option key={group.id} value={group.id}>
                                                {group.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Directory Preferences */}
                            <div>
                                <h4 className="text-md font-medium text-gray-800 mb-3">Directory Preferences</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <input
                                            id="listed_in_directory"
                                            name="listed_in_directory"
                                            type="checkbox"
                                            checked={profileData.listed_in_directory}
                                            onChange={handleProfileInputChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="listed_in_directory" className="ml-3 text-sm text-gray-700">
                                            List in member directory
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id="willing_to_sponsor"
                                            name="willing_to_sponsor"
                                            type="checkbox"
                                            checked={profileData.willing_to_sponsor}
                                            onChange={handleProfileInputChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="willing_to_sponsor" className="ml-3 text-sm text-gray-700">
                                            Willing to sponsor
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Debug Button for Creating Home Groups */}
                            {homeGroups.length === 0 && (
                                <div className="pt-4">
                                    <button
                                        onClick={handleCreateSampleGroups}
                                        className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={loading}
                                    >
                                        {loading ? 'Creating...' : 'Create Sample Home Groups (Debug)'}
                                    </button>
                                </div>
                            )}

                            {/* Save Button */}
                            <div className="pt-4">
                                <button
                                    onClick={handleSaveProfile}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={saving}
                                >
                                    {saving ? 'Saving...' : 'Save Profile Changes'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Role Tab (Superadmin only) */}
                    {activeTab === 'role' && isSuperAdmin && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Approval Status */}
                                <div>
                                    <label htmlFor="approval_status" className="block text-sm font-medium text-gray-700 mb-1">
                                        Approval Status
                                    </label>
                                    <select
                                        id="approval_status"
                                        name="approval_status"
                                        value={roleData.approval_status}
                                        onChange={handleRoleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                        <option value="editor">Editor</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                {/* Current Role */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Current Role
                                    </label>
                                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700">
                                        {member.role || 'member'}
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                                    Admin Notes
                                </label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    value={roleData.notes}
                                    onChange={handleRoleInputChange}
                                    rows={4}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Add any notes about this member..."
                                />
                            </div>

                            {/* Save Button */}
                            <div className="pt-4">
                                <button
                                    onClick={handleSaveRole}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={saving}
                                >
                                    {saving ? 'Saving...' : 'Save Role Changes'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Info Tab */}
                    {activeTab === 'info' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-md font-medium text-gray-800 mb-3">Account Information</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <span className="block text-sm font-medium text-gray-500">Email:</span>
                                            <span className="text-sm text-gray-900">{member.email}</span>
                                        </div>
                                        <div>
                                            <span className="block text-sm font-medium text-gray-500">User ID:</span>
                                            <span className="text-sm text-gray-900 font-mono">{member.user_id}</span>
                                        </div>
                                        <div>
                                            <span className="block text-sm font-medium text-gray-500">Status:</span>
                                            <span className="text-sm text-gray-900">{member.approval_status}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-md font-medium text-gray-800 mb-3">Timestamps</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <span className="block text-sm font-medium text-gray-500">Created:</span>
                                            <span className="text-sm text-gray-900">{formatDate(member.created_at)}</span>
                                        </div>
                                        <div>
                                            <span className="block text-sm font-medium text-gray-500">Last Updated:</span>
                                            <span className="text-sm text-gray-900">{formatDate(member.updated_at)}</span>
                                        </div>
                                        {member.profile?.updated_at && (
                                            <div>
                                                <span className="block text-sm font-medium text-gray-500">Profile Updated:</span>
                                                <span className="text-sm text-gray-900">{formatDate(member.profile.updated_at)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditMemberPanel;
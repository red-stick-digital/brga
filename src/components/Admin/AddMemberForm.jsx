import React, { useState } from 'react';
import { XMarkIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import useUserManagement from '../../hooks/useUserManagement';

const AddMemberForm = ({ onClose, onSuccess }) => {
    const { createMember, homeGroups, loading, requestPasswordReset } = useUserManagement();

    const [formData, setFormData] = useState({
        email: '',
        first_name: '',
        middle_initial: '',
        last_name: '',
        phone: '',
        clean_date: '',
        home_group_id: '',
        listed_in_directory: false,
        willing_to_sponsor: false
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
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

    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        // Name validation
        if (!formData.first_name.trim()) {
            newErrors.first_name = 'First name is required';
        }

        if (!formData.last_name.trim()) {
            newErrors.last_name = 'Last name is required';
        }

        if (formData.middle_initial && formData.middle_initial.length > 1) {
            newErrors.middle_initial = 'Middle initial should be a single character';
        }

        // Clean date validation
        if (formData.clean_date) {
            const cleanDate = new Date(formData.clean_date);
            const today = new Date();
            if (cleanDate > today) {
                newErrors.clean_date = 'Clean date cannot be in the future';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);

        try {
            const email = formData.email.trim().toLowerCase();

            // Generate a random temporary password
            const tempPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12);

            const profileData = {
                first_name: formData.first_name.trim(),
                middle_initial: formData.middle_initial.trim() || null,
                last_name: formData.last_name.trim(),
                phone: formData.phone.trim() || null,
                clean_date: formData.clean_date || null,
                home_group_id: formData.home_group_id ? parseInt(formData.home_group_id) : null,
                listed_in_directory: formData.listed_in_directory,
                willing_to_sponsor: formData.willing_to_sponsor
            };

            // Create member with temporary password
            const result = await createMember(email, tempPassword, profileData);

            if (result.success) {
                // Send password reset email so they can set their own password
                const resetResult = await requestPasswordReset(email);

                if (!resetResult.success) {
                    console.warn('Failed to send password reset email:', resetResult.error);
                    // Still consider this a success, just log the warning
                }

                onSuccess();
            } else {
                setErrors({ submit: result.error || 'Failed to create member' });
            }
        } catch (error) {
            setErrors({ submit: 'Failed to create member. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                <UserPlusIcon className="h-6 w-6 mr-2 text-blue-600" />
                                Add New Member
                            </h3>
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 p-1"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="px-6 py-4 space-y-6">
                        {/* Error Display */}
                        {errors.submit && (
                            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                                {errors.submit}
                            </div>
                        )}

                        {/* Account Information */}
                        <div>
                            <h4 className="text-md font-medium text-gray-800 mb-4">Account Information</h4>
                            <div className="space-y-4">
                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`block w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'
                                            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                        placeholder="member@email.com"
                                        required
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500">
                                        A password reset email will be sent to this address after account creation.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Profile Information */}
                        <div>
                            <h4 className="text-md font-medium text-gray-800 mb-4">Profile Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* First Name */}
                                <div>
                                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="first_name"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        className={`block w-full px-3 py-2 border ${errors.first_name ? 'border-red-300' : 'border-gray-300'
                                            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                        placeholder="John"
                                        required
                                    />
                                    {errors.first_name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
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
                                        value={formData.middle_initial}
                                        onChange={handleInputChange}
                                        maxLength="1"
                                        className={`block w-full px-3 py-2 border ${errors.middle_initial ? 'border-red-300' : 'border-gray-300'
                                            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                        placeholder="M"
                                    />
                                    {errors.middle_initial && (
                                        <p className="mt-1 text-sm text-red-600">{errors.middle_initial}</p>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Last Name or Initial *
                                    </label>
                                    <input
                                        type="text"
                                        id="last_name"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        className={`block w-full px-3 py-2 border ${errors.last_name ? 'border-red-300' : 'border-gray-300'
                                            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                        placeholder="Doe or D."
                                        required
                                    />
                                    {errors.last_name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                {/* Phone */}
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="337-889-8123"
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
                                        value={formData.clean_date}
                                        onChange={handleInputChange}
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
                                        value={formData.home_group_id}
                                        onChange={handleInputChange}
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
                        </div>

                        {/* Directory Preferences */}
                        <div>
                            <h4 className="text-md font-medium text-gray-800 mb-4">Directory Preferences</h4>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <input
                                        id="listed_in_directory"
                                        name="listed_in_directory"
                                        type="checkbox"
                                        checked={formData.listed_in_directory}
                                        onChange={handleInputChange}
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
                                        checked={formData.willing_to_sponsor}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="willing_to_sponsor" className="ml-3 text-sm text-gray-700">
                                        Willing to sponsor
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={submitting}
                        >
                            {submitting ? 'Creating...' : 'Create Member'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMemberForm;
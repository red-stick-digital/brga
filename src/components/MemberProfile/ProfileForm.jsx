import React, { useState, useEffect } from 'react';
import useMemberProfile from '../../hooks/useMemberProfile';

/**
 * ProfileForm Component
 * 
 * Form for editing member profile information
 * Includes fields for personal info, home group selection, and preferences
 */
const ProfileForm = ({ profile, onCancel, onSuccess }) => {
    const { updateProfile, loading, error, homeGroups, fetchHomeGroups } = useMemberProfile();
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        email: '',
        clean_date: '',
        home_group_id: '',
        listed_in_directory: false,
        willing_to_sponsor: false
    });
    const [formErrors, setFormErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    // Load home groups on component mount
    useEffect(() => {
        fetchHomeGroups();
    }, []);

    // Initialize form with existing profile data
    useEffect(() => {
        if (profile) {
            // Format phone for display in form (handle both formatted and digit-only inputs)
            let formattedPhone = profile.phone || '';
            if (formattedPhone) {
                const digits = formattedPhone.replace(/\D/g, '');
                if (digits.length > 3 && digits.length <= 6) {
                    formattedPhone = `${digits.slice(0, 3)}-${digits.slice(3)}`;
                } else if (digits.length > 6) {
                    formattedPhone = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
                } else if (digits.length <= 3) {
                    formattedPhone = digits;
                }
            }

            setFormData({
                full_name: profile.full_name || '',
                phone: formattedPhone,
                email: profile.email || '',
                clean_date: profile.clean_date ? new Date(profile.clean_date).toISOString().split('T')[0] : '',
                home_group_id: profile.home_group_id || '',
                listed_in_directory: profile.listed_in_directory || false,
                willing_to_sponsor: profile.willing_to_sponsor || false
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let finalValue = value;

        // Format phone number as user types (XXX-XXX-XXXX)
        if (name === 'phone') {
            const digits = value.replace(/\D/g, '');
            if (digits.length <= 3) {
                finalValue = digits;
            } else if (digits.length <= 6) {
                finalValue = `${digits.slice(0, 3)}-${digits.slice(3)}`;
            } else {
                finalValue = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
            }
        }

        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : finalValue
        });

        // Clear error for this field when user starts typing
        if (formErrors[name]) {
            setFormErrors({
                ...formErrors,
                [name]: ''
            });
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.full_name.trim()) {
            errors.full_name = 'Full name is required';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }

        if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            errors.phone = 'Phone number should be 10 digits';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        // Store phone number as digits only in database
        let formattedData = { ...formData };
        if (formData.phone) {
            const digits = formData.phone.replace(/\D/g, '');
            formattedData.phone = digits;
        }

        // Submit form
        const result = await updateProfile(formattedData);

        if (result.success) {
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => {
                setSuccessMessage('');
                if (onSuccess) onSuccess();
            }, 2000);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {profile ? 'Edit Your Profile' : 'Create Your Profile'}
            </h2>

            {successMessage && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-green-700">{successMessage}</p>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">Personal Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="full_name"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border ${formErrors.full_name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                required
                            />
                            {formErrors.full_name && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.full_name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                required
                            />
                            {formErrors.email && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="337-889-8123"
                                className={`w-full px-3 py-2 border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                            />
                            {formErrors.phone && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="clean_date" className="block text-sm font-medium text-gray-700 mb-1">
                                Clean Date
                            </label>
                            <input
                                type="date"
                                id="clean_date"
                                name="clean_date"
                                value={formData.clean_date}
                                onChange={handleChange}
                                max={new Date().toISOString().split('T')[0]}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Group & Preferences */}
                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">Group & Preferences</h3>

                    <div className="mb-4">
                        <label htmlFor="home_group_id" className="block text-sm font-medium text-gray-700 mb-1">
                            Home Group
                        </label>
                        <select
                            id="home_group_id"
                            name="home_group_id"
                            value={formData.home_group_id}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select a home group</option>
                            {homeGroups
                                .sort((a, b) => {
                                    // Primary sort by day_of_week
                                    const dayDiff = (a.day_of_week || 0) - (b.day_of_week || 0);
                                    if (dayDiff !== 0) return dayDiff;
                                    // Secondary sort by start_time
                                    return (a.start_time || '').localeCompare(b.start_time || '');
                                })
                                .map(group => (
                                    <option key={group.id} value={group.id}>
                                        {group.name} - {new Date(`2000-01-01T${group.start_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="listed_in_directory"
                                name="listed_in_directory"
                                checked={formData.listed_in_directory}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="listed_in_directory" className="ml-2 block text-sm text-gray-700">
                                List me in the member directory
                            </label>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="willing_to_sponsor"
                                name="willing_to_sponsor"
                                checked={formData.willing_to_sponsor}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="willing_to_sponsor" className="ml-2 block text-sm text-gray-700">
                                I am willing to sponsor others
                            </label>
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex space-x-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Saving...' : 'Save Profile'}
                    </button>

                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileForm;
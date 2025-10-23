/**
 * Profile Completion Utilities
 * 
 * Functions to check and manage member profile completion status
 */

/**
 * Check if a member profile is complete
 * 
 * A profile is considered complete when ALL of the following fields have values:
 * - first_name (any text)
 * - last_name (any text)
 * - email (any text - should exist by default if user can login)
 * - clean_date (any valid date)
 * - home_group_id (any number referencing home_groups table)
 * 
 * @param {Object} profile - The member profile object from member_profiles table
 * @returns {boolean} - True if profile is complete, false otherwise
 */
export const checkProfileComplete = (profile) => {
    if (!profile) return false;

    const requiredFields = [
        'first_name',
        'last_name',
        'email',
        'clean_date',
        'home_group_id'
    ];

    // Check that all required fields exist and have non-empty values
    return requiredFields.every(field => {
        const value = profile[field];
        
        // Check for null, undefined, or empty string
        if (value === null || value === undefined || value === '') {
            return false;
        }

        // For strings, also check for whitespace-only values
        if (typeof value === 'string' && value.trim() === '') {
            return false;
        }

        return true;
    });
};

/**
 * Calculate profile completion percentage
 * 
 * @param {Object} profile - The member profile object from member_profiles table
 * @returns {number} - Percentage from 0-100
 */
export const calculateProfileCompletionPercentage = (profile) => {
    if (!profile) return 0;

    const requiredFields = [
        'first_name',
        'last_name',
        'email',
        'clean_date',
        'home_group_id'
    ];

    const completedFields = requiredFields.filter(field => {
        const value = profile[field];
        
        if (value === null || value === undefined || value === '') {
            return false;
        }

        if (typeof value === 'string' && value.trim() === '') {
            return false;
        }

        return true;
    });

    return Math.round((completedFields.length / requiredFields.length) * 100);
};

/**
 * Get list of missing required fields
 * 
 * @param {Object} profile - The member profile object from member_profiles table
 * @returns {Array<string>} - Array of field names that are missing/incomplete
 */
export const getMissingProfileFields = (profile) => {
    if (!profile) {
        return ['first_name', 'last_name', 'email', 'clean_date', 'home_group_id'];
    }

    const requiredFields = [
        'first_name',
        'last_name',
        'email',
        'clean_date',
        'home_group_id'
    ];

    return requiredFields.filter(field => {
        const value = profile[field];
        
        if (value === null || value === undefined || value === '') {
            return true;
        }

        if (typeof value === 'string' && value.trim() === '') {
            return true;
        }

        return false;
    });
};

/**
 * Get user-friendly field names for display
 */
export const fieldDisplayNames = {
    first_name: 'First Name',
    last_name: 'Last Name',
    email: 'Email',
    clean_date: 'Clean Date',
    home_group_id: 'Home Group'
};

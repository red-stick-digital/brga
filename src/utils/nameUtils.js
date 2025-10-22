/**
 * Name utility functions for handling separate name fields
 */

/**
 * Format member name from separate fields
 * @param {Object} member - Member object with name fields
 * @param {string} member.first_name - First name
 * @param {string} member.middle_initial - Middle initial (optional)
 * @param {string} member.last_name - Last name
 * @returns {string} - Formatted full name
 */
export const formatMemberName = (member) => {
    if (!member?.first_name && !member?.last_name) {
        return "Member";
    }

    const parts = [];
    if (member.first_name) parts.push(member.first_name.trim());
    if (member.middle_initial) parts.push(member.middle_initial.trim());
    if (member.last_name) parts.push(member.last_name.trim());

    return parts.join(" ") || "Member";
};

/**
 * Get display name for member (first name + last initial for privacy)
 * @param {Object} member - Member object with name fields
 * @param {string} member.first_name - First name
 * @param {string} member.last_name - Last name (optional)
 * @returns {string} - Display name (e.g., "John S.")
 */
export const getDisplayName = (member) => {
    if (!member?.first_name) return "Member";

    let displayName = member.first_name.trim();
    if (member.last_name && member.last_name.trim()) {
        displayName += ` ${member.last_name.trim().charAt(0)}.`;
    }

    return displayName;
};

/**
 * Get formal name for member (first name + middle initial + full last name)
 * @param {Object} member - Member object with name fields
 * @returns {string} - Formal full name
 */
export const getFormalName = (member) => {
    return formatMemberName(member);
};

/**
 * Get sorting key for member names (last name first for alphabetical sorting)
 * @param {Object} member - Member object with name fields
 * @returns {string} - Sorting key (e.g., "Smith, John D")
 */
export const getNameSortKey = (member) => {
    if (!member?.last_name && !member?.first_name) {
        return "zzz"; // Sort members without names at the end
    }

    const lastName = member.last_name?.trim() || "";
    const firstName = member.first_name?.trim() || "";
    const middleInitial = member.middle_initial?.trim() || "";

    if (lastName && firstName) {
        return `${lastName}, ${firstName}${middleInitial ? ` ${middleInitial}` : ""}`;
    } else if (firstName) {
        return firstName;
    } else if (lastName) {
        return lastName;
    }

    return "zzz";
};

/**
 * Check if member has a complete name (both first and last)
 * @param {Object} member - Member object with name fields
 * @returns {boolean} - True if member has both first and last name
 */
export const hasCompleteName = (member) => {
    return Boolean(member?.first_name?.trim() && member?.last_name?.trim());
};

/**
 * Validate name fields
 * @param {Object} nameData - Object with name fields
 * @returns {Object} - Validation errors object
 */
export const validateNameFields = (nameData) => {
    const errors = {};

    if (!nameData.first_name?.trim()) {
        errors.first_name = "First name is required";
    }

    if (!nameData.last_name?.trim()) {
        errors.last_name = "Last name is required";
    }

    if (nameData.middle_initial && nameData.middle_initial.length > 1) {
        errors.middle_initial = "Middle initial should be a single character";
    }

    return errors;
};
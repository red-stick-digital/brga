// Verification validation utilities for signup form

/**
 * Validates verification information text for spam and content rules
 * @param {string} text - The verification text to validate
 * @returns {object} - { isValid: boolean, error: string|null }
 */
export const validateVerificationInfo = (text) => {
    if (!text || typeof text !== 'string') {
        return { isValid: false, error: 'Verification information is required.' };
    }

    const trimmedText = text.trim();

    // Check if empty
    if (!trimmedText) {
        return { isValid: false, error: 'Verification information cannot be empty.' };
    }

    // Check character limit
    if (trimmedText.length > 2000) {
        return { isValid: false, error: 'Verification information cannot exceed 2000 characters.' };
    }

    // Check for URLs/links (basic spam prevention)
    const urlPattern = /https?:\/\/|www\.|\.com|\.net|\.org|\.edu|\.gov/i;
    if (urlPattern.test(trimmedText)) {
        return { isValid: false, error: 'Please do not include website links in your verification information.' };
    }

    // Check for common spam patterns
    const spamPatterns = [
        /buy\s+now/i,
        /click\s+here/i,
        /free\s+money/i,
        /make\s+money/i,
        /viagra|cialis/i,
        /crypto|bitcoin|forex/i,
        /loan|credit/i,
        /casino|gambling(?!\s+anonymous|addiction)/i, // Allow "gambling anonymous" or "gambling addiction"
        /investment|trading/i
    ];

    for (const pattern of spamPatterns) {
        if (pattern.test(trimmedText)) {
            return { isValid: false, error: 'Your verification information contains content that appears to be spam. Please provide genuine GA-related information.' };
        }
    }

    // Check minimum length (too short might be spam)
    if (trimmedText.length < 10) {
        return { isValid: false, error: 'Please provide more detailed verification information (at least 10 characters).' };
    }

    return { isValid: true, error: null };
};

/**
 * Gets the remaining character count for verification field
 * @param {string} text - Current text in field
 * @returns {number} - Characters remaining (can be negative if over limit)
 */
export const getVerificationCharacterCount = (text) => {
    const length = text ? text.length : 0;
    return 2000 - length;
};

/**
 * Formats character count display text
 * @param {string} text - Current text in field
 * @returns {string} - Formatted display text
 */
export const formatCharacterCountDisplay = (text) => {
    const remaining = getVerificationCharacterCount(text);

    if (remaining < 0) {
        return `${Math.abs(remaining)} characters over limit`;
    } else if (remaining < 100) {
        return `${remaining} characters remaining`;
    } else {
        return `${text?.length || 0} / 2000 characters`;
    }
};

/**
 * Gets CSS classes for character count display based on remaining count
 * @param {string} text - Current text in field
 * @returns {string} - Tailwind CSS classes
 */
export const getCharacterCountClasses = (text) => {
    const remaining = getVerificationCharacterCount(text);

    if (remaining < 0) {
        return 'text-red-500 font-medium';
    } else if (remaining < 100) {
        return 'text-orange-500';
    } else {
        return 'text-gray-500';
    }
};
// Utility to handle redirect URLs for different environments

export const getRedirectUrl = (path = '') => {
    // Check if we're in development
    const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost';

    if (isDevelopment) {
        // Use the current port from the window location, fallback to 3000
        const port = window.location.port || '3000';
        return `http://localhost:${port}${path}`;
    }

    // Production URL
    return `https://batonrougega.org${path}`;
};

export const getConfirmationRedirectUrl = () => {
    return getRedirectUrl('/auth/callback');
};

export const getPasswordResetRedirectUrl = () => {
    return getRedirectUrl('/auth/reset-password');
};
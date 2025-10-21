/**
 * Enhanced Session Security Utilities
 * 
 * This module provides comprehensive security measures to prevent
 * persistent login vulnerabilities and enforce proper session management.
 */

// Import supabase dynamically to avoid build-time execution

// Session timeout configuration (in milliseconds)
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const SESSION_WARNING_TIME = 25 * 60 * 1000; // 25 minutes (5 min warning)

class SessionSecurity {
    constructor() {
        this.lastActivity = Date.now();
        this.sessionTimeoutId = null;
        this.warningTimeoutId = null;
        this.isActive = false;
        this.listeners = [];
    }

    /**
     * Initialize session security monitoring
     */
    initialize() {
        if (this.isActive) return;

        this.isActive = true;
        this.lastActivity = Date.now();

        // Set up activity monitoring
        this.setupActivityMonitoring();

        // Start session timeout
        this.resetSessionTimeout();

        // Monitor auth state changes
        this.setupAuthStateMonitoring();

        console.log('🔒 Session security initialized');
    }

    /**
     * Clean up session security
     */
    cleanup() {
        this.isActive = false;

        // Clear timeouts
        if (this.sessionTimeoutId) {
            clearTimeout(this.sessionTimeoutId);
            this.sessionTimeoutId = null;
        }

        if (this.warningTimeoutId) {
            clearTimeout(this.warningTimeoutId);
            this.warningTimeoutId = null;
        }

        // Remove event listeners
        this.removeActivityListeners();

        console.log('🔒 Session security cleaned up');
    }

    /**
     * Set up activity monitoring to detect user interaction
     */
    setupActivityMonitoring() {
        // Only run in browser environment
        if (typeof document === 'undefined') {
            return;
        }

        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

        const activityHandler = () => {
            this.updateActivity();
        };

        events.forEach(event => {
            document.addEventListener(event, activityHandler, true);
        });

        // Store reference for cleanup
        this.activityHandler = activityHandler;
        this.monitoredEvents = events;
    }

    /**
     * Remove activity monitoring listeners
     */
    removeActivityListeners() {
        if (typeof document === 'undefined') {
            return;
        }

        if (this.activityHandler && this.monitoredEvents) {
            this.monitoredEvents.forEach(event => {
                document.removeEventListener(event, this.activityHandler, true);
            });
        }
    }

    /**
     * Update activity timestamp and reset timeouts
     */
    updateActivity() {
        if (!this.isActive) return;

        this.lastActivity = Date.now();
        this.resetSessionTimeout();
    }

    /**
     * Reset session timeout
     */
    resetSessionTimeout() {
        // Clear existing timeouts
        if (this.sessionTimeoutId) clearTimeout(this.sessionTimeoutId);
        if (this.warningTimeoutId) clearTimeout(this.warningTimeoutId);

        // Set warning timeout
        this.warningTimeoutId = setTimeout(() => {
            this.showSessionWarning();
        }, SESSION_WARNING_TIME);

        // Set session timeout
        this.sessionTimeoutId = setTimeout(() => {
            this.forceLogout('session_timeout');
        }, SESSION_TIMEOUT);
    }

    /**
     * Show session warning to user
     */
    showSessionWarning() {
        console.warn('⚠️ Session expiring in 5 minutes');

        // Only dispatch events in browser environment
        if (typeof window !== 'undefined') {
            // Dispatch custom event for UI components to handle
            const event = new CustomEvent('session-warning', {
                detail: { remainingTime: 5 * 60 * 1000 }
            });
            window.dispatchEvent(event);
        }
    }

    /**
     * Force logout due to security reasons
     */
    async forceLogout(reason = 'security_timeout') {
        console.warn(`🚨 Force logout triggered: ${reason}`);

        try {
            // Aggressive logout
            await this.performSecureLogout();

            // Dispatch logout event (browser only)
            if (typeof window !== 'undefined') {
                const event = new CustomEvent('force-logout', {
                    detail: { reason }
                });
                window.dispatchEvent(event);

                // Clear all storage
                this.clearAllStorage();

                // Redirect to login
                window.location.href = '/login';
            }

        } catch (error) {
            console.error('❌ Force logout error:', error);
            // Even if logout fails, clear storage and redirect (browser only)
            if (typeof window !== 'undefined') {
                this.clearAllStorage();
                window.location.href = '/login';
            }
        }
    }

    /**
     * Perform secure logout
     */
    async performSecureLogout() {
        try {
            // Dynamic import to prevent build-time execution
            const { default: supabase } = await import('../services/supabase');

            // Sign out from Supabase
            const { error } = await supabase.auth.signOut({ scope: 'global' });
            if (error) {
                console.error('Supabase logout error:', error);
            }
        } catch (error) {
            console.error('Secure logout error:', error);
        }
    }

    /**
     * Clear all possible storage locations
     */
    clearAllStorage() {
        // Only run in browser environment
        if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
            return;
        }

        try {
            // Clear localStorage
            const localKeys = [];
            for (let i = 0; i < localStorage.length; i++) {
                localKeys.push(localStorage.key(i));
            }
            localKeys.forEach(key => {
                if (key && (
                    key.includes('supabase') ||
                    key.includes('sb-') ||
                    key.includes('auth') ||
                    key.includes('session') ||
                    key.includes('token')
                )) {
                    localStorage.removeItem(key);
                }
            });

            // Clear sessionStorage
            if (typeof sessionStorage !== 'undefined') {
                const sessionKeys = [];
                for (let i = 0; i < sessionStorage.length; i++) {
                    sessionKeys.push(sessionStorage.key(i));
                }
                sessionKeys.forEach(key => {
                    if (key && (
                        key.includes('supabase') ||
                        key.includes('sb-') ||
                        key.includes('auth') ||
                        key.includes('session') ||
                        key.includes('token')
                    )) {
                        sessionStorage.removeItem(key);
                    }
                });
            }

            console.log('🗑️ All storage cleared');
        } catch (error) {
            console.error('Storage clearing error:', error);
        }
    }

    /**
     * Monitor auth state changes
     */
    setupAuthStateMonitoring() {
        // Dynamic import to prevent build-time execution
        import('../services/supabase').then(({ default: supabase }) => {
            supabase.auth.onAuthStateChange((event, session) => {
                if (event === 'SIGNED_OUT') {
                    this.cleanup();
                }
                // Remove the initialize() call to avoid circular reference
                // The useAuth hook will handle calling initialize() on sign-in
            });
        }).catch(error => {
            console.error('Failed to setup auth state monitoring:', error);
        });
    }

    /**
     * Check if session is expired
     */
    isSessionExpired() {
        return (Date.now() - this.lastActivity) > SESSION_TIMEOUT;
    }

    /**
     * Validate current session
     */
    async validateSession() {
        try {
            // Dynamic import to prevent build-time execution
            const { default: supabase } = await import('../services/supabase');

            const { data: { session }, error } = await supabase.auth.getSession();

            if (error || !session) {
                this.forceLogout('invalid_session');
                return false;
            }

            return true;
        } catch (error) {
            console.error('Session validation error:', error);
            this.forceLogout('validation_error');
            return false;
        }
    }

    /**
     * Add security event listener
     */
    addEventListener(event, callback) {
        if (typeof window !== 'undefined') {
            this.listeners.push({ event, callback });
            window.addEventListener(event, callback);
        }
    }

    /**
     * Remove security event listener
     */
    removeEventListener(event, callback) {
        if (typeof window !== 'undefined') {
            window.removeEventListener(event, callback);
            this.listeners = this.listeners.filter(
                l => l.event !== event || l.callback !== callback
            );
        }
    }
}

// Create singleton instance only in browser environment
const createSessionSecurity = () => {
    if (typeof window === 'undefined') {
        // Return no-op implementation for server/build environment
        return {
            initialize: () => { },
            cleanup: () => { },
            updateActivity: () => { },
            forceLogout: () => Promise.resolve(),
            validateSession: () => Promise.resolve(true),
            isSessionExpired: () => false,
            addEventListener: () => { },
            removeEventListener: () => { }
        };
    }
    return new SessionSecurity();
};

export default createSessionSecurity();
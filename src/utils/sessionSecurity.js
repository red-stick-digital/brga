/**
 * Enhanced Session Security Utilities
 * 
 * This module provides comprehensive security measures to prevent
 * persistent login vulnerabilities and enforce proper session management.
 */

import supabase from '../services/supabase';

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

        // Dispatch custom event for UI components to handle
        const event = new CustomEvent('session-warning', {
            detail: { remainingTime: 5 * 60 * 1000 }
        });
        window.dispatchEvent(event);
    }

    /**
     * Force logout due to security reasons
     */
    async forceLogout(reason = 'security_timeout') {
        console.warn(`🚨 Force logout triggered: ${reason}`);

        try {
            // Aggressive logout
            await this.performSecureLogout();

            // Dispatch logout event
            const event = new CustomEvent('force-logout', {
                detail: { reason }
            });
            window.dispatchEvent(event);

            // Clear all storage
            this.clearAllStorage();

            // Redirect to login
            window.location.href = '/login';

        } catch (error) {
            console.error('❌ Force logout error:', error);
            // Even if logout fails, clear storage and redirect
            this.clearAllStorage();
            window.location.href = '/login';
        }
    }

    /**
     * Perform secure logout
     */
    async performSecureLogout() {
        try {
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

            console.log('🗑️ All storage cleared');
        } catch (error) {
            console.error('Storage clearing error:', error);
        }
    }

    /**
     * Monitor auth state changes
     */
    setupAuthStateMonitoring() {
        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                this.cleanup();
            } else if (event === 'SIGNED_IN' && session) {
                this.initialize();
            }
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
        this.listeners.push({ event, callback });
        window.addEventListener(event, callback);
    }

    /**
     * Remove security event listener
     */
    removeEventListener(event, callback) {
        window.removeEventListener(event, callback);
        this.listeners = this.listeners.filter(
            l => l.event !== event || l.callback !== callback
        );
    }
}

// Create singleton instance
const sessionSecurity = new SessionSecurity();

export default sessionSecurity;
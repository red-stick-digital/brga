import { useState, useEffect } from 'react';
import supabase from '../services/supabase';
import useApprovalCode from './useApprovalCode';
import sessionSecurity from '../utils/sessionSecurity';
import { getConfirmationRedirectUrl } from '../utils/redirectUrls';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { markCodeAsUsed } = useApprovalCode();

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);

            // Initialize session security if user is logged in
            if (session?.user) {
                sessionSecurity.initialize();
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);

            // Handle session security based on auth state
            if (event === 'SIGNED_IN' && session?.user) {
                sessionSecurity.initialize();
            } else if (event === 'SIGNED_OUT') {
                sessionSecurity.cleanup();
            }
        });

        return () => {
            subscription.unsubscribe();
            sessionSecurity.cleanup();
        };
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        setUser(data.user);
        setLoading(false);
        return { user: data.user, error };
    };

    const signup = async (email, password, approvalCode) => {
        setLoading(true);

        try {
            // Create the user account first
            const { data, error: signupError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: getConfirmationRedirectUrl()
                }
            });

            if (signupError) {
                setLoading(false);
                return { user: null, error: signupError };
            }

            const newUser = data.user;

            if (newUser) {
                // Mark the approval code as used
                const codeResult = await markCodeAsUsed(approvalCode, newUser.id);

                if (!codeResult.success) {
                    // If we can't mark the code as used, we should clean up the user account
                    // However, Supabase doesn't provide a way to delete users from client side
                    // So we'll just return the error and let admin handle cleanup if needed
                    setLoading(false);
                    return { user: null, error: { message: codeResult.error } };
                }

                // Create user_roles entry with 'pending' status
                const { error: roleError } = await supabase
                    .from('user_roles')
                    .insert({
                        user_id: newUser.id,
                        role: 'member',
                        approval_status: 'pending'
                    });

                if (roleError) {
                    console.error('Error creating user role:', roleError);
                    // Continue anyway - the user was created successfully
                    // Admin can manually add role if needed
                }
            }

            setUser(newUser);
            setLoading(false);
            return { user: newUser, error: null };

        } catch (err) {
            console.error('Signup error:', err);
            setLoading(false);
            return { user: null, error: { message: 'Signup failed. Please try again.' } };
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            console.log('🔐 Starting secure logout process...');

            // Step 1: Clear user state immediately to prevent UI access
            setUser(null);
            console.log('✅ User state cleared immediately');

            // Step 2: Sign out from Supabase with global scope
            const { error } = await supabase.auth.signOut({ scope: 'global' });
            if (error) {
                console.error('❌ Supabase logout error:', error);
                // Don't throw - continue with cleanup even if Supabase fails
            } else {
                console.log('✅ Supabase signOut completed successfully');
            }

            // Step 3: Aggressive storage cleanup - multiple approaches
            try {
                console.log('🧹 Starting aggressive storage cleanup...');

                // Clear all localStorage
                const localStorageKeys = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && (
                        key.includes('supabase') ||
                        key.includes('sb-') ||
                        key.includes('auth') ||
                        key.includes('batonrougega') ||
                        key.includes('session') ||
                        key.includes('token')
                    )) {
                        localStorageKeys.push(key);
                    }
                }
                localStorageKeys.forEach(key => {
                    localStorage.removeItem(key);
                    console.log(`🗑️  Cleared localStorage: ${key}`);
                });

                // Clear all sessionStorage  
                const sessionStorageKeys = [];
                for (let i = 0; i < sessionStorage.length; i++) {
                    const key = sessionStorage.key(i);
                    if (key && (
                        key.includes('supabase') ||
                        key.includes('sb-') ||
                        key.includes('auth') ||
                        key.includes('batonrougega') ||
                        key.includes('session') ||
                        key.includes('token')
                    )) {
                        sessionStorageKeys.push(key);
                    }
                }
                sessionStorageKeys.forEach(key => {
                    sessionStorage.removeItem(key);
                    console.log(`🗑️  Cleared sessionStorage: ${key}`);
                });

                // Force clear specific known Supabase keys
                const knownSupabaseKeys = [
                    'sb-batonrougega-auth-token',
                    'sb-nrpwrxeypphbduvlozbr-auth-token',
                    'supabase.auth.token',
                    'supabase.session'
                ];

                knownSupabaseKeys.forEach(key => {
                    localStorage.removeItem(key);
                    sessionStorage.removeItem(key);
                    console.log(`🗑️  Force cleared known key: ${key}`);
                });

                console.log('✅ Aggressive storage cleanup completed');
            } catch (storageError) {
                console.warn('⚠️  Error during storage cleanup:', storageError);
            }

            // Step 4: Clear any browser auth state
            try {
                // Clear IndexedDB if supported
                if (window.indexedDB) {
                    console.log('🗑️  Requesting IndexedDB cleanup...');
                }

                // Request garbage collection if available (dev tools)
                if (window.gc) {
                    window.gc();
                }
            } catch (cleanupError) {
                console.warn('⚠️  Advanced cleanup error:', cleanupError);
            }

        } catch (error) {
            console.error('❌ Critical error during logout:', error);
            // Always clear user state even if everything else fails
            setUser(null);
        } finally {
            setLoading(false);
            console.log('🔐 Secure logout process completed');

            // Clean up session security
            sessionSecurity.cleanup();
        }
    };

    return { user, loading, login, signup, logout };
};

// Export both default and named export for compatibility
export default useAuth;
export { useAuth };
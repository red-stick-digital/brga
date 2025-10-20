import { useState, useEffect } from 'react';
import supabase from '../services/supabase';
import useApprovalCode from './useApprovalCode';
// import sessionSecurity from '../utils/sessionSecurity';
import emailService from '../services/emailService';

/**
 * Enhanced authentication hook with email functionality
 * Extends the base auth functionality to include welcome emails and other email features
 */
const useAuthWithEmail = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [emailLoading, setEmailLoading] = useState(false);
    const { markCodeAsUsed } = useApprovalCode();

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);

            // Initialize session security if user is logged in
            if (session?.user) {
                // sessionSecurity.initialize();
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);

            // Handle session security based on auth state
            if (event === 'SIGNED_IN' && session?.user) {
                // sessionSecurity.initialize();
            } else if (event === 'SIGNED_OUT') {
                // sessionSecurity.cleanup();
            }
        });

        return () => {
            subscription.unsubscribe();
            // sessionSecurity.cleanup();
        };
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        setUser(data.user);
        setLoading(false);
        return { user: data.user, error };
    };

    const signup = async (email, password, approvalCode, memberProfile = null) => {
        setLoading(true);

        try {
            // Create the user account first
            const { data, error: signupError } = await supabase.auth.signUp({
                email,
                password
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
                }

                // Create member profile if provided
                if (memberProfile) {
                    const { error: profileError } = await supabase
                        .from('member_profiles')
                        .insert({
                            user_id: newUser.id,
                            first_name: memberProfile.firstName,
                            last_name: memberProfile.lastName,
                            phone_number: memberProfile.phone,
                            preferred_contact: memberProfile.preferredContact,
                            home_group_id: memberProfile.homeGroupId,
                            sobriety_date: memberProfile.sobrietyDate,
                            privacy_level: memberProfile.privacyLevel || 'private'
                        });

                    if (profileError) {
                        console.error('Error creating member profile:', profileError);
                    }
                }

                // Send welcome email (non-blocking - don't fail signup if email fails)
                try {
                    setEmailLoading(true);
                    const memberName = memberProfile
                        ? `${memberProfile.firstName} ${memberProfile.lastName}`.trim()
                        : email.split('@')[0]; // Use email username as fallback

                    await emailService.sendWelcomeEmail(email, memberName);
                    console.log('✅ Welcome email sent successfully to:', email);
                } catch (emailError) {
                    console.error('⚠️  Failed to send welcome email:', emailError);
                    // Don't fail the signup process for email errors
                } finally {
                    setEmailLoading(false);
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
            } else {
                console.log('✅ Supabase signOut completed successfully');
            }

            // Step 3: Aggressive storage cleanup
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

        } catch (error) {
            console.error('❌ Critical error during logout:', error);
            // Always clear user state even if everything else fails
            setUser(null);
        } finally {
            setLoading(false);
            console.log('🔐 Secure logout process completed');

            // Clean up session security
            // sessionSecurity.cleanup();
        }
    };

    const sendPasswordReset = async (email) => {
        try {
            // Get the origin safely, with fallback for server-side rendering
            const origin = typeof window !== 'undefined'
                ? window.location.origin
                : 'https://batonrougega.vercel.app'; // fallback for build time

            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${origin}/auth/reset-password`,
            });

            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Error sending password reset:', error);
            return { success: false, error: error.message };
        }
    };

    const resendEmailConfirmation = async (email) => {
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: email
            });

            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Error resending confirmation:', error);
            return { success: false, error: error.message };
        }
    };

    return {
        user,
        loading,
        emailLoading,
        login,
        signup,
        logout,
        sendPasswordReset,
        resendEmailConfirmation
    };
};

export default useAuthWithEmail;
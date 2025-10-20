import { useState, useEffect } from 'react';
import supabase from '../services/supabase';
import useApprovalCode from './useApprovalCode';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { markCodeAsUsed } = useApprovalCode();

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            subscription.unsubscribe();
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
        await supabase.auth.signOut();
        setUser(null);
        setLoading(false);
    };

    return { user, loading, login, signup, logout };
};

// Export both default and named export for compatibility
export default useAuth;
export { useAuth };
import supabase from '../services/supabase';

/**
 * Admin Setup Utility
 * This utility helps set up the initial admin user and manage user roles
 */

/**
 * Get user by email (admin function)
 * @param {string} email - User email
 * @returns {Object} User data or null
 */
export const getUserByEmail = async (email) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching user:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error in getUserByEmail:', error);
        return null;
    }
};

/**
 * Set user role in the database
 * @param {string} userId - Supabase user ID
 * @param {string} role - Role to assign ('admin', 'editor', 'member')
 * @returns {Object} Success status and error if any
 */
export const setUserRole = async (userId, role = 'admin') => {
    try {
        // First, try to update existing role
        const { data: existingRole, error: fetchError } = await supabase
            .from('user_roles')
            .select('*')
            .eq('user_id', userId)
            .single();

        let result;

        if (existingRole) {
            // Update existing role
            result = await supabase
                .from('user_roles')
                .update({ role })
                .eq('user_id', userId);
        } else {
            // Insert new role
            result = await supabase
                .from('user_roles')
                .insert({ user_id: userId, role });
        }

        if (result.error) {
            console.error('Error setting user role:', result.error);
            return { success: false, error: result.error };
        }

        console.log(`Successfully set user role to ${role} for user ${userId}`);
        return { success: true };

    } catch (error) {
        console.error('Error in setUserRole:', error);
        return { success: false, error };
    }
};

/**
 * Setup initial admin user by email (without needing login)
 * This function sets up an admin role for a specific email
 * @param {string} email - Admin user email
 * @returns {Object} Setup result
 */
export const setupInitialAdmin = async (email) => {
    try {
        // Get current user session
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return { success: false, error: 'No authenticated user found' };
        }

        // Check if this is the correct user
        if (user.email !== email) {
            return { success: false, error: 'Email does not match current user' };
        }

        // Set user role to admin
        const roleResult = await setUserRole(user.id, 'admin');

        if (!roleResult.success) {
            return { success: false, error: roleResult.error };
        }

        return {
            success: true,
            message: `Successfully set up ${email} as admin`,
            userId: user.id
        };

    } catch (error) {
        console.error('Error in setupInitialAdmin:', error);
        return { success: false, error };
    }
};

/**
 * Setup admin role directly by user ID
 * This bypasses the need for a logged-in session
 * @param {string} userId - Supabase user ID  
 * @param {string} email - User email for confirmation
 * @returns {Object} Setup result
 */
export const setupAdminByUserId = async (userId, email) => {
    try {
        // Set user role to admin
        const roleResult = await setUserRole(userId, 'admin');

        if (!roleResult.success) {
            return { success: false, error: roleResult.error };
        }

        return {
            success: true,
            message: `Successfully set up ${email} as admin`,
            userId: userId
        };

    } catch (error) {
        console.error('Error in setupAdminByUserId:', error);
        return { success: false, error };
    }
};

/**
 * Force login bypass for admin setup
 * This creates a temporary admin session for initial setup
 * @param {string} email - Admin email
 * @param {string} password - Admin password  
 * @returns {Object} Login result
 */
export const forceAdminLogin = async (email, password) => {
    try {
        // Try to sign in even with unconfirmed email
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            // If email not confirmed, we still get the user but can't sign in
            // Let's try to get the user ID from the auth.users table
            console.log('Login error:', error.message);
            return { success: false, error: error.message, needsConfirmation: error.message.includes('Email not confirmed') };
        }

        return { success: true, user: data.user };
    } catch (error) {
        console.error('Error in forceAdminLogin:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Check if user is admin
 * @param {string} userId - User ID to check
 * @returns {boolean} True if user is admin
 */
export const isUserAdmin = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', userId)
            .single();

        if (error) {
            console.error('Error checking admin status:', error);
            return false;
        }

        return data?.role === 'admin';
    } catch (error) {
        console.error('Error in isUserAdmin:', error);
        return false;
    }
};

/**
 * Admin utility to provide manual email confirmation instructions
 * @param {string} email - Email that needs to be confirmed
 * @returns {Object} Instructions for manual confirmation
 */
export const getEmailConfirmationInstructions = (email) => {
    console.log('🔧 ADMIN SETUP: Manual email confirmation needed');
    console.log(`📧 Email: ${email}`);
    console.log('📋 Steps to confirm email in Supabase Dashboard:');
    console.log('1. Go to your Supabase project dashboard');
    console.log('2. Navigate to Authentication > Users');
    console.log(`3. Find the user with email: ${email}`);
    console.log('4. Click on the user row to open details');
    console.log('5. Toggle "Email Confirmed" to ON/true');
    console.log('6. Save changes');
    console.log('7. Return to the application and try logging in normally');

    return {
        email,
        instructions: [
            'Go to your Supabase project dashboard',
            'Navigate to Authentication > Users',
            `Find user: ${email}`,
            'Click user row to open details',
            'Toggle "Email Confirmed" to ON',
            'Save changes',
            'Try normal login'
        ]
    };
};
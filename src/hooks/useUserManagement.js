import { useState, useEffect } from 'react';
import supabase from '../services/supabase';

const useUserManagement = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [members, setMembers] = useState([]);
    const [homeGroups, setHomeGroups] = useState([]);

    // Fetch all home groups for dropdowns
    const fetchHomeGroups = async () => {
        try {
            const { data, error: fetchError } = await supabase
                .from('home_groups')
                .select('*')
                .order('name');

            if (fetchError) {
                throw fetchError;
            }

            setHomeGroups(data || []);
            return { success: true, homeGroups: data || [] };

        } catch (err) {
            console.error('Error fetching home groups:', err);
            setError(err.message || 'Failed to fetch home groups');
            return { success: false, error: err.message || 'Failed to fetch home groups' };
        }
    };

    // Fetch all approved members with their profiles
    const fetchAllMembers = async () => {
        setLoading(true);
        setError(null);

        try {
            // Fetch all user_roles with approval status
            const { data: rolesData, error: rolesError } = await supabase
                .from('user_roles')
                .select('*')
                .order('created_at', { ascending: false });

            if (rolesError) {
                throw rolesError;
            }

            if (!rolesData || rolesData.length === 0) {
                setMembers([]);
                setLoading(false);
                return { success: true, members: [] };
            }

            // Fetch member profiles for these users
            const userIds = rolesData.map(r => r.user_id);
            const { data: profilesData, error: profilesError } = await supabase
                .from('member_profiles')
                .select(`
                    *,
                    home_group:home_group_id (
                        id,
                        name,
                        start_time
                    )
                `)
                .in('user_id', userIds);

            if (profilesError) {
                throw profilesError;
            }

            // Combine the data (we'll get email from profile or set it to unknown)
            const combinedData = rolesData.map(role => {
                const profile = profilesData?.find(p => p.user_id === role.user_id);

                return {
                    ...role,
                    profile: profile || {},
                    email: profile?.email || `user-${role.user_id.slice(0, 8)}@unknown`,
                    user: null // No auth user data available with anon key
                };
            });

            setMembers(combinedData);
            setLoading(false);
            return { success: true, members: combinedData };

        } catch (err) {
            console.error('Error fetching all members:', err);
            setError(err.message || 'Failed to fetch members');
            setLoading(false);
            return { success: false, error: err.message || 'Failed to fetch members' };
        }
    };

    // Create new member with auth user + profile + role
    const createMember = async (email, password, profileData) => {
        setLoading(true);
        setError(null);

        try {
            // Note: Since we can't use admin.createUser with anon key,
            // we'll create the user via signup and then approve them
            // This is a workaround for client-side user creation

            // 1. Create auth user via signup
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                    data: {
                        // Mark as admin-created for auto-approval
                        admin_created: true
                    }
                }
            });

            if (authError) {
                throw authError;
            }

            if (!authData.user) {
                throw new Error('Failed to create user account');
            }

            const userId = authData.user.id;
            console.log('Created user with ID:', userId);

            // Wait for database trigger (handle_new_user) to create basic profile and role
            // The trigger auto-creates minimal member_profiles and user_roles entries
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 2. UPDATE the member profile (trigger already created it)
            // The database trigger creates a minimal profile, we just need to fill in the details
            const { error: profileError } = await supabase
                .from('member_profiles')
                .update({
                    first_name: profileData.first_name,
                    middle_initial: profileData.middle_initial || null,
                    last_name: profileData.last_name,
                    phone: profileData.phone,
                    clean_date: profileData.clean_date,
                    home_group_id: profileData.home_group_id,
                    listed_in_directory: profileData.listed_in_directory || false,
                    willing_to_sponsor: profileData.willing_to_sponsor || false
                })
                .eq('user_id', userId);

            if (profileError) {
                console.error('Failed to update profile:', profileError);
                throw new Error('Failed to update member profile: ' + profileError.message);
            }

            console.log('Successfully updated member profile');

            // 3. UPDATE user role to approved (trigger created it as 'pending')
            // The database trigger creates the role with 'pending' status, we update to 'approved'
            const { error: roleError } = await supabase
                .from('user_roles')
                .update({
                    approval_status: 'approved',
                    notes: 'Manually added by admin'
                })
                .eq('user_id', userId);

            if (roleError) {
                console.error('Failed to update user role:', roleError);
                throw new Error('Failed to update member role: ' + roleError.message);
            }

            console.log('Successfully updated user role to approved');

            // Refresh members list
            await fetchAllMembers();

            setLoading(false);
            return { success: true, userId };

        } catch (err) {
            console.error('Error creating member:', err);
            setError(err.message || 'Failed to create member');
            setLoading(false);
            return { success: false, error: err.message || 'Failed to create member' };
        }
    };

    // Update member profile information
    const updateMemberProfile = async (userId, profileData) => {
        setLoading(true);
        setError(null);

        try {
            // Prepare profile data, handling empty dates
            const profileDataToSave = {
                user_id: userId,
                first_name: profileData.first_name,
                middle_initial: profileData.middle_initial || null,
                last_name: profileData.last_name,
                phone: profileData.phone,
                clean_date: profileData.clean_date || null, // Convert empty string to null
                home_group_id: profileData.home_group_id || null, // Convert empty string to null
                listed_in_directory: profileData.listed_in_directory,
                willing_to_sponsor: profileData.willing_to_sponsor,
                // Get email from members array for new profiles
                email: members.find(m => m.user_id === userId)?.email || null
            };

            // Use upsert to handle cases where profile doesn't exist yet
            const { error: upsertError } = await supabase
                .from('member_profiles')
                .upsert(profileDataToSave, {
                    onConflict: 'user_id',
                    ignoreDuplicates: false
                });

            if (upsertError) {
                throw upsertError;
            }

            // Refresh the entire members list to get updated data
            await fetchAllMembers();

            setLoading(false);
            return { success: true };

        } catch (err) {
            console.error('Error updating member profile:', err);
            console.error('Full error object:', JSON.stringify(err, null, 2));
            setError(err.message || 'Failed to update member profile');
            setLoading(false);
            return { success: false, error: err.message || 'Failed to update member profile' };
        }
    };

    // Update member role and approval status
    const updateMemberRole = async (userId, approval_status, notes = '') => {
        setLoading(true);
        setError(null);

        try {
            const { error: updateError } = await supabase
                .from('user_roles')
                .update({
                    approval_status,
                    notes
                })
                .eq('user_id', userId);

            if (updateError) {
                throw updateError;
            }

            // Update local state
            setMembers(prev => prev.map(member =>
                member.user_id === userId
                    ? { ...member, approval_status, notes }
                    : member
            ));

            setLoading(false);
            return { success: true };

        } catch (err) {
            console.error('Error updating member role:', err);
            setError(err.message || 'Failed to update member role');
            setLoading(false);
            return { success: false, error: err.message || 'Failed to update member role' };
        }
    };

    // Request password reset for a member
    const requestPasswordReset = async (email) => {
        setLoading(true);
        setError(null);

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`
            });

            if (resetError) {
                throw resetError;
            }

            setLoading(false);
            return { success: true };

        } catch (err) {
            console.error('Error requesting password reset:', err);
            setError(err.message || 'Failed to send password reset email');
            setLoading(false);
            return { success: false, error: err.message || 'Failed to send password reset email' };
        }
    };

    // Request member deletion (creates deletion request for superadmin approval)
    const requestMemberDeletion = async (userId, requestedBy, reason = '') => {
        setLoading(true);
        setError(null);

        try {
            // Update user_roles with deletion request info
            const { error: updateError } = await supabase
                .from('user_roles')
                .update({
                    approval_status: 'pending_deletion',
                    notes: `DELETION REQUESTED by ${requestedBy}: ${reason}`,
                    deletion_requested_by: requestedBy,
                    deletion_requested_at: new Date().toISOString()
                })
                .eq('user_id', userId);

            if (updateError) {
                console.error('❌ Database error:', updateError);
                throw updateError;
            }

            // Update local state
            setMembers(prev => prev.map(member =>
                member.user_id === userId
                    ? {
                        ...member,
                        approval_status: 'pending_deletion',
                        notes: `DELETION REQUESTED by ${requestedBy}: ${reason}`,
                        deletion_requested_by: requestedBy,
                        deletion_requested_at: new Date().toISOString()
                    }
                    : member
            ));

            setLoading(false);
            return { success: true };

        } catch (err) {
            console.error('❌ Error requesting member deletion:', err);
            setError(err.message || 'Failed to request member deletion');
            setLoading(false);
            return { success: false, error: err.message || 'Failed to request member deletion' };
        }
    };

    // Approve member deletion (superadmin only)
    const approveMemberDeletion = async (userId) => {
        setLoading(true);
        setError(null);

        try {
            // Soft delete: mark as deleted instead of actually deleting
            const { error: updateError } = await supabase
                .from('user_roles')
                .update({
                    approval_status: 'deleted',
                    notes: 'DELETED by superadmin'
                })
                .eq('user_id', userId);

            if (updateError) {
                console.error('❌ Database error:', updateError);
                throw updateError;
            }

            // Note: Auth user disabling would require admin/service credentials
            // The soft delete via approval_status='deleted' is sufficient for our use case
            // The member is now blocked from accessing the system via RLS policies

            // Remove from local state
            setMembers(prev => prev.filter(member => member.user_id !== userId));

            setLoading(false);
            return { success: true };

        } catch (err) {
            console.error('❌ Error approving member deletion:', err);
            setError(err.message || 'Failed to approve member deletion');
            setLoading(false);
            return { success: false, error: err.message || 'Failed to approve member deletion' };
        }
    };

    // Reject member deletion (superadmin only)
    const rejectMemberDeletion = async (userId, rejectionReason = '') => {
        setLoading(true);
        setError(null);

        try {
            const { error: updateError } = await supabase
                .from('user_roles')
                .update({
                    approval_status: 'approved', // Restore to approved status
                    notes: `Deletion request rejected: ${rejectionReason}`,
                    deletion_requested_by: null,
                    deletion_requested_at: null
                })
                .eq('user_id', userId);

            if (updateError) {
                throw updateError;
            }

            // Update local state
            setMembers(prev => prev.map(member =>
                member.user_id === userId
                    ? {
                        ...member,
                        approval_status: 'approved',
                        notes: `Deletion request rejected: ${rejectionReason}`,
                        deletion_requested_by: null,
                        deletion_requested_at: null
                    }
                    : member
            ));

            setLoading(false);
            return { success: true };

        } catch (err) {
            console.error('Error rejecting member deletion:', err);
            setError(err.message || 'Failed to reject member deletion');
            setLoading(false);
            return { success: false, error: err.message || 'Failed to reject member deletion' };
        }
    };

    // Get pending deletion requests count
    const getPendingDeletionsCount = () => {
        return members.filter(member => member.approval_status === 'pending_deletion').length;
    };

    // Create sample home groups (admin only)
    const createSampleHomeGroups = async () => {
        setLoading(true);
        setError(null);

        try {
            const sampleGroups = [
                { name: "Monday Night", start_time: "19:00", street_1: "8725 Jefferson Highway", street_2: "Education Building to the Right of the Church", city: "Baton Rouge", state: "LA", zip: "70809" },
                { name: "Tuesday Night", start_time: "19:00", street_1: "9755 Goodwood Blvd.", street_2: "Small Building on the Right Side of the Parking Lot", city: "Baton Rouge", state: "LA", zip: "70815" },
                { name: "Wednesday Night", start_time: "18:30", street_1: "630 Richland Ave.", street_2: "Building on the Left Side of the Church, 1st Floor", city: "Baton Rouge", state: "LA", zip: "70806" },
                { name: "Thursday Noon", start_time: "12:00", street_1: "8725 Jefferson Highway", street_2: "Education Building to the Right of the Church", city: "Baton Rouge", state: "LA", zip: "70809" },
                { name: "Thursday Night - Baton Rouge", start_time: "19:00", street_1: "10230 Mollylea Dr.", street_2: "Community Ministries Building on the Back Side of the Grounds", city: "Baton Rouge", state: "LA", zip: "70815" }
            ];

            const { data, error: insertError } = await supabase
                .from('home_groups')
                .insert(sampleGroups)
                .select();

            if (insertError) {
                throw insertError;
            }

            // Refresh home groups
            await fetchHomeGroups();

            setLoading(false);
            return { success: true, data };

        } catch (err) {
            console.error('Error creating sample home groups:', err);
            setError(err.message || 'Failed to create sample home groups');
            setLoading(false);
            return { success: false, error: err.message || 'Failed to create sample home groups' };
        }
    };

    // Load initial data
    useEffect(() => {
        fetchHomeGroups();
        fetchAllMembers();
    }, []);

    return {
        // State
        members,
        homeGroups,
        loading,
        error,

        // Core methods
        fetchAllMembers,
        fetchHomeGroups,
        createMember,
        updateMemberProfile,
        updateMemberRole,
        requestPasswordReset,
        requestMemberDeletion,
        approveMemberDeletion,
        rejectMemberDeletion,
        getPendingDeletionsCount,
        createSampleHomeGroups,

        // Utility
        setError
    };
};

export default useUserManagement;
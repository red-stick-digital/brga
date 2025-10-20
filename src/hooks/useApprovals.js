import { useState, useEffect } from 'react';
import supabase from '../services/supabase';

const useApprovals = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pendingMembers, setPendingMembers] = useState([]);
    const [rejectedMembers, setRejectedMembers] = useState([]);

    // Fetch pending members (approval_status = 'pending')
    const fetchPendingMembers = async () => {
        setLoading(true);
        setError(null);

        try {
            const { data, error: fetchError } = await supabase
                .from('user_roles')
                .select(`
                    *,
                    user:user_id (email),
                    profile:user_id (
                        full_name,
                        phone,
                        email,
                        clean_date,
                        home_group:home_group_id (
                            name,
                            start_time
                        ),
                        created_at
                    )
                `)
                .eq('approval_status', 'pending')
                .order('created_at', { ascending: false });

            if (fetchError) {
                throw fetchError;
            }

            setPendingMembers(data || []);
            setLoading(false);
            return { success: true, members: data || [] };

        } catch (err) {
            console.error('Error fetching pending members:', err);
            setError(err.message || 'Failed to fetch pending members');
            setLoading(false);
            return { success: false, error: err.message || 'Failed to fetch pending members' };
        }
    };

    // Fetch rejected members (approval_status = 'rejected')
    const fetchRejectedMembers = async () => {
        setLoading(true);
        setError(null);

        try {
            const { data, error: fetchError } = await supabase
                .from('user_roles')
                .select(`
                    *,
                    user:user_id (email),
                    profile:user_id (
                        full_name,
                        phone,
                        email,
                        clean_date,
                        home_group:home_group_id (
                            name,
                            start_time
                        ),
                        created_at
                    )
                `)
                .eq('approval_status', 'rejected')
                .order('updated_at', { ascending: false });

            if (fetchError) {
                throw fetchError;
            }

            setRejectedMembers(data || []);
            setLoading(false);
            return { success: true, members: data || [] };

        } catch (err) {
            console.error('Error fetching rejected members:', err);
            setError(err.message || 'Failed to fetch rejected members');
            setLoading(false);
            return { success: false, error: err.message || 'Failed to fetch rejected members' };
        }
    };

    // Approve a member (set approval_status to 'approved')
    const approveMember = async (userId, notes = '') => {
        setLoading(true);
        setError(null);

        try {
            const { error: updateError } = await supabase
                .from('user_roles')
                .update({
                    approval_status: 'approved',
                    notes: notes,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', userId);

            if (updateError) {
                throw updateError;
            }

            // Remove from pending list
            setPendingMembers(prev => prev.filter(member => member.user_id !== userId));

            setLoading(false);
            return { success: true };

        } catch (err) {
            console.error('Error approving member:', err);
            setError(err.message || 'Failed to approve member');
            setLoading(false);
            return { success: false, error: err.message || 'Failed to approve member' };
        }
    };

    // Reject a member (set approval_status to 'rejected')
    const rejectMember = async (userId, reason = '') => {
        setLoading(true);
        setError(null);

        try {
            const { error: updateError } = await supabase
                .from('user_roles')
                .update({
                    approval_status: 'rejected',
                    rejection_reason: reason,
                    notes: reason,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', userId);

            if (updateError) {
                throw updateError;
            }

            // Remove from pending list and add to rejected list
            const rejectedMember = pendingMembers.find(member => member.user_id === userId);
            if (rejectedMember) {
                setPendingMembers(prev => prev.filter(member => member.user_id !== userId));
                setRejectedMembers(prev => [{
                    ...rejectedMember,
                    approval_status: 'rejected',
                    rejection_reason: reason,
                    notes: reason
                }, ...prev]);
            }

            setLoading(false);
            return { success: true };

        } catch (err) {
            console.error('Error rejecting member:', err);
            setError(err.message || 'Failed to reject member');
            setLoading(false);
            return { success: false, error: err.message || 'Failed to reject member' };
        }
    };

    // Get all members (approved, pending, rejected) with counts
    const fetchMemberStats = async () => {
        setLoading(true);
        setError(null);

        try {
            const { data, error: fetchError } = await supabase
                .from('user_roles')
                .select('approval_status')
                .neq('role', 'superadmin'); // Exclude superadmins from stats

            if (fetchError) {
                throw fetchError;
            }

            const stats = {
                total: data?.length || 0,
                pending: data?.filter(u => u.approval_status === 'pending').length || 0,
                approved: data?.filter(u => u.approval_status === 'approved').length || 0,
                rejected: data?.filter(u => u.approval_status === 'rejected').length || 0,
                editors: data?.filter(u => u.approval_status === 'editor').length || 0,
                admins: data?.filter(u => u.approval_status === 'admin').length || 0
            };

            setLoading(false);
            return { success: true, stats };

        } catch (err) {
            console.error('Error fetching member stats:', err);
            setError(err.message || 'Failed to fetch member stats');
            setLoading(false);
            return { success: false, error: err.message || 'Failed to fetch member stats' };
        }
    };

    // Set up real-time subscription for approval changes
    useEffect(() => {
        const subscription = supabase
            .channel('user_roles_changes')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'user_roles' },
                (payload) => {
                    console.log('User roles changed:', payload);
                    // Refresh pending and rejected members when changes occur
                    fetchPendingMembers();
                    fetchRejectedMembers();
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return {
        pendingMembers,
        rejectedMembers,
        loading,
        error,
        fetchPendingMembers,
        fetchRejectedMembers,
        approveMember,
        rejectMember,
        fetchMemberStats,
        setError
    };
};

export default useApprovals;
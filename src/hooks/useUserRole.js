import { useState, useEffect } from 'react';
import supabase from '../services/supabase';
import useAuth from './useAuth';

const useUserRole = () => {
    const [role, setRole] = useState('member');
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchUserRole = async () => {
        if (!user) {
            setRole('member');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('user_roles')
                .select('role, approval_status')
                .eq('user_id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 = not found
                throw error;
            }

            // Use the actual role field from the database
            setRole(data?.role || 'member');
        } catch (error) {
            console.error('Error fetching user role:', error);
            setRole('member');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserRole();
    }, [user]);

    const isAdmin = () => role === 'admin';
    const isSuperAdmin = () => role === 'superadmin';
    const isEditor = () => role === 'editor' || role === 'admin' || role === 'superadmin';
    const canEdit = () => isEditor();
    const canAdminister = () => isAdmin() || isSuperAdmin();

    return {
        role,
        loading,
        isAdmin,
        isSuperAdmin,
        isEditor,
        canEdit,
        canAdminister,
        refetch: fetchUserRole
    };
};

export default useUserRole;
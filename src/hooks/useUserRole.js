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
                .select('role')
                .eq('user_id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 = not found
                throw error;
            }

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
    const isEditor = () => role === 'editor' || role === 'admin';
    const canEdit = () => isEditor();

    return {
        role,
        loading,
        isAdmin,
        isEditor,
        canEdit,
        refetch: fetchUserRole
    };
};

export default useUserRole;
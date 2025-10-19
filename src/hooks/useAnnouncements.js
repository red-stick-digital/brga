import { useState, useEffect } from 'react';
import supabase from '../services/supabase';

const useAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('announcements')
                .select('*')
                .eq('is_active', true)
                .order('display_order')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAnnouncements(data || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const createAnnouncement = async (announcement) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { data, error } = await supabase
                .from('announcements')
                .insert([{
                    ...announcement,
                    created_by: user?.id
                }])
                .select()
                .single();

            if (error) throw error;
            await fetchAnnouncements(); // Refresh the list
            return { data, error: null };
        } catch (error) {
            return { data: null, error: error.message };
        }
    };

    const updateAnnouncement = async (id, updates) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { data, error } = await supabase
                .from('announcements')
                .update({
                    ...updates,
                    updated_by: user?.id
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            await fetchAnnouncements(); // Refresh the list
            return { data, error: null };
        } catch (error) {
            return { data: null, error: error.message };
        }
    };

    const deleteAnnouncement = async (id) => {
        try {
            const { error } = await supabase
                .from('announcements')
                .update({ is_active: false })
                .eq('id', id);

            if (error) throw error;
            await fetchAnnouncements(); // Refresh the list
            return { error: null };
        } catch (error) {
            return { error: error.message };
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    return {
        announcements,
        loading,
        error,
        createAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        refetch: fetchAnnouncements
    };
};

export default useAnnouncements;
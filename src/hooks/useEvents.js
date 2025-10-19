import { useState, useEffect } from 'react';
import supabase from '../services/supabase';

const useEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('is_active', true)
                .order('event_date')
                .order('start_time');

            if (error) throw error;
            setEvents(data || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const createEvent = async (event) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { data, error } = await supabase
                .from('events')
                .insert([{
                    ...event,
                    created_by: user?.id
                }])
                .select()
                .single();

            if (error) throw error;
            await fetchEvents(); // Refresh the list
            return { data, error: null };
        } catch (error) {
            return { data: null, error: error.message };
        }
    };

    const updateEvent = async (id, updates) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { data, error } = await supabase
                .from('events')
                .update({
                    ...updates,
                    updated_by: user?.id
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            await fetchEvents(); // Refresh the list
            return { data, error: null };
        } catch (error) {
            return { data: null, error: error.message };
        }
    };

    const deleteEvent = async (id) => {
        try {
            const { error } = await supabase
                .from('events')
                .update({ is_active: false })
                .eq('id', id);

            if (error) throw error;
            await fetchEvents(); // Refresh the list
            return { error: null };
        } catch (error) {
            return { error: error.message };
        }
    };

    // Get upcoming events (next 30 days)
    const getUpcomingEvents = () => {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        return events.filter(event => {
            if (!event.event_date) return false;
            const eventDate = new Date(event.event_date);
            return eventDate >= new Date() && eventDate <= thirtyDaysFromNow;
        });
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return {
        events,
        loading,
        error,
        createEvent,
        updateEvent,
        deleteEvent,
        getUpcomingEvents,
        refetch: fetchEvents
    };
};

export default useEvents;
import { useState, useEffect } from 'react';
import supabase from '../services/supabase';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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

    const signup = async (email, password) => {
        setLoading(true);
        const { data, error } = await supabase.auth.signUp({ email, password });
        setUser(data.user);
        setLoading(false);
        return { user: data.user, error };
    };

    const logout = async () => {
        setLoading(true);
        await supabase.auth.signOut();
        setUser(null);
        setLoading(false);
    };

    return { user, loading, login, signup, logout };
};

export default useAuth;
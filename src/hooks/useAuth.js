import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const session = supabase.auth.session();
        setUser(session?.user ?? null);
        setLoading(false);

        const { data: subscription } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        const { user, error } = await supabase.auth.signIn({ email, password });
        setUser(user);
        setLoading(false);
        return { user, error };
    };

    const signup = async (email, password) => {
        setLoading(true);
        const { user, error } = await supabase.auth.signUp({ email, password });
        setUser(user);
        setLoading(false);
        return { user, error };
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
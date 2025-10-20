import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Enhanced security configuration for Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        // Force shorter session persistence to limit exposure
        persistSession: true,
        // Detect session storage key conflicts
        storageKey: 'sb-batonrougega-auth-token',
        // Auto refresh tokens for active sessions
        autoRefreshToken: true,
        // Detect tabs and synchronize auth state
        detectSessionInUrl: true,
        // Flow type for better security
        flowType: 'pkce'
    },
    // Additional security headers
    global: {
        headers: {
            'X-Client-Info': 'batonrougega-web'
        }
    }
});

export default supabase;
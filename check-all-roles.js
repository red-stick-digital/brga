import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
);

async function checkRoles() {
    const userId = 'f6c96c48-1dd8-43e2-9325-200064470db5';
    
    console.log('\n🔍 Searching for user_roles records...\n');
    
    const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId);
    
    console.log('Query result:', { data, error });
    
    // Also try with service key to bypass RLS
    const { count } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
    
    console.log('Count:', count);
}

checkRoles().catch(console.error);

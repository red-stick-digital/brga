import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
);

async function testTrigger() {
    console.log('\n🧪 Testing handle_new_user trigger...\n');
    
    // Create a test user
    const testEmail = `test-trigger-${Date.now()}@example.com`;
    console.log('Creating test user:', testEmail);
    
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: testEmail,
        email_confirm: true
    });
    
    if (authError) {
        console.error('❌ Failed to create user:', authError);
        return;
    }
    
    console.log('✅ User created:', authData.user.id);
    
    // Wait a moment for trigger to fire
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if profile was created
    const { data: profile } = await supabase
        .from('member_profiles')
        .select('*')
        .eq('user_id', authData.user.id)
        .single();
    
    console.log('\nProfile created:', profile ? '✅ YES' : '❌ NO');
    if (profile) console.log(JSON.stringify(profile, null, 2));
    
    // Check if role was created
    const { data: role } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', authData.user.id)
        .single();
    
    console.log('\nRole created:', role ? '✅ YES' : '❌ NO');
    if (role) console.log(JSON.stringify(role, null, 2));
    
    // Cleanup
    console.log('\n🧹 Cleaning up test user...');
    await supabase.from('member_profiles').delete().eq('user_id', authData.user.id);
    await supabase.from('user_roles').delete().eq('user_id', authData.user.id);
    await supabase.auth.admin.deleteUser(authData.user.id);
    console.log('✅ Cleanup complete');
}

testTrigger().catch(console.error);

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
);

async function checkUsers() {
    console.log('\n📊 Checking user records...\n');
    
    // Check marsh11272@yahoo.com (working)
    console.log('='.repeat(60));
    console.log('WORKING ACCOUNT: marsh11272@yahoo.com');
    console.log('='.repeat(60));
    
    const { data: workingProfile } = await supabase
        .from('member_profiles')
        .select('*')
        .eq('email', 'marsh11272@yahoo.com')
        .single();
    
    const { data: workingRole } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', workingProfile?.user_id)
        .single();
    
    console.log('Profile:', JSON.stringify(workingProfile, null, 2));
    console.log('Role:', JSON.stringify(workingRole, null, 2));
    
    // Check migrated user (test10)
    console.log('\n' + '='.repeat(60));
    console.log('MIGRATED ACCOUNT: naquinmarshall+test10@gmail.com');
    console.log('='.repeat(60));
    
    const { data: migratedProfile } = await supabase
        .from('member_profiles')
        .select('*')
        .eq('email', 'naquinmarshall+test10@gmail.com')
        .single();
    
    const { data: migratedRole } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', migratedProfile?.user_id)
        .single();
    
    console.log('Profile:', JSON.stringify(migratedProfile, null, 2));
    console.log('Role:', JSON.stringify(migratedRole, null, 2));
    
    console.log('\n' + '='.repeat(60));
    console.log('KEY DIFFERENCES:');
    console.log('='.repeat(60));
    console.log('listed_in_directory:');
    console.log('  Working:', workingProfile?.listed_in_directory);
    console.log('  Migrated:', migratedProfile?.listed_in_directory);
    console.log('\napproval_status:');
    console.log('  Working:', workingRole?.approval_status);
    console.log('  Migrated:', migratedRole?.approval_status);
    console.log('\nrole:');
    console.log('  Working:', workingRole?.role);
    console.log('  Migrated:', migratedRole?.role);
}

checkUsers().catch(console.error);

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
);

async function fixDirectoryListing() {
    console.log('\n' + '='.repeat(80));
    console.log('FIXING DIRECTORY LISTING FOR marsh11272@yahoo.com');
    console.log('='.repeat(80));
    
    // 1. Check current status
    console.log('\n1. CURRENT STATUS:');
    const { data: profile } = await supabase
        .from('member_profiles')
        .select('*')
        .eq('email', 'marsh11272@yahoo.com')
        .single();
    
    if (!profile) {
        console.log('❌ Profile not found for marsh11272@yahoo.com');
        return;
    }
    
    console.log(`   Email: ${profile.email}`);
    console.log(`   Name: ${profile.first_name} ${profile.last_name}`);
    console.log(`   listed_in_directory: ${profile.listed_in_directory}`);
    console.log(`   willing_to_sponsor: ${profile.willing_to_sponsor}`);
    console.log(`   share_phone_in_directory: ${profile.share_phone_in_directory}`);
    console.log(`   share_email_in_directory: ${profile.share_email_in_directory}`);
    
    // 2. Check role
    const { data: role } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', profile.user_id)
        .single();
    
    console.log(`\n2. ROLE STATUS:`);
    console.log(`   Role: ${role?.role}`);
    console.log(`   Approval: ${role?.approval_status}`);
    
    // 3. Update if needed
    if (!profile.listed_in_directory) {
        console.log(`\n3. UPDATING PROFILE:`);
        const { error } = await supabase
            .from('member_profiles')
            .update({
                listed_in_directory: true,
                willing_to_sponsor: true,
                share_phone_in_directory: true,
                share_email_in_directory: true
            })
            .eq('user_id', profile.user_id);
        
        if (error) {
            console.log(`   ❌ Error: ${error.message}`);
        } else {
            console.log(`   ✅ Successfully updated profile`);
        }
        
        // Verify
        const { data: updated } = await supabase
            .from('member_profiles')
            .select('listed_in_directory, willing_to_sponsor')
            .eq('user_id', profile.user_id)
            .single();
        
        console.log(`\n4. VERIFICATION:`);
        console.log(`   listed_in_directory: ${updated.listed_in_directory}`);
        console.log(`   willing_to_sponsor: ${updated.willing_to_sponsor}`);
    } else {
        console.log(`\n3. NO UPDATE NEEDED - already listed in directory`);
    }
    
    // 5. Test the directory query
    console.log(`\n5. TESTING DIRECTORY QUERY:`);
    const { data: directoryMembers } = await supabase
        .from('member_profiles')
        .select('*')
        .eq('listed_in_directory', true);
    
    console.log(`   Total members in directory: ${directoryMembers?.length || 0}`);
    directoryMembers?.forEach(m => {
        console.log(`   - ${m.email}: ${m.first_name} ${m.last_name}`);
    });
    
    console.log('\n' + '='.repeat(80));
}

fixDirectoryListing().catch(console.error);

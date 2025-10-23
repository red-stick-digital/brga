import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
);

async function checkDirectory() {
    console.log('\n' + '='.repeat(80));
    console.log('COMPREHENSIVE DIRECTORY CHECK');
    console.log('='.repeat(80));
    
    // 1. Check all profiles
    console.log('\n1. ALL MEMBER PROFILES:');
    const { data: allProfiles } = await supabase
        .from('member_profiles')
        .select('user_id, email, first_name, last_name, listed_in_directory');
    
    console.log(`Total profiles: ${allProfiles.length}`);
    allProfiles.forEach(p => {
        console.log(`  - ${p.email}: listed=${p.listed_in_directory}, name=${p.first_name} ${p.last_name}`);
    });
    
    // 2. Check all roles
    console.log('\n2. ALL USER ROLES:');
    const { data: allRoles } = await supabase
        .from('user_roles')
        .select('user_id, role, approval_status');
    
    console.log(`Total roles: ${allRoles.length}`);
    allRoles.forEach(r => {
        const profile = allProfiles.find(p => p.user_id === r.user_id);
        console.log(`  - ${profile?.email || 'unknown'}: role=${r.role}, status=${r.approval_status}`);
    });
    
    // 3. Check profiles WITH listed_in_directory = true
    console.log('\n3. PROFILES WITH listed_in_directory = TRUE:');
    const { data: listedProfiles } = await supabase
        .from('member_profiles')
        .select('user_id, email, first_name, last_name')
        .eq('listed_in_directory', true);
    
    console.log(`Total listed: ${listedProfiles.length}`);
    listedProfiles.forEach(p => {
        console.log(`  - ${p.email}`);
    });
    
    // 4. Check which of those have APPROVED roles
    console.log('\n4. LISTED PROFILES WITH APPROVED ROLES:');
    if (listedProfiles.length > 0) {
        const userIds = listedProfiles.map(p => p.user_id);
        const { data: approvedRoles } = await supabase
            .from('user_roles')
            .select('user_id, role, approval_status')
            .in('user_id', userIds)
            .eq('approval_status', 'approved');
        
        console.log(`Total approved: ${approvedRoles.length}`);
        approvedRoles.forEach(r => {
            const profile = listedProfiles.find(p => p.user_id === r.user_id);
            console.log(`  - ${profile?.email}: ${r.role}/${r.approval_status}`);
        });
    }
    
    // 5. Simulate the useDirectory query
    console.log('\n5. SIMULATING useDirectory.js QUERY:');
    const { data: directoryQuery } = await supabase
        .from('member_profiles')
        .select('*')
        .eq('listed_in_directory', true)
        .order('last_name', { ascending: true, nullsLast: true })
        .order('first_name', { ascending: true, nullsLast: true });
    
    console.log(`Query returned: ${directoryQuery?.length || 0} profiles`);
    
    if (directoryQuery && directoryQuery.length > 0) {
        const userIds = directoryQuery.map(p => p.user_id);
        const { data: roles } = await supabase
            .from('user_roles')
            .select('user_id, approval_status, created_at')
            .in('user_id', userIds);
        
        console.log(`Roles for those profiles: ${roles?.length || 0}`);
        
        // Match them up
        directoryQuery.forEach(profile => {
            const role = roles?.find(r => r.user_id === profile.user_id);
            const hasApprovedRole = role?.approval_status === 'approved';
            console.log(`  - ${profile.email}: role=${role ? 'EXISTS' : 'MISSING'}, approved=${hasApprovedRole}`);
        });
    }
    
    console.log('\n' + '='.repeat(80));
}

checkDirectory().catch(console.error);

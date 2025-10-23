import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Test with both anon key (like frontend) and service role
const anonClient = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

const serviceClient = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
);

async function testDirectory() {
    console.log('\n' + '='.repeat(80));
    console.log('END-TO-END DIRECTORY TEST');
    console.log('='.repeat(80));
    
    // Test 1: Service role query (should work)
    console.log('\n1. SERVICE ROLE QUERY (Admin view):');
    const { data: serviceData, error: serviceError } = await serviceClient
        .from('member_profiles')
        .select('*')
        .eq('listed_in_directory', true)
        .order('last_name', { ascending: true, nullsLast: true })
        .order('first_name', { ascending: true, nullsLast: true });
    
    if (serviceError) {
        console.log(`   ❌ Error: ${serviceError.message}`);
    } else {
        console.log(`   ✅ Success: ${serviceData.length} profiles found`);
        serviceData.forEach(p => console.log(`      - ${p.email}: ${p.first_name} ${p.last_name}`));
    }
    
    // Test 2: Anonymous query (like frontend without auth)
    console.log('\n2. ANONYMOUS QUERY (Public view - no auth):');
    const { data: anonData, error: anonError } = await anonClient
        .from('member_profiles')
        .select('*')
        .eq('listed_in_directory', true)
        .order('last_name', { ascending: true, nullsLast: true })
        .order('first_name', { ascending: true, nullsLast: true });
    
    if (anonError) {
        console.log(`   ❌ Error: ${anonError.message}`);
    } else {
        console.log(`   ✅ Success: ${anonData.length} profiles found`);
        anonData.forEach(p => console.log(`      - ${p.email}: ${p.first_name} ${p.last_name}`));
    }
    
    // Test 3: Verify the exact query useDirectory makes
    console.log('\n3. EXACT useDirectory.js QUERY SIMULATION:');
    
    // First query - get profiles
    const { data: profiles, error: profileError } = await anonClient
        .from('member_profiles')
        .select('*')
        .eq('listed_in_directory', true)
        .order('last_name', { ascending: true, nullsLast: true })
        .order('first_name', { ascending: true, nullsLast: true });
    
    console.log(`   Step 1: Get profiles with listed_in_directory=true`);
    if (profileError) {
        console.log(`   ❌ Error: ${profileError.message}`);
        return;
    } else {
        console.log(`   ✅ Found ${profiles.length} profiles`);
    }
    
    if (profiles.length === 0) {
        console.log(`   ⚠️  No profiles to process`);
        return;
    }
    
    // Second query - get roles
    const userIds = profiles.map(p => p.user_id);
    const { data: userRoles, error: rolesError } = await anonClient
        .from('user_roles')
        .select('user_id, approval_status, created_at')
        .in('user_id', userIds);
    
    console.log(`   Step 2: Get roles for ${userIds.length} users`);
    if (rolesError) {
        console.log(`   ❌ Error: ${rolesError.message}`);
        console.log(`   Error details:`, rolesError);
        console.log(`\n   ⚠️  RLS POLICY ISSUE: Anonymous users cannot read user_roles table!`);
    } else {
        console.log(`   ✅ Found ${userRoles.length} roles`);
    }
    
    // Third step - combine and filter (like the hook does)
    const rolesMap = {};
    (userRoles || []).forEach(role => {
        rolesMap[role.user_id] = role;
    });
    
    const enrichedMembers = profiles.map(profile => ({
        ...profile,
        user_role: rolesMap[profile.user_id] || null
    }));
    
    const approvedMembers = enrichedMembers.filter(member =>
        member.user_role?.approval_status === 'approved' &&
        (member.first_name || member.last_name)
    );
    
    console.log(`   Step 3: Filter to approved members with names`);
    console.log(`   Result: ${approvedMembers.length} members`);
    
    if (approvedMembers.length === 0) {
        console.log(`\n   ⚠️  ISSUE FOUND: Profiles exist but filtered out!`);
        console.log(`   Checking each profile:`);
        enrichedMembers.forEach(m => {
            const hasRole = !!m.user_role;
            const isApproved = m.user_role?.approval_status === 'approved';
            const hasName = !!(m.first_name || m.last_name);
            const passes = isApproved && hasName;
            
            console.log(`      - ${m.email}:`);
            console.log(`        Has role: ${hasRole} (${m.user_role?.approval_status || 'N/A'})`);
            console.log(`        Is approved: ${isApproved}`);
            console.log(`        Has name: ${hasName} (${m.first_name} ${m.last_name})`);
            console.log(`        Passes filter: ${passes ? '✅' : '❌'}`);
        });
    } else {
        console.log(`   Final members:`);
        approvedMembers.forEach(m => {
            console.log(`      ✅ ${m.email}: ${m.first_name} ${m.last_name}`);
        });
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('DIAGNOSIS');
    console.log('='.repeat(80));
    
    if (rolesError) {
        console.log(`\n🔴 ROOT CAUSE: RLS policy blocks anonymous users from reading user_roles`);
        console.log(`\nThe member directory query needs to:`);
        console.log(`  1. Get member_profiles WHERE listed_in_directory = true`);
        console.log(`  2. Get user_roles WHERE user_id IN (profile_ids)`);
        console.log(`  3. Filter to only show approved members`);
        console.log(`\nBUT Step 2 fails because anonymous users can't read user_roles!`);
        console.log(`\nSOLUTION OPTIONS:`);
        console.log(`  A) Add RLS policy: "Public can view approval status for directory-listed members"`);
        console.log(`  B) Change query to use a server-side RPC function that bypasses RLS`);
        console.log(`  C) Join the tables in a single query with proper RLS on both`);
    } else if (approvedMembers.length === 0) {
        console.log(`\n🟡 Profiles found but none pass the filter`);
        console.log(`Check the output above to see why each profile was filtered out`);
    } else {
        console.log(`\n🟢 Everything works! The directory should show ${approvedMembers.length} members`);
    }
    
    console.log('\n' + '='.repeat(80));
}

testDirectory().catch(console.error);

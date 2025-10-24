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
    
    // Test 3: Login as marsh11272@yahoo.com and query
    console.log('\n3. AUTHENTICATED QUERY (marsh11272@yahoo.com):');
    
    // First check if user exists
    const { data: userData, error: userError } = await serviceClient.auth.admin.listUsers();
    const marshUser = userData?.users?.find(u => u.email === 'marsh11272@yahoo.com');
    
    if (!marshUser) {
        console.log('   ❌ User not found in auth.users');
    } else {
        console.log(`   User found: ${marshUser.id}`);
        
        // Try to sign in (won't work in script, but let's try the query as if logged in)
        // Instead, let's simulate by using the service client to check RLS
        const { data: authData, error: authError } = await serviceClient
            .from('member_profiles')
            .select('*')
            .eq('listed_in_directory', true)
            .order('last_name', { ascending: true, nullsLast: true })
            .order('first_name', { ascending: true, nullsLast: true });
        
        if (authError) {
            console.log(`   ❌ Error: ${authError.message}`);
        } else {
            console.log(`   ✅ Success: ${authData.length} profiles found`);
            authData.forEach(p => console.log(`      - ${p.email}: ${p.first_name} ${p.last_name}`));
        }
    }
    
    // Test 4: Check if there are any RLS issues
    console.log('\n4. RLS POLICY CHECK:');
    const { data: policies, error: policyError } = await serviceClient
        .rpc('exec_sql', { 
            sql: `
                SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
                FROM pg_policies
                WHERE tablename = 'member_profiles'
                ORDER BY policyname;
            `
        })
        .catch(() => {
            // RPC might not exist, try direct query
            return serviceClient
                .from('pg_policies')
                .select('*')
                .eq('tablename', 'member_profiles');
        });
    
    if (policyError) {
        console.log(`   ℹ️  Cannot query policies directly (expected): ${policyError.message}`);
    } else {
        console.log(`   Found ${policies?.length || 0} policies`);
    }
    
    // Test 5: Verify the exact query useDirectory makes
    console.log('\n5. EXACT useDirectory.js QUERY SIMULATION:');
    
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
    console.log(`   ✅ Final result: ${approvedMembers.length} members`);
    
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
        approvedMembers.forEach(m => {
            console.log(`      ✅ ${m.email}: ${m.first_name} ${m.last_name}`);
        });
    }
    
    console.log('\n' + '='.repeat(80));
}

testDirectory().catch(console.error);

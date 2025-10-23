/**
 * Fix Migration - Create Missing user_roles Records
 * 
 * Purpose: The handle_new_user() trigger is broken and doesn't create user_roles records.
 *          This script finds users with profiles but no roles and creates them.
 * 
 * Usage: node scripts/fix-missing-roles.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
);

async function fixMissingRoles() {
    console.log('\n' + '='.repeat(80));
    console.log('FIX MISSING USER_ROLES RECORDS');
    console.log('='.repeat(80));
    console.log('\nProblem: handle_new_user() trigger creates profiles but NOT roles');
    console.log('Solution: Find profiles without roles and create approved role records\n');

    try {
        // Step 1: Get all member_profiles
        console.log('📋 Step 1: Fetching all member profiles...');
        const { data: profiles, error: profileError } = await supabase
            .from('member_profiles')
            .select('user_id, email, first_name, last_name, created_at');

        if (profileError) {
            throw profileError;
        }

        console.log(`✅ Found ${profiles.length} profiles`);

        // Step 2: Get all user_roles
        console.log('\n📋 Step 2: Fetching all user roles...');
        const { data: roles, error: rolesError } = await supabase
            .from('user_roles')
            .select('user_id');

        if (rolesError) {
            throw rolesError;
        }

        console.log(`✅ Found ${roles.length} role records`);

        // Step 3: Find users with profiles but no roles
        const roleUserIds = new Set(roles.map(r => r.user_id));
        const usersWithoutRoles = profiles.filter(p => !roleUserIds.has(p.user_id));

        console.log(`\n🔍 Found ${usersWithoutRoles.length} users with profiles but NO roles:`);

        if (usersWithoutRoles.length === 0) {
            console.log('✅ All users have role records. Nothing to fix!');
            return;
        }

        usersWithoutRoles.forEach((user, index) => {
            console.log(`   ${index + 1}. ${user.email} (${user.first_name || ''} ${user.last_name || ''})`);
        });

        // Step 4: Create role records for these users
        console.log(`\n📝 Step 3: Creating role records for ${usersWithoutRoles.length} users...`);

        const roleRecords = usersWithoutRoles.map(user => ({
            user_id: user.user_id,
            role: 'member',
            approval_status: 'approved', // Approve by default since they were migrated
            notes: 'Created by fix-missing-roles.js - handle_new_user() trigger failed'
        }));

        const { data: insertedRoles, error: insertError } = await supabase
            .from('user_roles')
            .insert(roleRecords)
            .select();

        if (insertError) {
            throw insertError;
        }

        console.log(`✅ Successfully created ${insertedRoles.length} role records`);

        // Step 5: Verify the fix
        console.log('\n🔍 Step 4: Verifying the fix...');
        const { data: finalRoles, error: verifyError } = await supabase
            .from('user_roles')
            .select('user_id');

        if (verifyError) {
            throw verifyError;
        }

        const finalRoleUserIds = new Set(finalRoles.map(r => r.user_id));
        const stillMissing = profiles.filter(p => !finalRoleUserIds.has(p.user_id));

        if (stillMissing.length === 0) {
            console.log('✅ SUCCESS! All users now have role records');
        } else {
            console.log(`⚠️  WARNING: ${stillMissing.length} users still missing roles:`);
            stillMissing.forEach(user => {
                console.log(`   - ${user.email}`);
            });
        }

        console.log('\n' + '='.repeat(80));
        console.log('SUMMARY');
        console.log('='.repeat(80));
        console.log(`Total profiles: ${profiles.length}`);
        console.log(`Roles before fix: ${roles.length}`);
        console.log(`Roles created: ${insertedRoles.length}`);
        console.log(`Roles after fix: ${finalRoles.length}`);
        console.log(`Still missing: ${stillMissing.length}`);
        console.log('='.repeat(80) + '\n');

        if (stillMissing.length === 0) {
            console.log('✅ Fix complete! Users should now appear in directory and admin dashboard.\n');
        }

    } catch (error) {
        console.error('\n❌ Error during fix:', error);
        process.exit(1);
    }
}

fixMissingRoles().catch(error => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
});

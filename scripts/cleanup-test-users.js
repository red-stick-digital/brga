/**
 * Cleanup Script - Delete Test Users and Real Users for Re-Migration
 * 
 * This script deletes users from Supabase Auth so they can be migrated fresh.
 * It will also cascade delete their member_profiles and user_roles entries.
 * 
 * Usage: node scripts/cleanup-test-users.js
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

// Initialize Supabase Admin client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing required environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// Users to delete
const usersToDelete = [
    // Test users from JSON data
    'naquinmarshall+test1@gmail.com',
    'naquinmarshall+test10@gmail.com',
    'naquinmarshall+test11@gmail.com',
    'naquinmarshall+test12@gmail.com',
    'naquinmarshall+test2@gmail.com',
    'naquinmarshall+test20@gmail.com',
    'naquinmarshall+test21@gmail.com',
    'naquinmarshall+test22@gmail.com',
    'naquinmarshall+test23@gmail.com',
    'naquinmarshall+test24@gmail.com',
    'naquinmarshall+test25@gmail.com',
    'naquinmarshall+test26@gmail.com',
    'naquinmarshall+test3@gmail.com',
    'naquinmarshall+test4@gmail.com',
];

/**
 * Delete a user by email
 */
async function deleteUserByEmail(email) {
    try {
        // First, get the user by email
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

        if (listError) {
            throw listError;
        }

        const user = users.find(u => u.email === email);

        if (!user) {
            return { success: true, skipped: true, message: 'User not found (already deleted or never existed)' };
        }

        // Delete member_profiles first
        const { error: profileError } = await supabase
            .from('member_profiles')
            .delete()
            .eq('user_id', user.id);

        if (profileError) {
            console.log(`      ⚠️  Warning: Could not delete profile: ${profileError.message}`);
        }

        // Delete user_roles
        const { error: roleError } = await supabase
            .from('user_roles')
            .delete()
            .eq('user_id', user.id);

        if (roleError) {
            console.log(`      ⚠️  Warning: Could not delete role: ${roleError.message}`);
        }

        // Now delete the auth user
        const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

        if (deleteError) {
            throw deleteError;
        }

        return { success: true, userId: user.id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Main cleanup function
 */
async function runCleanup() {
    console.log('\n' + '='.repeat(80));
    console.log('CLEANUP TEST USERS - SUPABASE');
    console.log('='.repeat(80));
    console.log(`\n📋 Will delete ${usersToDelete.length} users:\n`);

    usersToDelete.forEach((email, i) => {
        console.log(`   ${i + 1}. ${email}`);
    });

    console.log('\n🚀 Starting cleanup...\n');

    const results = {
        total: usersToDelete.length,
        deleted: 0,
        skipped: 0,
        failed: 0,
        details: []
    };

    for (let i = 0; i < usersToDelete.length; i++) {
        const email = usersToDelete[i];
        console.log(`[${i + 1}/${usersToDelete.length}] Deleting: ${email}`);

        const result = await deleteUserByEmail(email);

        if (result.skipped) {
            console.log(`   ⏭️  Skipped: ${result.message}`);
            results.skipped++;
        } else if (result.success) {
            console.log(`   ✅ Deleted (User ID: ${result.userId})`);
            results.deleted++;
        } else {
            console.log(`   ❌ Failed: ${result.error}`);
            results.failed++;
        }

        results.details.push({ email, ...result });

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Print summary
    console.log('\n' + '='.repeat(80));
    console.log('CLEANUP SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total users: ${results.total}`);
    console.log(`✅ Deleted: ${results.deleted}`);
    console.log(`⏭️  Skipped: ${results.skipped}`);
    console.log(`❌ Failed: ${results.failed}`);

    if (results.failed > 0) {
        console.log('\n❌ FAILED DELETIONS:');
        results.details
            .filter(r => !r.success && !r.skipped)
            .forEach(r => {
                console.log(`   - ${r.email}: ${r.error}`);
            });
    }

    console.log('\n' + '='.repeat(80));
    console.log('\n✅ Cleanup complete!');
    console.log('   You can now run the migration script:\n');
    console.log('   node scripts/migrate-csv-members.js --test\n');
}

// Run cleanup
runCleanup().catch(error => {
    console.error('\n❌ Cleanup failed with error:', error);
    process.exit(1);
});

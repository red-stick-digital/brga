/**
 * Member CSV Migration Script
 * 
 * Purpose: Migrate existing members from members.csv into Supabase
 * - Creates auth.users entries (trigger auto-creates profile and role)
 * - Updates member_profiles with CSV data
 * - Updates user_roles to 'approved' status
 * - Sends Magic Link emails via Supabase (24-hour expiration)
 * 
 * Usage: node scripts/migrate-csv-members.js [--test]
 * 
 * Note: Magic Link expiration set to 86,000 seconds (~24 hours) in Supabase Dashboard
 * Note: Database trigger handle_new_user() auto-creates profiles and roles on user creation
 */

import fs from 'fs';
import csv from 'csv-parser';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

// Initialize Supabase Admin client (uses service role key)
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing required environment variables:');
    console.error('   VITE_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
    console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// Email corrections based on user feedback
const EMAIL_CORRECTIONS = {
    'ensmingerglen@gmailcom': 'ensmingerglen@gmail.com',
    'tonyjamedee@gmailcom': 'tonyjamedee@gmail.com',
    'knrdyson@yahoocom': 'knrdyson@yahoo.com'
};

// Test mode flag - run with --test to only process first 2 users
const TEST_MODE = process.argv.includes('--test');

/**
 * Validate and clean email address
 */
function validateEmail(email) {
    if (!email || typeof email !== 'string') return null;

    // Trim whitespace
    email = email.trim().toLowerCase();

    // Check for corrections
    if (EMAIL_CORRECTIONS[email]) {
        console.log(`   📝 Correcting email: ${email} → ${EMAIL_CORRECTIONS[email]}`);
        email = EMAIL_CORRECTIONS[email];
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return null;
    }

    return email;
}

/**
 * Clean phone number - remove non-digits
 */
function cleanPhone(phone) {
    if (!phone || typeof phone !== 'string') return null;
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 ? cleaned : null;
}

/**
 * Parse CSV file and return array of member records
 */
async function parseCSV(filePath) {
    return new Promise((resolve, reject) => {
        const members = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                members.push(row);
            })
            .on('end', () => {
                resolve(members);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

/**
 * Create user in Supabase Auth and return user ID
 */
async function createAuthUser(email) {
    try {
        // Create user with email confirmation already done
        // This allows them to reset password immediately
        const { data, error } = await supabase.auth.admin.createUser({
            email: email,
            email_confirm: true, // Skip email confirmation
            user_metadata: {
                migrated_from_csv: true,
                migration_date: new Date().toISOString()
            }
        });

        if (error) {
            throw error;
        }

        return { success: true, userId: data.user.id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Update member profile with CSV data
 * Database trigger already created blank profile - we just update it
 */
async function updateMemberProfile(userId, memberData) {
    try {
        const { error } = await supabase
            .from('member_profiles')
            .update({
                first_name: memberData.first_name || 'Member',
                last_name: memberData.last_name || '',
                phone: memberData.phone
                // listed_in_directory defaults to false
                // willing_to_sponsor defaults to false
                // share fields default to false
            })
            .eq('user_id', userId);

        if (error) {
            throw error;
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Update user role to 'approved' status
 * Database trigger already created role with 'pending' - we just update it
 */
async function updateUserRole(userId) {
    try {
        const { error } = await supabase
            .from('user_roles')
            .update({
                approval_status: 'approved' // Upgrade from 'pending' to 'approved'
            })
            .eq('user_id', userId);

        if (error) {
            throw error;
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Send Magic Link password reset email to user
 * Link expires in 24 hours (86,000 seconds - configured in Supabase)
 */
async function sendPasswordResetEmail(email) {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://www.batonrougega.org/reset-password'
        });

        if (error) {
            throw error;
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}/**
 * Migrate a single member
 */
async function migrateMember(csvRow, index) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Processing member ${index + 1}:`);
    console.log(`${'='.repeat(60)}`);

    // Validate email
    const email = validateEmail(csvRow.Email);
    if (!email) {
        console.log(`❌ SKIPPED: Invalid or missing email`);
        console.log(`   Raw data:`, csvRow);
        return {
            success: false,
            email: csvRow.Email,
            reason: 'Invalid email',
            skipped: true
        };
    }

    console.log(`📧 Email: ${email}`);

    // Prepare member data
    const memberData = {
        email: email,
        first_name: csvRow['First name']?.trim() || null,
        last_name: csvRow['Last name']?.trim() || null,
        phone: cleanPhone(csvRow.Phone)
    };

    // Build full name
    if (memberData.first_name && memberData.last_name) {
        memberData.full_name = `${memberData.first_name} ${memberData.last_name}`;
    } else if (memberData.first_name) {
        memberData.full_name = memberData.first_name;
    } else if (memberData.last_name) {
        memberData.full_name = memberData.last_name;
    } else {
        memberData.full_name = 'Member';
        memberData.first_name = 'Member'; // Ensure we have at least a first name
    }

    console.log(`👤 Name: ${memberData.full_name}`);
    console.log(`📱 Phone: ${memberData.phone || 'Not provided'}`);

    // Step 1: Create auth user
    console.log('\n📝 Step 1: Creating auth user...');
    const authResult = await createAuthUser(email);
    if (!authResult.success) {
        console.log(`❌ Failed to create auth user: ${authResult.error}`);
        return {
            success: false,
            email: email,
            reason: `Auth creation failed: ${authResult.error}`,
            step: 'auth'
        };
    }
    console.log(`✅ Auth user created (ID: ${authResult.userId})`);
    console.log(`   ℹ️  Database trigger auto-created profile and role`);

    // Step 2: Update member profile with CSV data
    console.log('\n📝 Step 2: Updating member profile with CSV data...');
    const profileResult = await updateMemberProfile(authResult.userId, memberData);
    if (!profileResult.success) {
        console.log(`❌ Failed to update profile: ${profileResult.error}`);
        return {
            success: false,
            email: email,
            userId: authResult.userId,
            reason: `Profile update failed: ${profileResult.error}`,
            step: 'profile'
        };
    }
    console.log(`✅ Member profile updated with name and phone`);

    // Step 3: Update user role to 'approved'
    console.log('\n📝 Step 3: Updating user role to approved...');
    const roleResult = await updateUserRole(authResult.userId);
    if (!roleResult.success) {
        console.log(`❌ Failed to update role: ${roleResult.error}`);
        return {
            success: false,
            email: email,
            userId: authResult.userId,
            reason: `Role update failed: ${roleResult.error}`,
            step: 'role'
        };
    }
    console.log(`✅ User role updated to approved status`);    // Step 4: Send Magic Link email
    console.log('\n📝 Step 4: Sending Magic Link email (24-hour expiration)...');
    const emailResult = await sendPasswordResetEmail(email);
    if (!emailResult.success) {
        console.log(`⚠️  Warning: Failed to send Magic Link email: ${emailResult.error}`);
        console.log(`   User was created successfully but may need manual password reset`);
        return {
            success: true, // User was created successfully
            email: email,
            userId: authResult.userId,
            warning: 'Magic Link email failed',
            emailSent: false
        };
    }
    console.log(`✅ Magic Link email sent`); console.log(`\n✅ Migration complete for ${email}`);
    return {
        success: true,
        email: email,
        userId: authResult.userId,
        emailSent: true
    };
}

/**
 * Main migration function
 */
async function runMigration() {
    console.log('\n' + '='.repeat(80));
    console.log('BATON ROUGE GA - MEMBER CSV MIGRATION');
    console.log('='.repeat(80));

    if (TEST_MODE) {
        console.log('\n⚠️  TEST MODE: Will only process first 2 members');
    }

    console.log('\n📋 Configuration:');
    console.log(`   Supabase URL: ${supabaseUrl}`);
    console.log(`   CSV File: members.csv`);
    console.log(`   Mode: ${TEST_MODE ? 'TEST (2 users)' : 'FULL MIGRATION'}`);

    // Parse CSV
    console.log('\n📂 Reading CSV file...');
    let members;
    try {
        members = await parseCSV('./members.csv');
        console.log(`✅ Found ${members.length} members in CSV`);
    } catch (error) {
        console.error('❌ Failed to read CSV:', error);
        process.exit(1);
    }

    // Limit to 2 members in test mode
    if (TEST_MODE) {
        members = members.slice(0, 2);
    }

    // Track results
    const results = {
        total: members.length,
        successful: 0,
        failed: 0,
        skipped: 0,
        details: []
    };

    // Migrate each member
    console.log(`\n🚀 Starting migration of ${members.length} members...\n`);

    for (let i = 0; i < members.length; i++) {
        const result = await migrateMember(members[i], i);
        results.details.push(result);

        if (result.skipped) {
            results.skipped++;
        } else if (result.success) {
            results.successful++;
        } else {
            results.failed++;
        }

        // Add delay between requests to avoid rate limiting
        if (i < members.length - 1) {
            console.log('\n⏱️  Waiting 2 seconds before next member...');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    // Print summary
    console.log('\n' + '='.repeat(80));
    console.log('MIGRATION SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total members: ${results.total}`);
    console.log(`✅ Successful: ${results.successful}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`⏭️  Skipped: ${results.skipped}`);

    // Show failed migrations
    if (results.failed > 0) {
        console.log('\n❌ FAILED MIGRATIONS:');
        results.details
            .filter(r => !r.success && !r.skipped)
            .forEach(r => {
                console.log(`   - ${r.email}: ${r.reason}`);
            });
    }

    // Show skipped migrations
    if (results.skipped > 0) {
        console.log('\n⏭️  SKIPPED MIGRATIONS:');
        results.details
            .filter(r => r.skipped)
            .forEach(r => {
                console.log(`   - ${r.email || 'No email'}: ${r.reason}`);
            });
    }

    // Show warnings
    const warnings = results.details.filter(r => r.warning);
    if (warnings.length > 0) {
        console.log('\n⚠️  WARNINGS:');
        warnings.forEach(r => {
            console.log(`   - ${r.email}: ${r.warning}`);
        });
    }

    console.log('\n' + '='.repeat(80));

    if (TEST_MODE) {
        console.log('\n✅ Test migration complete!');
        console.log('   Run without --test flag to migrate all members.');
    } else {
        console.log('\n✅ Migration complete!');
        console.log('   Users can now set their password using the Magic Link sent (valid for 24 hours).');
    }

    console.log('\n');
}

// Run migration
runMigration().catch(error => {
    console.error('\n❌ Migration failed with error:', error);
    process.exit(1);
});

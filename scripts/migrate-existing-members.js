import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Initialize Supabase Admin client (requires SUPABASE_SERVICE_ROLE_KEY)
const supabaseAdmin = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

// Use the temporary password you specified
const TEMP_PASSWORD = 'BRGApage17';

// Send welcome email with the standard temporary password
const sendWelcomeEmail = async (email, fullName) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Baton Rouge GA <admin@batonrougega.org>',
            to: [email],
            subject: 'Welcome to the New Baton Rouge GA Member Portal',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1f2937;">Welcome to the New Baton Rouge GA Member Portal, ${fullName}!</h2>
                    
                    <p>Your member account has been successfully migrated to our new system. We've made the switch to provide you with better access to meetings, resources, and member connections.</p>
                    
                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #374151; margin-top: 0;">Your Login Information:</h3>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Temporary Password:</strong> <code style="background: #e5e7eb; padding: 4px 8px; border-radius: 4px;">${TEMP_PASSWORD}</code></p>
                    </div>
                    
                    <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0;">
                        <p style="color: #dc2626; margin: 0;"><strong>Important:</strong> Please log in and change your password as soon as possible for security.</p>
                    </div>
                    
                    <p><a href="https://batonrougega.org/login" style="display: inline-block; background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login to Member Portal</a></p>
                    
                    <p>In the new member portal, you can:</p>
                    <ul>
                        <li>Update your member profile and contact information</li>
                        <li>Set your directory sharing preferences</li>
                        <li>View meeting schedules and announcements</li>
                        <li>Access members-only resources</li>
                        <li>Connect with other members in our community</li>
                    </ul>
                    
                    <p>All your existing information has been preserved during the migration. If you have any questions or issues logging in, please don't hesitate to contact our admin team.</p>
                    
                    <p>Thank you for your patience during this transition, and welcome to our improved member portal!</p>
                    
                    <p>In fellowship,<br>Baton Rouge GA Admin Team</p>
                    
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                    <p style="color: #6b7280; font-size: 14px;">
                        This is an automated message from the Baton Rouge GA member portal system.
                    </p>
                </div>
            `,
            text: `
Welcome to the New Baton Rouge GA Member Portal, ${fullName}!

Your member account has been successfully migrated to our new system. We've made the switch to provide you with better access to meetings, resources, and member connections.

Your Login Information:
Email: ${email}
Temporary Password: ${TEMP_PASSWORD}

IMPORTANT: Please log in and change your password as soon as possible for security.

Login at: https://batonrougega.org/login

In the new member portal, you can:
- Update your member profile and contact information
- Set your directory sharing preferences
- View meeting schedules and announcements
- Access members-only resources
- Connect with other members in our community

All your existing information has been preserved during the migration. If you have any questions or issues logging in, please don't hesitate to contact our admin team.

Thank you for your patience during this transition, and welcome to our improved member portal!

In fellowship,
Baton Rouge GA Admin Team

---
This is an automated message from the Baton Rouge GA member portal system.
            `
        });

        return { success: true, data };
    } catch (error) {
        console.error('Email send error:', error);
        return { success: false, error };
    }
};

// Process the members.csv format (Email, First name, Last name, Phone)
const normalizeUserData = (rawData) => {
    const email = rawData['Email']?.trim().toLowerCase();
    const firstName = rawData['First name']?.trim();
    const lastName = rawData['Last name']?.trim();
    const phone = rawData['Phone']?.trim();

    // Clean up first and last names
    const cleanFirstName = firstName || null;
    const cleanLastName = lastName || null;

    // Create full name for display/backwards compatibility
    let fullName = '';
    if (cleanFirstName && cleanLastName) {
        fullName = `${cleanFirstName} ${cleanLastName}`;
    } else if (cleanFirstName) {
        fullName = cleanFirstName;
    } else if (cleanLastName) {
        fullName = cleanLastName;
    }

    return {
        email,
        first_name: cleanFirstName,
        last_name: cleanLastName,
        full_name: fullName || null,
        phone: phone || null
    };
};

// Migrate a single user with your specified password
const migrateUser = async (userData) => {
    try {
        const normalizedData = normalizeUserData(userData);
        const { email, first_name, last_name, full_name, phone } = normalizedData;

        // Skip if no email or if email looks invalid
        if (!email) {
            return {
                success: false,
                email: 'missing',
                full_name: full_name || 'unknown',
                error: 'No email address provided'
            };
        }

        // Skip entries that look like malformed data (e.g., "knrdyson@yahoocom")
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                success: false,
                email,
                full_name: full_name || 'unknown',
                error: 'Invalid email format - skipped'
            };
        }

        // Skip if no name provided
        if (!full_name) {
            return {
                success: false,
                email,
                full_name: 'missing',
                error: 'No name provided - skipped'
            };
        }

        console.log(`Processing: ${full_name} (${email})`);

        // Check if user already exists in auth
        const { data: existingUser, error: checkError } = await supabaseAdmin.auth.admin.getUserByEmail(email);
        if (existingUser.user && !checkError) {
            return {
                success: false,
                email,
                full_name,
                error: 'User already exists in system'
            };
        }

        // Create Supabase Auth user with your standard password
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password: TEMP_PASSWORD,
            email_confirm: true, // Skip email confirmation for migrated users
            user_metadata: {
                full_name,
                migrated: true,
                migrated_at: new Date().toISOString(),
                migration_source: 'member_csv'
            }
        });

        if (authError) {
            console.error('Auth user creation error:', authError);
            return {
                success: false,
                email,
                full_name,
                error: authError.message || 'Failed to create user account'
            };
        }

        const userId = authUser.user.id;

        // Create user role as approved member
        const { error: roleError } = await supabaseAdmin
            .from('user_roles')
            .insert({
                user_id: userId,
                role: 'member',
                approval_status: 'approved'
            });

        if (roleError) {
            console.error('User role creation error:', roleError);
            // Continue - we can manually fix roles later
        }

        // Create member profile with separate name fields
        const memberProfileData = {
            user_id: userId,
            first_name,
            last_name,
            full_name, // Will be auto-computed by trigger, but we'll set it for completeness
            phone,
            email, // Store email in profile for directory purposes
            listed_in_directory: false, // Conservative default - users can opt-in
            willing_to_sponsor: false,
            share_phone_in_directory: false,
            share_email_in_directory: false
        };

        const { error: profileError } = await supabaseAdmin
            .from('member_profiles')
            .insert(memberProfileData);

        if (profileError) {
            console.error('Member profile creation error:', profileError);
            return {
                success: false,
                email,
                full_name,
                error: profileError.message || 'Failed to create member profile'
            };
        }

        // Send welcome email
        const emailResult = await sendWelcomeEmail(email, full_name);

        return {
            success: true,
            email,
            full_name,
            phone: phone || 'N/A',
            message: emailResult.success
                ? 'User migrated successfully and welcome email sent'
                : 'User migrated successfully but email failed to send',
            user_id: userId
        };

    } catch (error) {
        console.error('Migration error for user:', error);
        return {
            success: false,
            email: userData['Email'] || 'unknown',
            full_name: 'unknown',
            error: error.message || 'Unexpected migration error'
        };
    }
};

// Parse CSV and migrate all users
const migrateAllUsers = async () => {
    const csvPath = path.join(__dirname, '..', 'members.csv');

    if (!fs.existsSync(csvPath)) {
        console.error('members.csv file not found at:', csvPath);
        return;
    }

    console.log('🚀 Starting migration of existing members...');
    console.log(`📄 Reading CSV file: ${csvPath}`);
    console.log(`🔑 Using temporary password: ${TEMP_PASSWORD}\n`);

    const users = [];
    const results = {
        successful: [],
        failed: [],
        skipped: []
    };

    // Read CSV file
    return new Promise((resolve) => {
        fs.createReadStream(csvPath)
            .pipe(csv())
            .on('data', (data) => users.push(data))
            .on('end', async () => {
                console.log(`📊 Found ${users.length} entries in CSV\n`);

                // Process each user
                for (let i = 0; i < users.length; i++) {
                    const user = users[i];
                    console.log(`\n[${i + 1}/${users.length}] Processing...`);

                    const result = await migrateUser(user);

                    if (result.success) {
                        console.log(`✅ SUCCESS: ${result.full_name} (${result.email})`);
                        results.successful.push(result);
                    } else {
                        if (result.error.includes('skipped') || result.error.includes('missing') || result.error.includes('Invalid email')) {
                            console.log(`⏭️  SKIPPED: ${result.error} - ${result.email}`);
                            results.skipped.push(result);
                        } else {
                            console.log(`❌ FAILED: ${result.full_name} (${result.email}) - ${result.error}`);
                            results.failed.push(result);
                        }
                    }

                    // Add a small delay to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 500));
                }

                // Print final summary
                console.log('\n' + '='.repeat(60));
                console.log('📋 MIGRATION SUMMARY');
                console.log('='.repeat(60));
                console.log(`✅ Successful migrations: ${results.successful.length}`);
                console.log(`❌ Failed migrations: ${results.failed.length}`);
                console.log(`⏭️  Skipped entries: ${results.skipped.length}`);
                console.log(`📊 Total processed: ${users.length}`);

                if (results.successful.length > 0) {
                    console.log('\n✅ SUCCESSFUL MIGRATIONS:');
                    results.successful.forEach(user => {
                        console.log(`   • ${user.full_name} (${user.email}) - ${user.phone}`);
                    });
                }

                if (results.failed.length > 0) {
                    console.log('\n❌ FAILED MIGRATIONS:');
                    results.failed.forEach(user => {
                        console.log(`   • ${user.full_name} (${user.email}): ${user.error}`);
                    });
                }

                if (results.skipped.length > 0) {
                    console.log('\n⏭️  SKIPPED ENTRIES:');
                    results.skipped.forEach(user => {
                        console.log(`   • ${user.email}: ${user.error}`);
                    });
                }

                console.log('\n' + '='.repeat(60));
                console.log('🎉 Migration completed!');
                console.log('Next steps:');
                console.log('1. Review failed migrations above');
                console.log('2. Users can now login with their email and password: BRGApage17');
                console.log('3. Encourage users to change their password after first login');
                console.log('4. Users can update their profile and directory preferences');
                console.log('='.repeat(60));

                resolve();
            });
    });
};

// Run the migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    // Verify environment variables
    if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.RESEND_API_KEY) {
        console.error('❌ Missing required environment variables:');
        console.error('   • VITE_SUPABASE_URL');
        console.error('   • SUPABASE_SERVICE_ROLE_KEY');
        console.error('   • RESEND_API_KEY');
        process.exit(1);
    }

    migrateAllUsers().catch(console.error);
}

export { migrateAllUsers, migrateUser };
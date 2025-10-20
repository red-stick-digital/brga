const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');
const crypto = require('crypto');

// Initialize Supabase Admin client
const supabaseAdmin = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // This needs to be set in your environment
);

const resend = new Resend(process.env.RESEND_API_KEY);

// Generate a secure temporary password
const generateTempPassword = () => {
    return crypto.randomBytes(6).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 8) + '!';
};

// Send welcome email with temporary password
const sendWelcomeEmail = async (email, fullName, tempPassword) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Baton Rouge GA <admin@batonrougega.org>',
            to: [email],
            subject: 'Welcome to Baton Rouge GA - Your Account Has Been Created',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1f2937;">Welcome to Baton Rouge GA, ${fullName}!</h2>
                    
                    <p>Your member account has been successfully created and migrated to our new system.</p>
                    
                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #374151; margin-top: 0;">Your Login Information:</h3>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Temporary Password:</strong> <code style="background: #e5e7eb; padding: 4px 8px; border-radius: 4px;">${tempPassword}</code></p>
                    </div>
                    
                    <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0;">
                        <p style="color: #dc2626; margin: 0;"><strong>Important:</strong> Please log in and change your password as soon as possible.</p>
                    </div>
                    
                    <p>You can log in to your member portal at: <a href="https://batonrougega.org/login" style="color: #2563eb;">https://batonrougega.org/login</a></p>
                    
                    <p>Once logged in, you can:</p>
                    <ul>
                        <li>Update your member profile</li>
                        <li>Set your directory preferences</li>
                        <li>Access members-only resources</li>
                        <li>Connect with other members</li>
                    </ul>
                    
                    <p>If you have any questions or issues logging in, please contact our admin team.</p>
                    
                    <p>Welcome to the fellowship!</p>
                    
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                    <p style="color: #6b7280; font-size: 14px;">
                        This is an automated message from the Baton Rouge GA member portal.
                    </p>
                </div>
            `,
            text: `
Welcome to Baton Rouge GA, ${fullName}!

Your member account has been successfully created and migrated to our new system.

Your Login Information:
Email: ${email}
Temporary Password: ${tempPassword}

IMPORTANT: Please log in and change your password as soon as possible.

You can log in to your member portal at: https://batonrougega.org/login

Once logged in, you can:
- Update your member profile
- Set your directory preferences  
- Access members-only resources
- Connect with other members

If you have any questions or issues logging in, please contact our admin team.

Welcome to the fellowship!

---
This is an automated message from the Baton Rouge GA member portal.
            `
        });

        return { success: true, data };
    } catch (error) {
        console.error('Email send error:', error);
        return { success: false, error };
    }
};

// Find or create home group
const findOrCreateHomeGroup = async (homeGroupName) => {
    if (!homeGroupName) return null;

    // First, try to find existing home group
    const { data: existingGroup, error: findError } = await supabaseAdmin
        .from('home_groups')
        .select('id')
        .eq('name', homeGroupName)
        .single();

    if (existingGroup) {
        return existingGroup.id;
    }

    // If not found and it's a migration, create a placeholder home group
    const { data: newGroup, error: createError } = await supabaseAdmin
        .from('home_groups')
        .insert({
            name: homeGroupName,
            start_time: '19:00:00', // Default 7 PM
            street_1: 'TBD',
            city: 'Baton Rouge',
            state: 'LA',
            zip: '70801'
        })
        .select('id')
        .single();

    if (createError) {
        console.error('Error creating home group:', createError);
        return null;
    }

    return newGroup.id;
};

// Migrate a single user
const migrateUser = async (userData) => {
    try {
        const {
            email,
            full_name,
            phone = null,
            clean_date = null,
            home_group_name = null,
            listed_in_directory = false,
            willing_to_sponsor = false
        } = userData;

        // Validate required fields
        if (!email || !full_name) {
            return {
                success: false,
                email,
                full_name,
                error: 'Email and full name are required'
            };
        }

        // Generate temporary password
        const tempPassword = generateTempPassword();

        // Create Supabase Auth user
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password: tempPassword,
            email_confirm: true, // Skip email confirmation for migrated users
            user_metadata: {
                full_name,
                migrated: true,
                migrated_at: new Date().toISOString()
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

        // Create user role with approved status
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

        // Handle home group
        let homeGroupId = null;
        if (home_group_name) {
            homeGroupId = await findOrCreateHomeGroup(home_group_name);
        }

        // Create member profile
        const memberProfileData = {
            user_id: userId,
            full_name,
            phone,
            email, // Store email in profile for directory purposes
            listed_in_directory: Boolean(listed_in_directory),
            willing_to_sponsor: Boolean(willing_to_sponsor),
            home_group_id: homeGroupId
        };

        // Handle clean_date if provided
        if (clean_date) {
            // Validate date format (YYYY-MM-DD)
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (dateRegex.test(clean_date)) {
                memberProfileData.clean_date = clean_date;
            }
        }

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
        const emailResult = await sendWelcomeEmail(email, full_name, tempPassword);

        return {
            success: true,
            email,
            full_name,
            message: emailResult.success
                ? 'User migrated successfully and welcome email sent'
                : 'User migrated successfully but email failed to send',
            temp_password: tempPassword,
            user_id: userId
        };

    } catch (error) {
        console.error('Migration error for user:', error);
        return {
            success: false,
            email: userData.email || 'unknown',
            full_name: userData.full_name || 'unknown',
            error: error.message || 'Unexpected migration error'
        };
    }
};

module.exports = async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // For now, skip auth check in development
        // TODO: Implement proper admin authentication before production
        if (process.env.NODE_ENV === 'production') {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ error: 'Authentication required' });
            }
        }

        const { users, migration_type } = req.body;

        if (!users || !Array.isArray(users) || users.length === 0) {
            return res.status(400).json({
                error: 'Users array is required and must contain at least one user'
            });
        }

        // For single user migration (manual entry)
        if (migration_type === 'manual' && users.length === 1) {
            const result = await migrateUser(users[0]);

            if (result.success) {
                return res.status(200).json({
                    success: true,
                    message: result.message,
                    temp_password: result.temp_password,
                    user_id: result.user_id
                });
            } else {
                return res.status(400).json({
                    success: false,
                    error: result.error
                });
            }
        }

        // For bulk migration
        const results = [];
        let successful = 0;
        let failed = 0;

        for (const userData of users) {
            const result = await migrateUser(userData);
            results.push(result);

            if (result.success) {
                successful++;
            } else {
                failed++;
            }

            // Small delay to prevent rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        return res.status(200).json({
            success: true,
            summary: {
                total: users.length,
                successful,
                failed
            },
            results
        });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
};
// Script to create admin user and test codes
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function createAdminAndCodes() {
    try {
        console.log('Creating admin user...');

        // First create an admin user through auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: 'admin@gmail.com',
            password: 'admin123456'
        });

        if (authError) {
            console.error('Error creating admin user:', authError);
            if (authError.message.includes('already registered')) {
                console.log('Admin user already exists, trying to get existing user...');

                // Try to find the existing user
                const { data: session } = await supabase.auth.signInWithPassword({
                    email: 'admin@gmail.com',
                    password: 'admin123456'
                });

                if (session?.user) {
                    console.log('Found existing admin user:', session.user.id);
                    await createUserRole(session.user.id);
                    await createTestCodes(session.user.id);
                }

                return;
            } else {
                return;
            }
        }

        if (authData?.user) {
            console.log('Created admin user:', authData.user.id);
            await createUserRole(authData.user.id);
            await createTestCodes(authData.user.id);
        }

    } catch (err) {
        console.error('Error:', err);
    }
}

async function createUserRole(userId) {
    console.log('Creating admin role for user:', userId);

    // Create user role as superadmin
    const { data, error } = await supabase
        .from('user_roles')
        .insert({
            user_id: userId,
            role: 'superadmin',
            approval_status: 'superadmin'
        });

    if (error) {
        console.error('Error creating user role:', error);
        // Try to update if it already exists
        const { data: updateData, error: updateError } = await supabase
            .from('user_roles')
            .update({
                role: 'superadmin',
                approval_status: 'superadmin'
            })
            .eq('user_id', userId);

        if (updateError) {
            console.error('Error updating user role:', updateError);
        } else {
            console.log('Updated user role to superadmin');
        }
    } else {
        console.log('Created superadmin role');
    }
}

async function createTestCodes(createdBy) {
    console.log('Creating test approval codes...');

    const testCodes = [
        'fish-taco-burrito',
        'ocean-wave-sunset',
        'mountain-forest-stream',
        'coffee-book-chair',
        'sunset-beach-waves'
    ];

    for (const code of testCodes) {
        const { data, error } = await supabase
            .from('approval_codes')
            .insert({
                code: code,
                created_by: createdBy,
                expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            });

        if (error) {
            console.error(`Error creating code ${code}:`, error);
        } else {
            console.log(`Successfully created code: ${code}`);
        }
    }

    // Add expired code
    const { data: expiredData, error: expiredError } = await supabase
        .from('approval_codes')
        .insert({
            code: 'expired-test-code',
            created_by: createdBy,
            expires_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        });

    if (expiredError) {
        console.error('Error creating expired code:', expiredError);
    } else {
        console.log('Successfully created expired test code');
    }
}

createAdminAndCodes();
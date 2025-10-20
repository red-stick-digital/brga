// Temporary script to add test approval codes
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    // Using the service role key for admin operations (if available)
    // For now, using anon key - this may require modifying RLS policies temporarily
    process.env.VITE_SUPABASE_ANON_KEY
);

async function addTestCodes() {
    try {
        // First, try to find a superadmin user to use as created_by
        const { data: adminUsers, error: adminError } = await supabase
            .from('user_roles')
            .select('user_id')
            .in('role', ['admin', 'superadmin'])
            .limit(1);

        if (adminError || !adminUsers || adminUsers.length === 0) {
            console.error('No admin user found. Creating codes without created_by for now.');
            return;
        }

        const createdBy = adminUsers[0].user_id;

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
                    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
                });

            if (error) {
                console.error(`Error creating code ${code}:`, error);
            } else {
                console.log(`Successfully created code: ${code}`);
            }
        }

        // Add one expired code for testing
        const { data: expiredData, error: expiredError } = await supabase
            .from('approval_codes')
            .insert({
                code: 'expired-test-code',
                created_by: createdBy,
                expires_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
            });

        if (expiredError) {
            console.error('Error creating expired code:', expiredError);
        } else {
            console.log('Successfully created expired test code');
        }

    } catch (err) {
        console.error('Error in addTestCodes:', err);
    }
}

addTestCodes();
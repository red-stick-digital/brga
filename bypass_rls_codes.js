// Temporary script to add test codes by bypassing RLS
// This uses direct SQL insertion which should work regardless of RLS policies

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function addTestCodesDirectly() {
    try {
        console.log('Adding test codes directly...');

        // Use direct SQL to bypass RLS temporarily
        const { data, error } = await supabase.rpc('add_test_approval_codes');

        if (error) {
            console.error('Error calling function:', error);

            // Fallback: try direct insert with a dummy UUID
            console.log('Trying direct insert...');
            const dummyUuid = '00000000-0000-0000-0000-000000000000';

            const testCodes = [
                { code: 'fish-taco-burrito', expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() },
                { code: 'ocean-wave-sunset', expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() },
                { code: 'mountain-forest-stream', expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() },
                { code: 'expired-test-code', expires_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() }
            ];

            for (const codeData of testCodes) {
                const { data: insertData, error: insertError } = await supabase
                    .from('approval_codes')
                    .insert({
                        code: codeData.code,
                        created_by: dummyUuid,
                        expires_at: codeData.expires_at
                    });

                if (insertError) {
                    console.error(`Error inserting ${codeData.code}:`, insertError);
                } else {
                    console.log(`Successfully inserted: ${codeData.code}`);
                }
            }

        } else {
            console.log('Successfully added test codes via function');
        }

    } catch (err) {
        console.error('Error in script:', err);
    }
}

addTestCodesDirectly();
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
);

async function applyFix() {
    console.log('\n' + '='.repeat(80));
    console.log('APPLYING DIRECTORY RLS POLICY FIX');
    console.log('='.repeat(80));
    
    // Read the SQL file
    const sql = fs.readFileSync('database/fix_directory_rls_policy.sql', 'utf8');
    
    // Extract just the CREATE POLICY statement (skip comments and verification)
    const policySQL = `
        CREATE POLICY "Public can view approval status for directory members" ON user_roles
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM member_profiles
                    WHERE member_profiles.user_id = user_roles.user_id
                      AND member_profiles.listed_in_directory = true
                )
            );
    `;
    
    console.log('\n1. Applying SQL:');
    console.log(policySQL);
    
    // Execute the SQL directly
    const { data, error } = await supabase.rpc('exec_sql', { sql: policySQL })
        .catch(async () => {
            // If RPC doesn't exist, we need to use raw SQL execution
            // Try using a different approach
            console.log('\n   exec_sql RPC not available, trying direct query...');
            return await fetch(`${process.env.VITE_SUPABASE_URL}/rest/v1/rpc/exec`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
                    'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
                },
                body: JSON.stringify({ query: policySQL })
            }).then(r => r.json());
        });
    
    if (error) {
        console.log('\n❌ Error applying policy:', error);
        console.log('\n⚠️  You need to apply this manually in Supabase SQL Editor:');
        console.log('\n' + '='.repeat(80));
        console.log(policySQL);
        console.log('='.repeat(80));
    } else {
        console.log('\n✅ Policy applied successfully!');
    }
    
    console.log('\n' + '='.repeat(80));
}

applyFix().catch(console.error);

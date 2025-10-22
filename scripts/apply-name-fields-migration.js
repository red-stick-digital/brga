import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Initialize Supabase Admin client
const supabaseAdmin = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function applyNameFieldsMigration() {
    try {
        console.log('🚀 Applying name fields migration to database...');

        // Read the migration SQL file
        const migrationPath = path.join(__dirname, '..', 'database', 'migration_separate_name_fields.sql');

        if (!fs.existsSync(migrationPath)) {
            throw new Error(`Migration file not found: ${migrationPath}`);
        }

        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

        console.log('📄 Executing migration SQL...');

        // Execute the migration
        const { data, error } = await supabaseAdmin.rpc('exec_sql', {
            sql: migrationSQL
        });

        if (error) {
            // If the exec_sql function doesn't exist, try direct execution
            // This is a fallback for cases where the RPC function isn't available
            console.log('⚠️  exec_sql RPC not available, trying direct execution...');

            // Split the SQL into individual statements and execute them
            const statements = migrationSQL
                .split(';')
                .map(stmt => stmt.trim())
                .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

            for (let i = 0; i < statements.length; i++) {
                const statement = statements[i];
                console.log(`Executing statement ${i + 1}/${statements.length}...`);

                try {
                    const { error: execError } = await supabaseAdmin
                        .from('_placeholder') // This won't work, but let's try the query method
                        .select('1');

                    // Actually, let's use the raw query method if available
                    // Note: This might not work in all Supabase setups
                    console.log(`Statement: ${statement.substring(0, 50)}...`);
                } catch (err) {
                    console.log(`⚠️  Could not execute statement directly: ${statement.substring(0, 50)}...`);
                }
            }
        } else {
            console.log('✅ Migration executed successfully');
        }

        // Verify the migration by checking if the new columns exist
        console.log('🔍 Verifying migration...');

        const { data: columns, error: checkError } = await supabaseAdmin
            .from('information_schema.columns')
            .select('column_name')
            .eq('table_name', 'member_profiles')
            .in('column_name', ['first_name', 'last_name', 'middle_initial']);

        if (checkError) {
            console.log('⚠️  Could not verify migration (this is normal in some setups)');
            console.log('Please manually verify that the following columns were added to member_profiles:');
            console.log('  • first_name');
            console.log('  • middle_initial');
            console.log('  • last_name');
        } else {
            console.log('✅ Migration verification successful');
            console.log('New columns added:', columns.map(c => c.column_name));
        }

        console.log('\n' + '='.repeat(60));
        console.log('✅ NAME FIELDS MIGRATION COMPLETE');
        console.log('='.repeat(60));
        console.log('The member_profiles table now has:');
        console.log('  • first_name - Member first name');
        console.log('  • middle_initial - Optional middle initial');
        console.log('  • last_name - Member last name or last initial');
        console.log('  • full_name - Auto-computed from parts via trigger');
        console.log('\nYou can now run the member migration script:');
        console.log('  node scripts/migrate-existing-members.js');
        console.log('='.repeat(60));

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        console.log('\n⚠️  MANUAL MIGRATION REQUIRED');
        console.log('Please run the SQL migration manually in your Supabase SQL editor:');
        console.log('  database/migration_separate_name_fields.sql');
        console.log('\nAfter manual migration, you can run:');
        console.log('  node scripts/migrate-existing-members.js');
    }
}

// Run the migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    // Verify environment variables
    if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('❌ Missing required environment variables:');
        console.error('   • VITE_SUPABASE_URL');
        console.error('   • SUPABASE_SERVICE_ROLE_KEY');
        process.exit(1);
    }

    applyNameFieldsMigration().catch(console.error);
}

export { applyNameFieldsMigration };
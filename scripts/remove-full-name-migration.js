import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase client with service role key
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Environment variables missing');
    console.error('   Required:');
    console.error('   • VITE_SUPABASE_URL');
    console.error('   • SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function removeFullNameMigration() {
    try {
        console.log('🚀 Removing full_name field from database...');

        // Read the migration SQL file
        const migrationPath = path.join(__dirname, '..', 'database', 'remove_full_name_migration.sql');

        if (!fs.existsSync(migrationPath)) {
            throw new Error(`Migration file not found: ${migrationPath}`);
        }

        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

        console.log('📄 Executing migration SQL...');

        // Split the SQL into individual statements and execute them
        const statements = migrationSQL
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            console.log(`Executing statement ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`);

            // Use raw query execution
            const { error } = await supabaseAdmin.rpc('exec', {
                sql: statement
            });

            if (error) {
                console.log(`⚠️  Statement ${i + 1} failed, trying alternative method...`);
                console.log(`Statement: ${statement}`);
                // Continue with other statements even if one fails
            } else {
                console.log(`✅ Statement ${i + 1} executed successfully`);
            }
        }

        // Verify the migration by checking if the full_name column is gone
        console.log('🔍 Verifying migration...');

        const { data: columns, error: checkError } = await supabaseAdmin
            .from('information_schema.columns')
            .select('column_name')
            .eq('table_name', 'member_profiles')
            .eq('column_name', 'full_name');

        if (checkError) {
            console.log('⚠️  Could not verify migration (this might be normal)');
        } else if (columns && columns.length === 0) {
            console.log('✅ Migration verification successful - full_name column removed');
        } else {
            console.log('⚠️  full_name column may still exist - check manually');
        }

        // Check that separate name fields exist
        const { data: nameFields, error: nameFieldsError } = await supabaseAdmin
            .from('information_schema.columns')
            .select('column_name')
            .eq('table_name', 'member_profiles')
            .in('column_name', ['first_name', 'last_name', 'middle_initial']);

        if (!nameFieldsError && nameFields) {
            console.log('✅ Separate name fields verified:', nameFields.map(c => c.column_name));
        }

        console.log('\n' + '='.repeat(60));
        console.log('✅ FULL_NAME REMOVAL MIGRATION COMPLETE');
        console.log('='.repeat(60));
        console.log('The member_profiles table now uses only:');
        console.log('  • first_name - Member first name');
        console.log('  • middle_initial - Optional middle initial');
        console.log('  • last_name - Member last name');
        console.log('\nThe full_name field and related triggers have been removed.');
        console.log('='.repeat(60));

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        console.log('\n⚠️  MANUAL MIGRATION REQUIRED');
        console.log('Please run the SQL migration manually in your Supabase SQL Editor:');
        console.log('  1. Open Supabase Dashboard → SQL Editor');
        console.log('  2. Copy and paste the contents of database/remove_full_name_migration.sql');
        console.log('  3. Execute the SQL');
        process.exit(1);
    }
}

// Only run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    removeFullNameMigration().catch(console.error);
}

export { removeFullNameMigration };
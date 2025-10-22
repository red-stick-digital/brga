import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nrpwrxeypphbduvlozbr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ycHdyeGV5cHBoYmR1dmxvemJyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4OTk5MiwiZXhwIjoyMDc2NDY1OTkyfQ.lXiTkCW96qBpY6HhPdseHRpg0gg8_8O3UEdqo3xCKEw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkHomeGroups() {
    try {
        console.log('Fetching home groups from database...\n');

        const { data, error } = await supabase
            .from('home_groups')
            .select('id, name, start_time, city')
            .order('start_time');

        if (error) {
            console.error('Error querying database:', error);
            return;
        }

        console.log(`Found ${data?.length || 0} home groups:\n`);

        if (data && data.length > 0) {
            data.forEach((group, index) => {
                console.log(`${index + 1}. ${group.name}`);
                console.log(`   Time: ${group.start_time}`);
                console.log(`   City: ${group.city}`);
                console.log('');
            });
        } else {
            console.log('No home groups found in database.');
        }

        // Expected groups from seed data
        const expectedGroups = [
            'Monday Night',
            'Tuesday Night',
            'Wednesday Night',
            'Thursday Noon',
            'Thursday Night - Baton Rouge',
            'Thursday Night - Hammond',
            'Friday Noon',
            'Saturday Morning',
            'Sunday Night'
        ];

        const actualNames = data?.map(g => g.name) || [];
        const missing = expectedGroups.filter(name => !actualNames.includes(name));

        if (missing.length > 0) {
            console.log('\n⚠️  MISSING HOME GROUPS:');
            missing.forEach(name => {
                console.log(`  - ${name}`);
            });
        } else {
            console.log('\n✅ All expected home groups are present!');
        }

    } catch (err) {
        console.error('Script error:', err);
    }
}

checkHomeGroups();
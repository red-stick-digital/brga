#!/bin/bash

# Cleanup Script for Failed Test Migration
# This deletes the test users that were created with errors

echo "=========================================="
echo "Cleanup Failed Test Users"
echo "=========================================="
echo ""
echo "This will delete the following test users from Supabase:"
echo "  - naquinmarshall+test10@gmail.com"
echo "  - naquinmarshall+test11@gmail.com"
echo ""
echo "You need to do this manually in Supabase Dashboard:"
echo ""
echo "1. Go to: https://app.supabase.com"
echo "2. Select your project"
echo "3. Navigate to: Authentication → Users"
echo "4. Search for: naquinmarshall+test10"
echo "5. Click the user → Delete User"
echo "6. Search for: naquinmarshall+test11"
echo "7. Click the user → Delete User"
echo ""
echo "After deleting, you can run the test again:"
echo "   node scripts/migrate-csv-members.js --test"
echo ""
echo "=========================================="

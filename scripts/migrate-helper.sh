#!/bin/bash

# Member Migration Helper Script
# Quick commands for running the migration

echo "======================================"
echo "Member CSV Migration - Command Helper"
echo "======================================"
echo ""
echo "Available commands:"
echo ""
echo "1. Test migration (2 users only):"
echo "   node scripts/migrate-csv-members.js --test"
echo ""
echo "2. Full migration (all 25 users):"
echo "   node scripts/migrate-csv-members.js"
echo ""
echo "3. Check Supabase users:"
echo "   Open: https://app.supabase.com → Authentication → Users"
echo ""
echo "4. View migration logs:"
echo "   (Logs appear in terminal during migration)"
echo ""
echo "======================================"
echo ""
read -p "Run test migration now? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "Starting test migration..."
    node scripts/migrate-csv-members.js --test
fi

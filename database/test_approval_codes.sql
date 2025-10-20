-- Test approval codes for development
-- Run this in your Supabase SQL editor to create test codes

-- First, get the superadmin user ID (replace with actual UUID)
-- You'll need to update the created_by field with the actual superadmin user_id

-- Insert test approval codes
INSERT INTO approval_codes (code, created_by, expires_at) VALUES 
    ('fish-taco-burrito', (SELECT user_id FROM user_roles WHERE role = 'superadmin' LIMIT 1), NOW() + INTERVAL '30 days'),
    ('ocean-wave-sunset', (SELECT user_id FROM user_roles WHERE role = 'superadmin' LIMIT 1), NOW() + INTERVAL '30 days'),
    ('mountain-forest-stream', (SELECT user_id FROM user_roles WHERE role = 'superadmin' LIMIT 1), NOW() + INTERVAL '30 days'),
    ('coffee-book-chair', (SELECT user_id FROM user_roles WHERE role = 'superadmin' LIMIT 1), NOW() + INTERVAL '30 days'),
    ('sunset-beach-waves', (SELECT user_id FROM user_roles WHERE role = 'superadmin' LIMIT 1), NOW() + INTERVAL '30 days'),
    ('expired-test-code', (SELECT user_id FROM user_roles WHERE role = 'superadmin' LIMIT 1), NOW() - INTERVAL '1 day')
ON CONFLICT (code) DO NOTHING;

-- Verify the codes were inserted
SELECT code, expires_at, used_by, used_at 
FROM approval_codes 
ORDER BY created_at DESC;
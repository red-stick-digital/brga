-- Add test approval codes for debugging
-- This will create some approval codes for testing purposes

-- First, we need to get an admin user ID (assuming marsh11272@yahoo.com is set up as admin)
-- We'll use the admin user as the creator of these codes

INSERT INTO approval_codes (code, created_by, expires_at) 
SELECT 
    'cherry-turtle-apple',
    u.id,
    NOW() + INTERVAL '30 days'
FROM auth.users u
WHERE u.email = 'marsh11272@yahoo.com'
AND EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = u.id 
    AND ur.role IN ('admin', 'superadmin')
)
ON CONFLICT (code) DO NOTHING;

-- Add a few more test codes
INSERT INTO approval_codes (code, created_by, expires_at) 
SELECT 
    code,
    u.id,
    NOW() + INTERVAL '30 days'
FROM auth.users u
CROSS JOIN (VALUES 
    ('ocean-moon-forest'),
    ('purple-dragon-castle'),
    ('silver-star-mountain')
) as codes(code)
WHERE u.email = 'marsh11272@yahoo.com'
AND EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = u.id 
    AND ur.role IN ('admin', 'superadmin')
)
ON CONFLICT (code) DO NOTHING;

-- Verify the codes were created
SELECT 
    ac.code,
    ac.expires_at,
    ac.used_by,
    u.email as created_by_email
FROM approval_codes ac
JOIN auth.users u ON ac.created_by = u.id
ORDER BY ac.created_at;
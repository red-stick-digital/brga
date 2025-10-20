-- Member Portal Schema for Baton Rouge GA
-- This schema supports the member portal system with home groups, member profiles, and approval management

-- ============================================================================
-- 1. HOME_GROUPS TABLE
-- ============================================================================
DROP TABLE IF EXISTS home_groups CASCADE;

CREATE TABLE home_groups (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    start_time TIME NOT NULL,
    street_1 TEXT NOT NULL,
    street_2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 2. MEMBER_PROFILES TABLE
-- ============================================================================
DROP TABLE IF EXISTS member_profiles CASCADE;

CREATE TABLE member_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    email TEXT,
    clean_date DATE,
    home_group_id BIGINT REFERENCES home_groups(id) ON DELETE SET NULL,
    listed_in_directory BOOLEAN DEFAULT FALSE,
    willing_to_sponsor BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 3. APPROVAL_CODES TABLE
-- ============================================================================
DROP TABLE IF EXISTS approval_codes CASCADE;

CREATE TABLE approval_codes (
    id BIGSERIAL PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    used_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 4. EXTEND USER_ROLES TABLE
-- ============================================================================
-- Add approval_status if it doesn't exist
ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'editor', 'admin', 'superadmin'));

-- ============================================================================
-- 5. CREATE INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_member_profiles_user_id ON member_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_member_profiles_home_group_id ON member_profiles(home_group_id);
CREATE INDEX IF NOT EXISTS idx_approval_codes_code ON approval_codes(code);
CREATE INDEX IF NOT EXISTS idx_approval_codes_used_by ON approval_codes(used_by);
CREATE INDEX IF NOT EXISTS idx_user_roles_approval_status ON user_roles(approval_status);

-- ============================================================================
-- 6. UPDATE TRIGGERS FOR TIMESTAMPS
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_home_groups_updated_at ON home_groups;
CREATE TRIGGER update_home_groups_updated_at BEFORE UPDATE ON home_groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_member_profiles_updated_at ON member_profiles;
CREATE TRIGGER update_member_profiles_updated_at BEFORE UPDATE ON member_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 7. ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE home_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- HOME_GROUPS POLICIES
-- ============================================================================
DROP POLICY IF EXISTS "Anyone can view active home groups" ON home_groups;
CREATE POLICY "Anyone can view active home groups" ON home_groups
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can insert home groups" ON home_groups;
CREATE POLICY "Only admins can insert home groups" ON home_groups
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid() AND role IN ('admin', 'editor', 'superadmin')
        )
    );

DROP POLICY IF EXISTS "Only admins can update home groups" ON home_groups;
CREATE POLICY "Only admins can update home groups" ON home_groups
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid() AND role IN ('admin', 'editor', 'superadmin')
        )
    );

DROP POLICY IF EXISTS "Only admins can delete home groups" ON home_groups;
CREATE POLICY "Only admins can delete home groups" ON home_groups
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin')
        )
    );

-- ============================================================================
-- MEMBER_PROFILES POLICIES
-- ============================================================================
DROP POLICY IF EXISTS "Users can view their own profile" ON member_profiles;
CREATE POLICY "Users can view their own profile" ON member_profiles
    FOR SELECT USING (auth.uid() = user_id);

-- Anyone can view directory-listed profiles (filtering done on frontend/backend)
DROP POLICY IF EXISTS "Public directory view" ON member_profiles;
CREATE POLICY "Public directory view" ON member_profiles
    FOR SELECT USING (listed_in_directory = TRUE);

DROP POLICY IF EXISTS "Admins can view all profiles" ON member_profiles;
CREATE POLICY "Admins can view all profiles" ON member_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid() AND role IN ('admin', 'editor', 'superadmin')
        )
    );

DROP POLICY IF EXISTS "Users can create their own profile" ON member_profiles;
CREATE POLICY "Users can create their own profile" ON member_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON member_profiles;
CREATE POLICY "Users can update their own profile" ON member_profiles
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can update any profile" ON member_profiles;
CREATE POLICY "Admins can update any profile" ON member_profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid() AND role IN ('admin', 'editor', 'superadmin')
        )
    );

-- ============================================================================
-- APPROVAL_CODES POLICIES
-- ============================================================================
DROP POLICY IF EXISTS "Only admins can view codes" ON approval_codes;
CREATE POLICY "Only admins can view codes" ON approval_codes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin')
        )
    );

DROP POLICY IF EXISTS "Only admins can create codes" ON approval_codes;
CREATE POLICY "Only admins can create codes" ON approval_codes
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin')
        )
    );

DROP POLICY IF EXISTS "Anyone can use a valid code" ON approval_codes;
CREATE POLICY "Anyone can use a valid code" ON approval_codes
    FOR UPDATE USING (used_by IS NULL)
    WITH CHECK (used_by = auth.uid() AND used_at IS NOT NULL);

-- ============================================================================
-- USER_ROLES POLICIES
-- ============================================================================
DROP POLICY IF EXISTS "Users can view their own role" ON user_roles;
CREATE POLICY "Users can view their own role" ON user_roles
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;
CREATE POLICY "Admins can view all roles" ON user_roles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_roles ur
            WHERE ur.user_id = auth.uid() AND ur.role IN ('admin', 'superadmin')
        )
    );

DROP POLICY IF EXISTS "Superadmins can update roles" ON user_roles;
CREATE POLICY "Superadmins can update roles" ON user_roles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid() AND role = 'superadmin'
        )
    );

DROP POLICY IF EXISTS "Superadmins can insert roles" ON user_roles;
CREATE POLICY "Superadmins can insert roles" ON user_roles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid() AND role = 'superadmin'
        )
    );
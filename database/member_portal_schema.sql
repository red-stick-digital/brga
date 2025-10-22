-- Member Portal Schema for Baton Rouge GA
-- This schema supports the member portal system with home groups, member profiles, and approval management

-- ============================================================================
-- 1. HOME_GROUPS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS home_groups (
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
CREATE TABLE IF NOT EXISTS member_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    email TEXT,
    clean_date DATE,
    home_group_id BIGINT REFERENCES home_groups(id) ON DELETE SET NULL,
    listed_in_directory BOOLEAN DEFAULT FALSE,
    willing_to_sponsor BOOLEAN DEFAULT FALSE,
    share_phone_in_directory BOOLEAN DEFAULT FALSE,
    share_email_in_directory BOOLEAN DEFAULT FALSE,
    officer_position TEXT CHECK (officer_position IN ('Chairman', 'Vice Chairman', 'Secretary', 'Treasurer', 'Librarian', 'Public Relations', 'Telephone Chair', 'Intergroup Representative')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 3. APPROVAL_CODES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS approval_codes (
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
ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'editor', 'admin', 'superadmin', 'pending_deletion', 'deleted'));

-- Add notes column for approval decisions
ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add rejection_reason column for rejected members
ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Add updated_at column for tracking changes
ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add deletion tracking columns
ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS deletion_requested_by TEXT;
ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS deletion_requested_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS deletion_approved_at TIMESTAMP WITH TIME ZONE;

-- ============================================================================
-- 5. CREATE INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_member_profiles_user_id ON member_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_member_profiles_home_group_id ON member_profiles(home_group_id);
CREATE INDEX IF NOT EXISTS idx_approval_codes_code ON approval_codes(code);
CREATE INDEX IF NOT EXISTS idx_approval_codes_used_by ON approval_codes(used_by);
CREATE INDEX IF NOT EXISTS idx_user_roles_approval_status ON user_roles(approval_status);

-- ============================================================================
-- 6. HELPER FUNCTIONS FOR RLS
-- ============================================================================
-- Check if user is an admin (breaks RLS recursion)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid() AND role IN ('admin', 'editor', 'superadmin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is a superadmin (breaks RLS recursion)
CREATE OR REPLACE FUNCTION is_superadmin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid() AND role = 'superadmin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 7. UPDATE TRIGGERS FOR TIMESTAMPS
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

DROP TRIGGER IF EXISTS update_user_roles_updated_at ON user_roles;
CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON user_roles
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
    FOR INSERT WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Only admins can update home groups" ON home_groups;
CREATE POLICY "Only admins can update home groups" ON home_groups
    FOR UPDATE USING (is_admin());

DROP POLICY IF EXISTS "Only admins can delete home groups" ON home_groups;
CREATE POLICY "Only admins can delete home groups" ON home_groups
    FOR DELETE USING (is_superadmin());

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
    FOR SELECT USING (is_admin());

DROP POLICY IF EXISTS "Users can create their own profile" ON member_profiles;
CREATE POLICY "Users can create their own profile" ON member_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can create any profile" ON member_profiles;
CREATE POLICY "Admins can create any profile" ON member_profiles
    FOR INSERT WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Users can update their own profile" ON member_profiles;
CREATE POLICY "Users can update their own profile" ON member_profiles
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can update any profile" ON member_profiles;
CREATE POLICY "Admins can update any profile" ON member_profiles
    FOR UPDATE USING (is_admin());

-- ============================================================================
-- APPROVAL_CODES POLICIES
-- ============================================================================
DROP POLICY IF EXISTS "Only admins can view codes" ON approval_codes;
CREATE POLICY "Only admins can view codes" ON approval_codes
    FOR SELECT USING (is_superadmin());

DROP POLICY IF EXISTS "Only admins can create codes" ON approval_codes;
CREATE POLICY "Only admins can create codes" ON approval_codes
    FOR INSERT WITH CHECK (is_superadmin());

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
    FOR SELECT USING (is_superadmin());

DROP POLICY IF EXISTS "Superadmins can update roles" ON user_roles;
CREATE POLICY "Superadmins can update roles" ON user_roles
    FOR UPDATE USING (is_superadmin());

DROP POLICY IF EXISTS "Superadmins can insert roles" ON user_roles;
CREATE POLICY "Superadmins can insert roles" ON user_roles
    FOR INSERT WITH CHECK (is_superadmin());
-- Admin Access Fix: RLS Policies and Helper Function
-- This migration fixes the admin login issue by:
-- 1. Creating a helper function to check admin status
-- 2. Updating RLS policies to allow users to view their own profile
-- Date: November 24, 2025

-- Step 1: Create helper function to check admin status
-- This function can bypass RLS to check if a user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$;

-- Grant execute permission to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated, anon;

-- Step 2: Recreate RLS policies with proper configuration
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;

-- Allow users to view their own profile
-- This is critical for the admin login check to work
CREATE POLICY "Users can view their own profile" 
ON user_profiles
FOR SELECT 
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" 
ON user_profiles
FOR UPDATE 
USING (auth.uid() = id);

-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" 
ON user_profiles
FOR SELECT 
USING (is_admin(auth.uid()));

-- Allow admins to update any profile
CREATE POLICY "Admins can update all profiles" 
ON user_profiles
FOR UPDATE 
USING (is_admin(auth.uid()));

-- Step 3: Reset admin password to known value
-- Password: Admin@123!
-- User: vk8973675@gmail.com
UPDATE auth.users 
SET encrypted_password = crypt('Admin@123!', gen_salt('bf')),
    email_confirmed_at = NOW()
WHERE email = 'vk8973675@gmail.com';

-- Verify the changes
SELECT 
    'Admin user' as check_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE email = 'vk8973675@gmail.com' AND role = 'admin'
        ) THEN 'PASS ✓'
        ELSE 'FAIL ✗'
    END as status;

SELECT 
    'RLS Policies' as check_name,
    CASE 
        WHEN COUNT(*) >= 4 THEN 'PASS ✓'
        ELSE 'FAIL ✗'
    END as status
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- Display admin credentials for reference
SELECT 
    '=== ADMIN CREDENTIALS ===' as info,
    'vk8973675@gmail.com' as email,
    'Admin@123!' as password,
    'Use these credentials to login' as note;

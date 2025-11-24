-- Reset admin password to Admin@123!
-- This migration ensures the admin user has a known password

DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Get the admin user ID
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'vk8973675@gmail.com';

  -- If user doesn't exist, raise an error
  IF admin_user_id IS NULL THEN
    RAISE EXCEPTION 'Admin user with email vk8973675@gmail.com not found';
  END IF;

  -- Update the password using the auth.users table
  -- Note: This uses Supabase's internal password hashing
  UPDATE auth.users
  SET 
    encrypted_password = crypt('Admin@123!', gen_salt('bf')),
    updated_at = now()
  WHERE id = admin_user_id;

  -- Ensure user has admin role in metadata
  UPDATE auth.users
  SET 
    raw_user_meta_data = jsonb_set(
      COALESCE(raw_user_meta_data, '{}'::jsonb),
      '{role}',
      '"admin"'
    ),
    updated_at = now()
  WHERE id = admin_user_id;

  -- Ensure user profile exists and has admin role
  INSERT INTO public.user_profiles (id, role, created_at, updated_at)
  VALUES (admin_user_id, 'admin', now(), now())
  ON CONFLICT (id) 
  DO UPDATE SET 
    role = 'admin',
    updated_at = now();

  RAISE NOTICE 'Admin password reset successfully to Admin@123!';
END $$;

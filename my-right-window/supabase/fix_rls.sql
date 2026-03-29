-- Fix for Admin RLS policies ensuring secure validation

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

DROP POLICY IF EXISTS "Admin full access judgements" ON judgements;

CREATE POLICY "Admin full access judgements" 
ON judgements
FOR ALL 
TO public
USING (is_admin())
WITH CHECK (is_admin());

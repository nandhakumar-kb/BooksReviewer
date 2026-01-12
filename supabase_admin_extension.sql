-- =============================================================================
-- ADMIN ROLES EXTENSION FOR BOOKS E-COMMERCE DATABASE
-- Add this to your existing database for admin functionality
-- =============================================================================

-- =============================================================================
-- ADD ADMIN ROLE COLUMN TO PROFILES TABLE
-- =============================================================================

-- Add is_admin column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Create index for faster admin checks
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);

-- =============================================================================
-- SECURITY POLICIES FOR ADMIN ACCESS
-- =============================================================================

-- Drop existing policies if needed and recreate with admin support
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update any order" ON orders;
DROP POLICY IF EXISTS "Admins can delete orders" ON orders;

-- Admins can view all orders
CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Admins can update any order status
CREATE POLICY "Admins can update any order" ON orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Admins can delete orders
CREATE POLICY "Admins can delete orders" ON orders
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- =============================================================================
-- ADMIN POLICIES FOR BOOKS
-- =============================================================================

DROP POLICY IF EXISTS "Admins can insert books" ON books;
DROP POLICY IF EXISTS "Admins can update books" ON books;
DROP POLICY IF EXISTS "Admins can delete books" ON books;

-- Admins can add books
CREATE POLICY "Admins can insert books" ON books
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Admins can update books
CREATE POLICY "Admins can update books" ON books
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Admins can delete books
CREATE POLICY "Admins can delete books" ON books
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- =============================================================================
-- ADMIN POLICIES FOR COMBOS
-- =============================================================================

DROP POLICY IF EXISTS "Admins can insert combos" ON combos;
DROP POLICY IF EXISTS "Admins can update combos" ON combos;
DROP POLICY IF EXISTS "Admins can delete combos" ON combos;

-- Admins can add combos
CREATE POLICY "Admins can insert combos" ON combos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Admins can update combos
CREATE POLICY "Admins can update combos" ON combos
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Admins can delete combos
CREATE POLICY "Admins can delete combos" ON combos
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- =============================================================================
-- MANUALLY SET ADMIN USERS
-- =============================================================================

-- IMPORTANT: After running this script, manually set admin users by running:
-- 
-- UPDATE profiles SET is_admin = true WHERE email = 'your-admin-email@example.com';
--
-- Replace 'your-admin-email@example.com' with the actual admin email address
-- You can add multiple admin users by repeating this command with different emails
-- =============================================================================

-- Example (UNCOMMENT and modify with your actual admin email):
-- UPDATE profiles SET is_admin = true WHERE email = 'admin@bookstore.com';

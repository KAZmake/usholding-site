-- Storage bucket configuration for Supabase
-- NOTE: In production, buckets are created via the Supabase Dashboard or CLI.
-- This file documents the required configuration.

-- Bucket: media
-- Purpose: Portfolio project photos, company logos, and other site images
-- Access: Public read (images served directly to visitors), write only via service_role
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Anyone can read files from the media bucket
CREATE POLICY "media_public_read"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'media');

-- Policy: Only service_role can upload/update files
CREATE POLICY "media_service_role_insert"
  ON storage.objects
  FOR INSERT
  TO service_role
  WITH CHECK (bucket_id = 'media');

CREATE POLICY "media_service_role_update"
  ON storage.objects
  FOR UPDATE
  TO service_role
  USING (bucket_id = 'media')
  WITH CHECK (bucket_id = 'media');

CREATE POLICY "media_service_role_delete"
  ON storage.objects
  FOR DELETE
  TO service_role
  USING (bucket_id = 'media');

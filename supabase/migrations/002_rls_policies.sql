-- Migration 002: Row Level Security (RLS) policies
-- Principle: public read only for companies + portfolio_projects.
--            All writes go through service_role (server-side Route Handlers).
--            Never expose service_role key to the browser.

-- ============================================================
-- companies
-- Public SELECT (anon), all mutations only via service_role
-- ============================================================
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "companies_public_read"
  ON public.companies
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "companies_service_role_insert"
  ON public.companies
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "companies_service_role_update"
  ON public.companies
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "companies_service_role_delete"
  ON public.companies
  FOR DELETE
  TO service_role
  USING (true);

-- ============================================================
-- portfolio_projects
-- Public SELECT (anon), all mutations only via service_role
-- ============================================================
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "portfolio_projects_public_read"
  ON public.portfolio_projects
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "portfolio_projects_service_role_insert"
  ON public.portfolio_projects
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "portfolio_projects_service_role_update"
  ON public.portfolio_projects
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "portfolio_projects_service_role_delete"
  ON public.portfolio_projects
  FOR DELETE
  TO service_role
  USING (true);

-- ============================================================
-- leads
-- Anyone can INSERT (contact form submission, no auth required).
-- SELECT / UPDATE / DELETE only via service_role (admin view).
-- ============================================================
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leads_public_insert"
  ON public.leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "leads_service_role_select"
  ON public.leads
  FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "leads_service_role_update"
  ON public.leads
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "leads_service_role_delete"
  ON public.leads
  FOR DELETE
  TO service_role
  USING (true);

-- ============================================================
-- user_profile_extra
-- Authenticated user can read and update their OWN row only.
-- clerk_user_id is stored as TEXT; Clerk JWT sub claim is cast
-- via auth.uid()::text for comparison.
-- INSERT and DELETE are done by service_role (Clerk webhook handler).
-- ============================================================
ALTER TABLE public.user_profile_extra ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_profile_extra_own_select"
  ON public.user_profile_extra
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = clerk_user_id);

CREATE POLICY "user_profile_extra_own_update"
  ON public.user_profile_extra
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = clerk_user_id)
  WITH CHECK (auth.uid()::text = clerk_user_id);

CREATE POLICY "user_profile_extra_service_role_insert"
  ON public.user_profile_extra
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "user_profile_extra_service_role_delete"
  ON public.user_profile_extra
  FOR DELETE
  TO service_role
  USING (true);

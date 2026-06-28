-- Migration 001: Initial schema
-- Tables: companies, portfolio_projects, leads, user_profile_extra

-- ============================================================
-- Trigger function: auto-update updated_at on row modification
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- Table: companies
-- 17 records representing the US Holding group divisions
-- ============================================================
CREATE TABLE public.companies (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT        UNIQUE NOT NULL,
  name        TEXT        NOT NULL,
  tagline     TEXT,
  description TEXT,
  card_tagline TEXT,
  card_description TEXT,
  services    TEXT[]      DEFAULT '{}',
  tags        TEXT[]      DEFAULT '{}',
  logo_file   TEXT,
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- Table: portfolio_projects
-- 6 records (more to be added via admin panel in Phase 7)
-- ============================================================
CREATE TABLE public.portfolio_projects (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT        UNIQUE NOT NULL,
  title       TEXT        NOT NULL,
  tag         TEXT        NOT NULL,
  location    TEXT        NOT NULL,
  builder     TEXT        NOT NULL,
  year        TEXT        NOT NULL,
  image_url   TEXT,
  image_alt   TEXT,
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER portfolio_projects_updated_at
  BEFORE UPDATE ON public.portfolio_projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- Table: leads
-- Contact form submissions (duplicate of Web3Forms, insurance)
-- ============================================================
CREATE TABLE public.leads (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  phone       TEXT,
  message     TEXT        NOT NULL,
  status      TEXT        NOT NULL DEFAULT 'new'
                          CHECK (status IN ('new', 'in_progress', 'closed')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- Table: user_profile_extra
-- Extra profile fields synced from Clerk (replaces unsafeMetadata)
-- ============================================================
CREATE TABLE public.user_profile_extra (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT        UNIQUE NOT NULL,
  phone         TEXT,
  position      TEXT,
  department    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER user_profile_extra_updated_at
  BEFORE UPDATE ON public.user_profile_extra
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

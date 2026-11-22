-- ============================================================================
-- SCHÉMA SUPABASE COMPLET — GESTION COMMUNALE MADAGASCAR (CTD)
-- À exécuter dans : Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ============================================================================

-- 1. TABLE DES INSCRIPTIONS, ABONNEMENTS (40 000 Ar / 15j) & 2ÈME COMMUNE (15 000 Ar)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id TEXT PRIMARY KEY,
  type TEXT DEFAULT 'ABONNEMENT', -- 'ABONNEMENT' | '2EME_COMMUNE'
  full_name TEXT NOT NULL,
  fonction TEXT NOT NULL,
  collectivite TEXT NOT NULL,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  mvola_ref TEXT NOT NULL,
  montant INTEGER NOT NULL DEFAULT 40000,
  proof_name TEXT,
  proof_url TEXT,
  status TEXT NOT NULL DEFAULT 'EN_ATTENTE', -- 'EN_ATTENTE' | 'VALIDE' | 'REFUSE'
  created_at DATE DEFAULT CURRENT_DATE,
  expires_at DATE
);

-- 2. TABLE DES DOSSIERS COMPTABLES & PROGRESSION PAR COMMUNE
CREATE TABLE IF NOT EXISTS public.communes_dossiers (
  commune_id TEXT PRIMARY KEY,
  owner_email TEXT NOT NULL,
  commune_name TEXT NOT NULL,
  code_commune TEXT NOT NULL,
  categorie_code TEXT NOT NULL,
  progress_pct INTEGER DEFAULT 0,
  steps_done INTEGER DEFAULT 0,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLE DES DEMANDES "ACTE D'ÉTAT CIVIL EXPRESS" (2 000 Ar)
CREATE TABLE IF NOT EXISTS public.etat_civil_demandes (
  id TEXT PRIMARY KEY,
  ref_code TEXT UNIQUE NOT NULL,
  type_acte TEXT NOT NULL,
  commune TEXT NOT NULL,
  demandeur TEXT NOT NULL,
  tel TEXT NOT NULL,
  email TEXT NOT NULL,
  num_acte TEXT,
  mvola_ref TEXT NOT NULL,
  montant INTEGER NOT NULL DEFAULT 2000,
  original_name TEXT,
  original_url TEXT,
  proof_name TEXT,
  proof_url TEXT,
  draft JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'EN_ATTENTE', -- 'EN_ATTENTE' | 'VALIDE_REDACTION' | 'DELIVRE' | 'REJETE'
  created_at DATE DEFAULT CURRENT_DATE
);

-- 4. TABLE DES ÉVALUATIONS 5 ÉTOILES (PAGE D'ACCUEIL)
CREATE TABLE IF NOT EXISTS public.app_ratings (
  id BIGSERIAL PRIMARY KEY,
  stars INTEGER NOT NULL CHECK (stars BETWEEN 1 AND 5),
  comment TEXT,
  created_at DATE DEFAULT CURRENT_DATE
);

-- 5. BUCKET STORAGE POUR LES PREUVES MVOLA & ACTES ORIGINAUX
INSERT INTO storage.buckets (id, name, public)
VALUES ('ctd-documents', 'ctd-documents', false)
ON CONFLICT (id) DO NOTHING;

-- 6. ACTIVATION RLS (ROW LEVEL SECURITY)
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communes_dossiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.etat_civil_demandes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_ratings ENABLE ROW LEVEL SECURITY;

-- Politiques de base (à restreindre davantage avec Supabase Auth si souhaité)
CREATE POLICY "Public insert subscriptions" ON public.subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Read subscriptions" ON public.subscriptions FOR SELECT USING (true);
CREATE POLICY "Update subscriptions" ON public.subscriptions FOR UPDATE USING (true);
CREATE POLICY "Delete subscriptions" ON public.subscriptions FOR DELETE USING (true);

CREATE POLICY "All dossiers" ON public.communes_dossiers FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public insert etat civil" ON public.etat_civil_demandes FOR INSERT WITH CHECK (true);
CREATE POLICY "Read update etat civil" ON public.etat_civil_demandes FOR SELECT USING (true);
CREATE POLICY "Update etat civil" ON public.etat_civil_demandes FOR UPDATE USING (true);

CREATE POLICY "Public ratings" ON public.app_ratings FOR ALL USING (true) WITH CHECK (true);
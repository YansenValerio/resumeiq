-- =============================================
-- ResumeIQ Database Schema
-- =============================================
-- Jalankan SQL ini di Supabase SQL Editor
-- Path: Dashboard > SQL Editor > New Query

-- ---------------------------------------------
-- Tabel: analyses
-- Menyimpan history analisis resume
-- ---------------------------------------------
CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Resume data
  resume_filename TEXT NOT NULL,
  resume_text TEXT NOT NULL,
  resume_size_bytes INTEGER,

  -- Job description
  job_description TEXT NOT NULL,
  job_title TEXT, -- Optional, di-extract dari JD

  -- Analysis result (JSONB untuk flexibility)
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  ats_score INTEGER NOT NULL CHECK (ats_score >= 0 AND ats_score <= 100),
  result JSONB NOT NULL,

  -- Metadata
  language TEXT NOT NULL DEFAULT 'id' CHECK (language IN ('id', 'en')),
  duration_ms INTEGER, -- Berapa lama analisis berjalan

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk query yang sering dipakai
CREATE INDEX idx_analyses_user_id ON analyses(user_id);
CREATE INDEX idx_analyses_created_at ON analyses(created_at DESC);
CREATE INDEX idx_analyses_user_created ON analyses(user_id, created_at DESC);

-- ---------------------------------------------
-- Tabel: usage_tracking
-- Track usage per user/IP untuk rate limiting
-- ---------------------------------------------
CREATE TABLE IF NOT EXISTS usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identifier (salah satu harus terisi)
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_hash TEXT, -- SHA-256 hash dari IP untuk privacy

  -- Tracking
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  analysis_count INTEGER DEFAULT 1,

  -- Constraint: salah satu identifier harus ada
  CONSTRAINT user_or_ip CHECK (
    (user_id IS NOT NULL AND ip_hash IS NULL) OR
    (user_id IS NULL AND ip_hash IS NOT NULL)
  ),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Unique per user/IP per hari
  UNIQUE(user_id, date),
  UNIQUE(ip_hash, date)
);

CREATE INDEX idx_usage_date ON usage_tracking(date);

-- ---------------------------------------------
-- Tabel: feedback
-- Feedback dari user untuk improvement
-- ---------------------------------------------
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  analysis_id UUID REFERENCES analyses(id) ON DELETE SET NULL,

  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------
-- Row Level Security (RLS) Policies
-- ---------------------------------------------

-- Enable RLS
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Policy: User hanya bisa lihat analisis mereka sendiri
CREATE POLICY "Users can view own analyses"
  ON analyses FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: User bisa insert analisis untuk diri mereka
CREATE POLICY "Users can insert own analyses"
  ON analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Policy: User bisa delete analisis mereka sendiri
CREATE POLICY "Users can delete own analyses"
  ON analyses FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Usage tracking hanya bisa di-akses service role
-- (di-handle dari backend)
CREATE POLICY "Service role manages usage"
  ON usage_tracking FOR ALL
  USING (auth.role() = 'service_role');

-- Policy: Feedback bisa dibaca/insert oleh user
CREATE POLICY "Anyone can insert feedback"
  ON feedback FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own feedback"
  ON feedback FOR SELECT
  USING (auth.uid() = user_id);

-- ---------------------------------------------
-- Functions & Triggers
-- ---------------------------------------------

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_analyses_updated_at
  BEFORE UPDATE ON analyses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usage_updated_at
  BEFORE UPDATE ON usage_tracking
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ---------------------------------------------
-- Storage Buckets (jalankan via Dashboard)
-- ---------------------------------------------
-- 1. Buka Storage di Supabase Dashboard
-- 2. Create bucket bernama "resumes"
-- 3. Set sebagai private (bukan public)
-- 4. Setup policy:
--    - User bisa upload ke folder dengan nama mereka: {user_id}/*
--    - User hanya bisa lihat file di folder mereka

-- ---------------------------------------------
-- Done!
-- ---------------------------------------------
-- Verifikasi dengan query:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

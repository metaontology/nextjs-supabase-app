-- =============================================================
-- Migration: create_profiles_table
-- 설명: 회원 가입 사용자 정보를 관리하는 profiles 테이블 생성
-- 생성일: 2026-04-10
-- =============================================================

-- ── 1. profiles 테이블 ──────────────────────────────────────
-- auth.users와 1:1 관계, 회원가입 시 자동 생성
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT,
  full_name   TEXT,
  avatar_url  TEXT,
  bio         TEXT,
  website     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 2. updated_at 자동 갱신 ─────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ── 3. 신규 회원가입 시 프로필 자동 생성 ─────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$;

-- auth.users에 신규 행 삽입 시 트리거
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ── 4. RLS(Row Level Security) ──────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 본인 프로필 조회 허용
CREATE POLICY "users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- 본인 프로필 수정 허용
CREATE POLICY "users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ── 5. 인덱스 ───────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles (email);

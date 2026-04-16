-- =============================================================
-- Migration: add_role_to_profiles
-- 설명: profiles 테이블에 role 컬럼 추가 및 관리자 RLS 정책 추가
-- 생성일: 2026-04-16
-- =============================================================

-- ── 1. role 컬럼 추가 ─────────────────────────────────────────
-- 기본값 'user', 허용 값: 'user' | 'admin'
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user'
    CHECK (role IN ('user', 'admin'));

-- ── 2. 관리자 전체 프로필 조회 RLS 정책 추가 ──────────────────
-- 기존 "users can view own profile" 정책은 유지하고 추가만 함
CREATE POLICY "admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
  );

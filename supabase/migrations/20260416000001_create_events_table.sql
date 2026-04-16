-- =============================================================
-- Migration: create_events_table
-- 설명: 이벤트 관리를 위한 events 테이블 생성
-- 생성일: 2026-04-16
-- =============================================================

-- ── 1. events 테이블 ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.events (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title             TEXT        NOT NULL,
  description       TEXT,
  event_date        TIMESTAMPTZ NOT NULL,
  location          TEXT        NOT NULL,
  cover_image_url   TEXT,
  invite_code       TEXT        UNIQUE NOT NULL,
  max_participants  INTEGER,
  status            TEXT        NOT NULL DEFAULT 'upcoming'
                    CHECK (status IN ('upcoming', 'ongoing', 'ended')),
  created_by        UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 2. updated_at 자동 갱신 트리거 ──────────────────────────
-- handle_updated_at() 함수는 profiles 마이그레이션에서 이미 생성됨
CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ── 3. RLS(Row Level Security) ──────────────────────────────
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- 인증된 사용자는 모든 이벤트 조회 가능
CREATE POLICY "authenticated users can view events"
  ON public.events
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- 본인 ID로만 이벤트 생성 가능
CREATE POLICY "users can insert own events"
  ON public.events
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- 이벤트 생성자만 수정 가능
CREATE POLICY "users can update own events"
  ON public.events
  FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- 이벤트 생성자만 삭제 가능
CREATE POLICY "users can delete own events"
  ON public.events
  FOR DELETE
  USING (auth.uid() = created_by);

-- ── 4. 인덱스 ───────────────────────────────────────────────
-- 초대 코드 조회 최적화 (UNIQUE 제약 외 명시적 인덱스)
CREATE INDEX IF NOT EXISTS events_invite_code_idx ON public.events (invite_code);

-- 이벤트 생성자 기준 조회 최적화
CREATE INDEX IF NOT EXISTS events_created_by_idx ON public.events (created_by);

-- 이벤트 상태 기준 필터링 최적화
CREATE INDEX IF NOT EXISTS events_status_idx ON public.events (status);

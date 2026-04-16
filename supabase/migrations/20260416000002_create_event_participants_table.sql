-- =============================================================
-- Migration: create_event_participants_table
-- 설명: 이벤트 참여자 관리를 위한 event_participants 테이블 생성
-- 생성일: 2026-04-16
-- =============================================================

-- ── 1. event_participants 테이블 ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.event_participants (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    UUID        NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id     UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role        TEXT        NOT NULL DEFAULT 'attendee'
              CHECK (role IN ('attendee', 'organizer')),
  joined_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- 동일 이벤트에 동일 사용자의 중복 참여 방지
  UNIQUE (event_id, user_id)
);

-- ── 2. RLS(Row Level Security) ──────────────────────────────
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;

-- 인증된 사용자는 모든 참여자 목록 조회 가능
CREATE POLICY "authenticated users can view participants"
  ON public.event_participants
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- 본인 user_id로만 참여 등록 가능
CREATE POLICY "users can insert own participation"
  ON public.event_participants
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 본인의 참여 기록만 삭제 가능
CREATE POLICY "users can delete own participation"
  ON public.event_participants
  FOR DELETE
  USING (auth.uid() = user_id);

-- ── 3. 인덱스 ───────────────────────────────────────────────
-- 이벤트별 참여자 목록 조회 최적화
CREATE INDEX IF NOT EXISTS event_participants_event_id_idx
  ON public.event_participants (event_id);

-- 사용자별 참여 이벤트 목록 조회 최적화
CREATE INDEX IF NOT EXISTS event_participants_user_id_idx
  ON public.event_participants (user_id);

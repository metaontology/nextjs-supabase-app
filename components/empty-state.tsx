'use client'

// 빈 상태 안내 컴포넌트 — 데이터가 없을 때 표시
import { Button } from '@/components/ui/button'
import { Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { EmptyStateProps } from '@/lib/types'

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-12 text-center',
        className,
      )}
    >
      {/* 빈 상태 아이콘 */}
      <Inbox size={48} className="text-muted-foreground" aria-hidden="true" />

      {/* 제목 */}
      <p className="text-lg font-semibold text-foreground">{title}</p>

      {/* 설명 (선택) */}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      {/* 액션 버튼 (선택) — actionLabel과 onAction 모두 있을 때만 표시 */}
      {onAction && actionLabel && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  )
}

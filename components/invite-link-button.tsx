'use client'

import { Copy } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

interface InviteLinkButtonProps {
  /** 초대 코드 — /invite/{inviteCode} 경로로 조합됨 */
  inviteCode: string
}

// 초대 링크 클립보드 복사 버튼 컴포넌트
export function InviteLinkButton({ inviteCode }: InviteLinkButtonProps) {
  // 초대 링크를 클립보드에 복사하는 핸들러
  async function handleCopy() {
    const inviteUrl = window.location.origin + '/invite/' + inviteCode
    await navigator.clipboard.writeText(inviteUrl)
    toast.success('초대 링크가 복사되었습니다')
  }

  return (
    <Button variant="outline" onClick={handleCopy}>
      <Copy />
      초대 링크 복사
    </Button>
  )
}

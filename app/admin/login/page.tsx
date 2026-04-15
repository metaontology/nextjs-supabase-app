// 관리자 전용 로그인 페이지 — /admin/login
// 일반 사용자 로그인(/auth/login)과 분리된 관리자 전용 UI
// 로그인 성공 후 /admin으로 리디렉션
import { ShieldCheck } from 'lucide-react'

import { AdminLoginForm } from '@/components/admin/admin-login-form'

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-sm">
        {/* 관리자 패널 헤더 */}
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Gather 관리자 패널</p>
        </div>

        {/* 로그인 폼 */}
        <AdminLoginForm />
      </div>
    </div>
  )
}

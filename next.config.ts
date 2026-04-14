import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // cacheComponents: true는 cookies() 기반 Supabase 클라이언트 호출 시 Turbopack 컴파일 hang 발생
  // async 페이지에서 직접 createClient() 사용 시 false 필요 (Next.js 16.2.x Turbopack 이슈)
  cacheComponents: false,
}

export default nextConfig

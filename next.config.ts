import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // cacheComponents: true는 cookies() 기반 Supabase 클라이언트 호출 시 Turbopack 컴파일 hang 발생
  // async 페이지에서 직접 createClient() 사용 시 false 필요 (Next.js 16.2.x Turbopack 이슈)
  cacheComponents: false,

  images: {
    remotePatterns: [
      {
        // 이벤트 커버 이미지 — 시드 기반 결정적 플레이스홀더
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        // 프로필 아바타 — 이메일 기반 결정적 아바타
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        // Supabase Storage — Task 009에서 실제 업로드 이미지에 사용
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
}

export default nextConfig

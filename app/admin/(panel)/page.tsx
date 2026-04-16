import { redirect } from 'next/navigation'

// /admin → /admin/dashboard 리디렉션
export default function AdminIndexPage() {
  redirect('/admin/dashboard')
}

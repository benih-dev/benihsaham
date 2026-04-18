import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth/auth'
import { PublicHome } from '@/components/landing/public-home'

export default async function Home() {
  const session = await auth()

  // If user is logged in, redirect to dashboard
  if (session) {
    redirect('/dashboard')
  }

  // Otherwise show public landing page
  return <PublicHome />
}

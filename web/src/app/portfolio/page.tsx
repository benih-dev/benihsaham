import { redirect } from 'next/navigation'

export default function PortfolioPage() {
  // Portfolio page redirects to dashboard as they show the same content
  redirect('/dashboard')
}

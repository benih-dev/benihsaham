import { auth } from '@/lib/auth/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { WatchlistTable } from '@/components/portfolio/watchlist-table'
import { Header } from '@/components/layout/header'

export default async function WatchlistPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  // Get user's watchlist
  const watchlistItems = await prisma.bsWatchlistItem.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      stock: true,
    },
    orderBy: {
      addedAt: 'desc',
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Watchlist</h1>
          <p className="text-gray-600 mt-1">
            Pantau saham-saham potensial untuk investasi
          </p>
        </div>

        <WatchlistTable watchlistItems={watchlistItems} />
      </div>
    </div>
  )
}

import { auth } from '@/lib/auth/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { TransactionsTable } from '@/components/portfolio/transactions-table'
import { Header } from '@/components/layout/header'

export default async function TransactionsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  // Get user's active portfolio
  const portfolios = await prisma.bsPortfolio.findMany({
    where: {
      userId: session.user.id,
      status: 'active',
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  if (portfolios.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Riwayat Transaksi</h1>
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">Anda belum memiliki portofolio.</p>
            <p className="text-sm text-gray-500">Buat portofolio baru untuk memulai.</p>
          </div>
        </div>
      </div>
    )
  }

  const portfolio = portfolios[0]

  // Get transactions for the portfolio
  const transactions = await prisma.bsTransaction.findMany({
    where: {
      portfolioId: portfolio.id,
    },
    include: {
      stock: true,
    },
    orderBy: {
      transactionAt: 'desc',
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Riwayat Transaksi</h1>
          <p className="text-gray-600 mt-1">
            {portfolio.name}
            {portfolio.description && ` — ${portfolio.description}`}
          </p>
        </div>

        <TransactionsTable transactions={transactions} />
      </div>
    </div>
  )
}

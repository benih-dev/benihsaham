import { auth } from '@/lib/auth/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PortfolioSummaryCard } from '@/components/portfolio/portfolio-summary-card'
import { HoldingsTable } from '@/components/portfolio/holdings-table'
import { Header } from '@/components/layout/header'

function toNumber(value: { toNumber: () => number } | number): number {
  if (typeof value === 'number') return value
  return value.toNumber()
}

function formatCurrency(value: { toNumber: () => number } | number): string {
  const num = toNumber(value)
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

function formatPercent(value: { toNumber: () => number } | number): string {
  const num = toNumber(value)
  return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`
}

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const portfolios = await prisma.bsPortfolio.findMany({
    where: {
      userId: session.user.id,
      status: 'active',
    },
    include: {
      holdings: {
        include: {
          stock: true,
        },
      },
    },
  })

  const portfolio = portfolios[0]

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">Anda belum memiliki portofolio.</p>
            <p className="text-sm text-gray-500">Buat portofolio baru untuk memulai.</p>
          </div>
        </div>
      </div>
    )
  }

  const totalReturn = Number(portfolio.totalReturn)
  const totalReturnPct = Number(portfolio.totalReturnPct)
  const currentValue = Number(portfolio.currentValue)
  const initialCapital = Number(portfolio.initialCapital)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {portfolio.name}
          </h1>
          {portfolio.description && (
            <p className="text-gray-600 mt-1">{portfolio.description}</p>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <PortfolioSummaryCard
            title="Nilai Saat Ini"
            value={formatCurrency(currentValue)}
            icon="wallet"
          />
          <PortfolioSummaryCard
            title="Modal Awal"
            value={formatCurrency(initialCapital)}
            icon="dollar"
          />
          <PortfolioSummaryCard
            title="Total Return"
            value={formatCurrency(totalReturn)}
            change={formatPercent(totalReturnPct)}
            changeType={totalReturn >= 0 ? 'positive' : 'negative'}
            icon={totalReturn >= 0 ? 'trending-up' : 'trending-down'}
          />
          <PortfolioSummaryCard
            title="Jumlah Posisi"
            value={portfolio.holdings.length.toString()}
            icon="wallet"
          />
        </div>

        {/* Holdings Table */}
        <HoldingsTable holdings={portfolio.holdings} />
      </div>
    </div>
  )
}

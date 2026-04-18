'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Wallet, DollarSign } from 'lucide-react'

interface PortfolioSummaryCardProps {
  title: string
  value: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: 'wallet' | 'dollar' | 'trending-up' | 'trending-down'
}

const iconMap = {
  wallet: Wallet,
  dollar: DollarSign,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
}

const changeColorMap = {
  positive: 'text-green-600',
  negative: 'text-red-600',
  neutral: 'text-gray-600',
}

export function PortfolioSummaryCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon = 'wallet',
}: PortfolioSummaryCardProps) {
  const Icon = iconMap[icon]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={`text-xs ${changeColorMap[changeType]} mt-1`}>
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Holding {
  id: string
  shares: number
  avgCost: { toNumber: () => number } | number
  currentPrice: { toNumber: () => number } | number | null
  marketValue: { toNumber: () => number } | number | null
  unrealizedPnl: { toNumber: () => number } | number | null
  unrealizedPnlPct: { toNumber: () => number } | number | null
  stock: {
    code: string
    name: string
    sector: string | null
  }
}

interface HoldingsTableProps {
  holdings: Holding[]
}

function toNumber(value: { toNumber: () => number } | number | null | undefined): number | null {
  if (value === null || value === undefined) return null
  if (typeof value === 'number') return value
  return value.toNumber()
}

function formatCurrency(value: { toNumber: () => number } | number | null): string {
  const num = toNumber(value)
  if (num === null) return '-'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('id-ID').format(value)
}

export function HoldingsTable({ holdings }: HoldingsTableProps) {
  const totalValue = holdings.reduce(
    (sum, h) => sum + (toNumber(h.marketValue) || 0),
    0
  )
  const totalPnl = holdings.reduce(
    (sum, h) => sum + (toNumber(h.unrealizedPnl) || 0),
    0
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Posisi Saat Ini</CardTitle>
      </CardHeader>
      <CardContent>
        {holdings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Belum ada posisi saham
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Nilai</p>
                <p className="text-lg font-semibold">{formatCurrency(totalValue)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total P&L</p>
                <p
                  className={`text-lg font-semibold ${
                    totalPnl >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {formatCurrency(totalPnl)}
                </p>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead className="text-right">Lot</TableHead>
                  <TableHead className="text-right">Rata-rata</TableHead>
                  <TableHead className="text-right">Harga Saat Ini</TableHead>
                  <TableHead className="text-right">Nilai Pasar</TableHead>
                  <TableHead className="text-right">P&L</TableHead>
                  <TableHead className="text-right">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holdings.map((holding) => {
                  const pnl = toNumber(holding.unrealizedPnl) || 0
                  const pnlPct = toNumber(holding.unrealizedPnlPct) || 0
                  const isPositive = pnl >= 0

                  return (
                    <TableRow key={holding.id}>
                      <TableCell className="font-medium">
                        {holding.stock.code}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm">
                            {holding.stock.name}
                          </div>
                          {holding.stock.sector && (
                            <Badge variant="outline" className="text-xs mt-1">
                              {holding.stock.sector}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumber(holding.shares / 100)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(holding.avgCost)}
                      </TableCell>
                      <TableCell className="text-right">
                        {holding.currentPrice
                          ? formatCurrency(holding.currentPrice)
                          : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {holding.marketValue
                          ? formatCurrency(holding.marketValue)
                          : '-'}
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${
                          isPositive ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {holding.unrealizedPnl !== null
                          ? formatCurrency(holding.unrealizedPnl)
                          : '-'}
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${
                          isPositive ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {holding.unrealizedPnlPct !== null
                          ? `${pnlPct >= 0 ? '+' : ''}${pnlPct.toFixed(2)}%`
                          : '-'}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </>
        )}
      </CardContent>
    </Card>
  )
}

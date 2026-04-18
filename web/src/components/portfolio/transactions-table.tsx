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

interface Transaction {
  id: string
  type: 'buy' | 'sell' | 'dividend'
  shares: number
  price: { toNumber: () => number } | number
  grossAmount: { toNumber: () => number } | number | null
  feeBrokerage: { toNumber: () => number } | number | null
  feeLevy: { toNumber: () => number } | number | null
  feeVat: { toNumber: () => number } | number | null
  netAmount: { toNumber: () => number } | number | null
  settlementDate: Date | string
  transactionAt: Date | string
  notes: string | null
  stock: {
    code: string
    name: string
  }
}

interface TransactionsTableProps {
  transactions: Transaction[]
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

function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d)
}

function getTransactionTypeBadge(type: string) {
  switch (type) {
    case 'buy':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Beli</Badge>
    case 'sell':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Jual</Badge>
    case 'dividend':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Dividen</Badge>
    default:
      return <Badge variant="outline">{type}</Badge>
  }
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  const totalBuy = transactions
    .filter((t) => t.type === 'buy')
    .reduce((sum, t) => sum + (toNumber(t.netAmount) || 0), 0)
  const totalSell = transactions
    .filter((t) => t.type === 'sell')
    .reduce((sum, t) => sum + (toNumber(t.netAmount) || 0), 0)
  const totalFees = transactions.reduce(
    (sum, t) =>
      sum +
      (toNumber(t.feeBrokerage) || 0) +
      (toNumber(t.feeLevy) || 0) +
      (toNumber(t.feeVat) || 0),
    0
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Riwayat Transaksi</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Belum ada transaksi
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Pembelian</p>
                <p className="text-lg font-semibold text-green-600">{formatCurrency(totalBuy)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Penjualan</p>
                <p className="text-lg font-semibold text-red-600">{formatCurrency(totalSell)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Fee</p>
                <p className="text-lg font-semibold">{formatCurrency(totalFees)}</p>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead className="text-right">Lot</TableHead>
                  <TableHead className="text-right">Harga</TableHead>
                  <TableHead className="text-right">Total Nilai</TableHead>
                  <TableHead className="text-right">Fee</TableHead>
                  <TableHead className="text-right">Netto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => {
                  const fees =
                    (toNumber(transaction.feeBrokerage) || 0) +
                    (toNumber(transaction.feeLevy) || 0) +
                    (toNumber(transaction.feeVat) || 0)

                  return (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(transaction.transactionAt)}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {transaction.stock.code}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{transaction.stock.name}</div>
                      </TableCell>
                      <TableCell>{getTransactionTypeBadge(transaction.type)}</TableCell>
                      <TableCell className="text-right">
                        {formatNumber(transaction.shares / 100)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(transaction.price)}
                      </TableCell>
                      <TableCell className="text-right">
                        {transaction.grossAmount
                          ? formatCurrency(transaction.grossAmount)
                          : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {fees > 0 ? formatCurrency(fees) : '-'}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {transaction.netAmount
                          ? formatCurrency(transaction.netAmount)
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

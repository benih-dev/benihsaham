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

interface WatchlistItem {
  id: string
  status: 'watch' | 'deep_dive' | 'ready' | 'reject'
  priority: 'low' | 'medium' | 'high'
  thesis: string | null
  triggerBuy: string | null
  triggerSell: string | null
  notes: string | null
  addedAt: Date | string
  stock: {
    code: string
    name: string
    sector: string | null
  }
}

interface WatchlistTableProps {
  watchlistItems: WatchlistItem[]
}

function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d)
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'watch':
      return <Badge variant="outline">Watch</Badge>
    case 'deep_dive':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Deep Dive</Badge>
    case 'ready':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ready</Badge>
    case 'reject':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Reject</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function getPriorityBadge(priority: string) {
  switch (priority) {
    case 'high':
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">High</Badge>
    case 'medium':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium</Badge>
    case 'low':
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Low</Badge>
    default:
      return <Badge variant="outline">{priority}</Badge>
  }
}

export function WatchlistTable({ watchlistItems }: WatchlistTableProps) {
  const activeItems = watchlistItems.filter((item) => item.status !== 'reject')

  return (
    <Card>
      <CardHeader>
        <CardTitle>Watchlist Saham</CardTitle>
      </CardHeader>
      <CardContent>
        {watchlistItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Belum ada saham di watchlist
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Watchlist</p>
                <p className="text-lg font-semibold">{activeItems.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ready to Buy</p>
                <p className="text-lg font-semibold text-green-600">
                  {watchlistItems.filter((item) => item.status === 'ready').length}
                </p>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Sektor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Trigger Beli</TableHead>
                  <TableHead>Tanggal Ditambah</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {watchlistItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.stock.code}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{item.stock.name}</div>
                    </TableCell>
                    <TableCell>
                      {item.stock.sector ? (
                        <Badge variant="outline" className="text-xs">
                          {item.stock.sector}
                        </Badge>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                    <TableCell>
                      <div className="text-sm max-w-xs truncate">
                        {item.triggerBuy || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{formatDate(item.addedAt)}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </CardContent>
    </Card>
  )
}

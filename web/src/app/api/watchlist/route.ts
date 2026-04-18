import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
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

    return NextResponse.json(watchlistItems)
  } catch (error) {
    console.error('Error fetching watchlist:', error)
    return NextResponse.json(
      { error: 'Failed to fetch watchlist' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { stockId, status, priority, thesis, triggerBuy, triggerSell, notes } = body

    // Check if stock already exists in watchlist
    const existing = await prisma.bsWatchlistItem.findFirst({
      where: {
        userId: session.user.id,
        stockId,
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Stock already in watchlist' },
        { status: 400 }
      )
    }

    const watchlistItem = await prisma.bsWatchlistItem.create({
      data: {
        userId: session.user.id,
        stockId,
        status: status || 'watch',
        priority: priority || 'medium',
        thesis,
        triggerBuy,
        triggerSell,
        notes,
      },
      include: {
        stock: true,
      },
    })

    return NextResponse.json(watchlistItem, { status: 201 })
  } catch (error) {
    console.error('Error creating watchlist item:', error)
    return NextResponse.json(
      { error: 'Failed to create watchlist item' },
      { status: 500 }
    )
  }
}

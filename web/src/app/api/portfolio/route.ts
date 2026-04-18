import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
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
        _count: {
          select: {
            holdings: true,
            transactions: true,
          },
        },
      },
    })

    return NextResponse.json(portfolios)
  } catch (error) {
    console.error('Error fetching portfolios:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolios' },
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
    const { name, description, initialCapital } = body

    const portfolio = await prisma.bsPortfolio.create({
      data: {
        userId: session.user.id,
        name,
        description,
        initialCapital,
        currentValue: initialCapital,
      },
    })

    return NextResponse.json(portfolio, { status: 201 })
  } catch (error) {
    console.error('Error creating portfolio:', error)
    return NextResponse.json(
      { error: 'Failed to create portfolio' },
      { status: 500 }
    )
  }
}

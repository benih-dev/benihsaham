import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const portfolioId = searchParams.get('portfolioId')

    if (!portfolioId) {
      return NextResponse.json(
        { error: 'Portfolio ID is required' },
        { status: 400 }
      )
    }

    const holdings = await prisma.bsHolding.findMany({
      where: {
        portfolioId,
        portfolio: {
          userId: session.user.id,
        },
      },
      include: {
        stock: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(holdings)
  } catch (error) {
    console.error('Error fetching holdings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch holdings' },
      { status: 500 }
    )
  }
}

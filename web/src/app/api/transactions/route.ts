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

    // Get user's active portfolio
    const portfolios = await prisma.bsPortfolio.findMany({
      where: {
        userId: session.user.id,
        status: 'active',
      },
    })

    if (portfolios.length === 0) {
      return NextResponse.json([])
    }

    // Use specified portfolio or first active one
    const targetPortfolioId = portfolioId || portfolios[0].id

    // Verify the portfolio belongs to the user
    const portfolio = portfolios.find((p) => p.id === targetPortfolioId)
    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })
    }

    const transactions = await prisma.bsTransaction.findMany({
      where: {
        portfolioId: targetPortfolioId,
      },
      include: {
        stock: true,
      },
      orderBy: {
        transactionAt: 'desc',
      },
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
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
    const {
      portfolioId,
      stockId,
      type,
      shares,
      price,
      feeBrokerage,
      feeLevy,
      feeVat,
      settlementDate,
      transactionAt,
      notes,
    } = body

    // Verify portfolio ownership
    const portfolio = await prisma.bsPortfolio.findFirst({
      where: {
        id: portfolioId,
        userId: session.user.id,
      },
    })

    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })
    }

    // Calculate amounts
    const grossAmount = Number(shares) * Number(price)
    const totalFee = Number(feeBrokerage || 0) + Number(feeLevy || 0) + Number(feeVat || 0)
    const netAmount = type === 'buy' ? grossAmount + totalFee : grossAmount - totalFee

    const transaction = await prisma.bsTransaction.create({
      data: {
        portfolioId,
        stockId,
        type,
        shares: Number(shares),
        price: Number(price),
        grossAmount,
        feeBrokerage: feeBrokerage ? Number(feeBrokerage) : null,
        feeLevy: feeLevy ? Number(feeLevy) : null,
        feeVat: feeVat ? Number(feeVat) : null,
        netAmount,
        settlementDate: new Date(settlementDate),
        transactionAt: new Date(transactionAt),
        notes,
      },
      include: {
        stock: true,
      },
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    )
  }
}

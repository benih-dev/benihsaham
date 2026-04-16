# MVP Tech Stack: Portfolio Tracking UI
**Version:** 1.0
**Date:** 2026-04-16
**Designer:** Founding Engineer (BIMA)
**For:** BEN-5 — Build MVP: Portfolio overview and tracking UI

---

## Recommendation: Next.js + Supabase

### Why This Stack?

| Factor | Decision | Rationale |
|--------|----------|-----------|
| **Framework** | Next.js 15 (App Router) | Fastest path to production, built-in API routes, excellent DX |
| **UI Library** | shadcn/ui + Tailwind CSS | Modern components, no build step, fully customizable |
| **Database** | Supabase (PostgreSQL) | Matches our data model schema, built-in auth, real-time features |
| **Charts** | Recharts | React-native, handles financial data well, lightweight |
| **State** | Zustand | Minimal boilerplate, perfect for portfolio state |
| **Forms** | React Hook Form + Zod | Type-safe validation, great UX |
| **Data Fetching** | TanStack Query (React Query) | Caching, background updates, optimistic updates |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App (Vercel)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Portfolio  │  │  Watchlist  │  │  Valuation  │         │
│  │    Page     │  │    Page     │  │    Page     │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                  │
│         └────────────────┴────────────────┘                  │
│                          │                                   │
│                   ┌──────▼──────┐                            │
│                   │ API Routes  │                            │
│                   │  (Next.js)  │                            │
│                   └──────┬──────┘                            │
└──────────────────────────┼───────────────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │     Supabase           │
              │  ┌─────────────────┐   │
              │  │ PostgreSQL DB   │   │
              │  │ (our schema)    │   │
              │  └─────────────────┘   │
              │  ┌─────────────────┐   │
              │  │   Auth          │   │
              │  │ (user mgmt)     │   │
              │  └─────────────────┘   │
              │  ┌─────────────────┐   │
              │  │  Real-time      │   │
              │  │ (subscriptions) │   │
              │  └─────────────────┘   │
              └────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  External APIs         │
              │  - Yahoo Finance       │
              │  - Alpha Vantage       │
              └────────────────────────┘
```

---

## Project Structure

```
benihsaham-web/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Portfolio overview
│   │   ├── portfolio/
│   │   │   ├── page.tsx          # Portfolio detail
│   │   │   └── [id]/page.tsx     # Holding detail
│   │   ├── watchlist/page.tsx    # Watchlist management
│   │   ├── valuation/
│   │   │   ├── page.tsx          # Valuation list
│   │   │   └── new/page.tsx      # New valuation form
│   │   └── transactions/page.tsx # Transaction history
│   ├── api/
│   │   ├── stocks/route.ts       # Stock data proxy
│   │   ├── portfolio/route.ts    # Portfolio CRUD
│   │   └── webhooks/route.ts     # External webhooks
│   ├── layout.tsx
│   └── page.tsx                  # Landing page
├── components/
│   ├── ui/                       # shadcn components
│   ├── portfolio/
│   │   ├── portfolio-card.tsx
│   │   ├── holdings-table.tsx
│   │   ├── performance-chart.tsx
│   │   └── allocation-pie.tsx
│   ├── watchlist/
│   │   ├── watchlist-table.tsx
│   │   └── add-stock-modal.tsx
│   ├── valuation/
│   │   ├── valuation-form.tsx
│   │   └── pbv-roe-calculator.tsx
│   └── layout/
│       ├── header.tsx
│       └── sidebar.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── types.ts              # Generated DB types
│   ├── api/
│   │   ├── stocks.ts             # Yahoo Finance wrapper
│   │   └── valuation.ts          # Teguh Hidayat formulas
│   └── hooks/
│       ├── use-portfolio.ts
│       ├── use-watchlist.ts
│       └── use-valuation.ts
├── stores/
│   └── portfolio-store.ts        # Zustand store
└── types/
    └── portfolio.ts              # Shared types
```

---

## Core Components Spec

### 1. Portfolio Overview Page (`/dashboard`)

**Components:**
- `PortfolioSummaryCard` - Total value, return %, daily change
- `HoldingsTable` - List of current positions
- `PerformanceChart` - Line chart of portfolio value over time
- `AllocationPieChart` - Sector/stock allocation

**Data Required:**
```typescript
interface PortfolioSummary {
  totalValue: number;
  totalReturn: number;
  totalReturnPct: number;
  dailyChange: number;
  dailyChangePct: number;
  holdingsCount: number;
}

interface Holding {
  id: string;
  stock: {
    code: string;
    name: string;
    sector: string;
  };
  shares: number;
  avgCost: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnl: number;
  unrealizedPnlPct: number;
}
```

### 2. Watchlist Page (`/dashboard/watchlist`)

**Components:**
- `WatchlistTable` - Filterable list of watched stocks
- `AddStockModal` - Search and add stocks
- `StockDetailCard` - Quick view of thesis/triggers

**Data Required:**
```typescript
interface WatchlistItem {
  id: string;
  stock: Stock;
  status: 'watch' | 'deep_dive' | 'ready' | 'reject';
  priority: 'low' | 'medium' | 'high';
  thesis: string;
  triggerBuy: string;
  triggerSell: string;
}
```

### 3. Valuation Form (`/dashboard/valuation/new`)

**Components:**
- `ValuationForm` - Multi-step form for stock analysis
- `PBVROECalculator` - Auto-calculate Future Value
- `ThesisEditor` - Rich text for thesis/risks

**Form Fields:**
```typescript
interface ValuationInput {
  stockId: string;
  asOfDate: Date;
  price: number;
  pbv: number;
  roe: number;  // Decimal (0.192 = 19.2%)
  bvps: number;
  fundamentalRating: 'poor' | 'fair' | 'good' | 'excellent';
  managementRating: 'poor' | 'fair' | 'good' | 'excellent';
  thesis: string;
  risks: string;
  catalysts: string;
}
```

**Auto-calculations:**
```typescript
// Future Value = BVPS × (1 + ROE)^5
const calculateFV = (bvps: number, roe: number): number => {
  return bvps * Math.pow(1 + roe, 5);
};

// Fair Value = FV × target PBV (typically 1.0-1.5x)
const calculateFairValue = (fv: number, targetPBV: number): number => {
  return fv * targetPBV;
};

// Margin of Safety = (Fair Value - Price) / Fair Value × 100%
const calculateMoS = (fairValue: number, price: number): number => {
  return ((fairValue - price) / fairValue) * 100;
};
```

---

## API Integration Plan

### Yahoo Finance API (MVP)

```typescript
// lib/api/stocks.ts
export const stockAPI = {
  getQuote: async (symbol: string) => {
    // Fetch current price, previous close, day change
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.JK`
    );
    const data = await response.json();
    return parseQuote(data);
  },

  getHistorical: async (symbol: string, period: '1mo' | '3mo' | '1y') => {
    // Fetch OHLCV historical data
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.JK?interval=1d&range=${period}`
    );
    return parseHistorical(data);
  },

  searchStocks: async (query: string) => {
    // Search IDX stocks
    const response = await fetch(
      `https://query2.finance.yahoo.com/v1/finance/search?q=${query}&quotesCount=10&country=Indonesia`
    );
    return parseSearch(data);
  }
};
```

**Note:** Yahoo Finance uses `.JK` suffix for Indonesian stocks (e.g., `BBCA.JK`).

---

## Authentication Flow

### Supabase Auth

```typescript
// app/(auth)/login/page.tsx
export default function LoginPage() {
  const supabase = createClientComponentClient();

  const handleLogin = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    // Handle error / redirect
  };
}
```

**Protected Routes:**
```typescript
// middleware.ts
export const middleware = async (req: NextRequest) => {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
};
```

---

## MVP Feature Scope

### Phase 1 (Week 1-2)
- [ ] Project setup (Next.js + Supabase)
- [ ] Authentication (login/register)
- [ ] Database schema deployment
- [ ] Portfolio overview page (read-only)

### Phase 2 (Week 3-4)
- [ ] Holdings table with real-time prices
- [ ] Performance chart (Recharts)
- [ ] Transaction history
- [ ] Basic watchlist

### Phase 3 (Week 5-6)
- [ ] Valuation form with auto-calculations
- [ ] Buy/Sell transaction recording
- [ ] Indonesian market formatting (IDR, lots)
- [ ] Content export features

---

## Indonesian Market Specifics

### Number Formatting
```typescript
const formatIDR = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Example: 9150000 → "Rp9.150.000"
```

### Lot Display
```typescript
const formatLots = (shares: number): string => {
  const lots = Math.floor(shares / 100);
  const remainder = shares % 100;
  return remainder > 0 ? `${lots} lot ${remainder} lembar` : `${lots} lot`;
};

// Example: 500 → "5 lot", 550 → "5 lot 50 lembar"
```

### Fee Calculation
```typescript
const calculateBuyFee = (amount: number): FeeBreakdown => {
  const brokerage = Math.max(amount * 0.0025, 5000);  // Max 0.25%, min Rp5.000
  const levy = amount * 0.0004;                        // 0.04% KPEI
  const vat = brokerage * 0.11;                        // 11% VAT on brokerage

  return {
    gross: amount,
    brokerage,
    levy,
    vat,
    total: amount + brokerage + levy + vat,
  };
};
```

---

## Deployment Plan

### Development
- Local: `npm run dev`
- Supabase local: `supabase start`

### Staging
- Vercel preview deployments
- Supabase branch: `develop`

### Production
- Vercel: `benihsaham.com`
- Supabase: Production project
- Custom domain + SSL

---

## Next Steps for BEN-5

1. **Setup Next.js project** with TypeScript and Tailwind
2. **Configure Supabase** and deploy database schema
3. **Implement authentication** flow
4. **Build Portfolio Overview** page first
5. **Integrate Yahoo Finance API** for stock data
6. **Add watchlist** functionality
7. **Build valuation form** with Teguh Hidayat formulas

---

*Document Version: 1.0*
*Last Updated: 2026-04-16*
*Designed for: BenihSaham MVP UI*

# BenihSaham — Web Application

Portfolio tracking saham IDX dengan metode value investing. Platform untuk memantau investasi saham Indonesia dengan pendekatan fundamental ala Teguh Hidayat.

## Tentang BenihSaham

BenihSaham adalah aplikasi web untuk investor saham Indonesia yang ingin:

- Melacak portofolio saham IDX secara terorganisir
- Mencatat riwayat transaksi (beli/jual) dengan lengkap
- Memantau watchlist saham potensial
- Mengukur performa investasi dengan metode value investing

## Fitur

### 📊 Dashboard
- Ringkasan portofolio dengan total return
- Posisi saham saat ini (holdings)
- P&L real-time per posisi

### 📈 Portfolio Tracking
- Kelola multiple portfolio
- Catat transaksi buy/sell dengan lengkap
- Hitung otomatis: average cost, market value, unrealized P&L

### 📝 Transaction History
- Riwayat lengkap semua transaksi
- Detail: harga, lot, fee, settlement date
- Summary total pembelian, penjualan, dan fee

### 👀 Watchlist
- Pantau saham potensial
- Status tracking: Watch, Deep Dive, Ready, Reject
- Catat thesis & trigger harga

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: SQLite dengan Prisma ORM
- **Auth**: NextAuth.js
- **Deployment**: Ready untuk Vercel

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm atau pnpm

### Installation

1. Clone repository:
```bash
git clone <repo-url>
cd benihsaham/web
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment:
```bash
cp .env.example .env
```

Edit `.env` dan isi:
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<generate-random-secret>"
```

4. Setup database:
```bash
npx prisma generate
npx prisma db push
```

5. Run development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

### Default User

Untuk development, buat user baru melalui halaman register.

## Project Structure

```
web/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── api/          # API routes
│   │   ├── dashboard/    # Dashboard page
│   │   ├── transactions/ # Transaction history
│   │   ├── watchlist/    # Watchlist page
│   │   └── layout.tsx    # Root layout
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── layout/      # Layout components
│   │   └── portfolio/   # Portfolio-specific components
│   └── lib/             # Utility libraries
├── prisma/
│   └── schema.prisma    # Database schema
└── public/              # Static assets
```

## API Endpoints

- `GET/POST /api/portfolio` — Manage portfolios
- `GET /api/holdings` — Get portfolio holdings
- `GET/POST /api/transactions` — Transaction history
- `GET/POST /api/watchlist` — Watchlist management
- `GET /api/stocks` — Stock data lookup
- `POST /api/register` — User registration

## Development

### Generate Prisma Client

```bash
npx prisma generate
```

### Database Migrations

```bash
npx prisma db push    # Development (sync schema)
npx prisma migrate dev # Production migrations
```

### Type Checking

```bash
npm run type-check
```

## Production Deployment

### Vercel (Recommended)

1. Push ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Set environment variables
4. Deploy

### Environment Variables

Pastikan set di production:
```
DATABASE_URL=<production-db-url>
NEXTAUTH_URL=<production-url>
NEXTAUTH_SECRET=<strong-random-secret>
```

## Documentation

- [CLAUDE.md](../CLAUDE.md) — Project instructions untuk AI assistant
- [AGENTS.md](../AGENTS.md) — Agent configuration
- [docs/](../docs/) — Methodologi value investing & analisis

## License

BenihSaham © 2026

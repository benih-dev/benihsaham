# Data Models: Portfolio Tracking System
**Version:** 1.0
**Date:** 2026-04-16
**Designer:** Founding Engineer (BIMA)
**Target:** BenihSaham Portfolio Engine

---

## Overview

This document defines the core data models for BenihSaham's portfolio tracking system, designed specifically for Indonesian stock market (IDX) with value investing methodology based on Teguh Hidayat's framework.

### Design Principles
1. **Single source of truth** - Each data point has one authoritative source
2. **Audit trail** - All investment decisions are traceable
3. **Indonesian market specifics** - Lot sizes (100 shares), T+2 settlement, IDR currency
4. **Value investing focus** - Support for PBV, ROE, Future Value calculations
5. **Content-first** - Data structured to enable content creation

---

## Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     User        │       │   Portfolio     │       │    Holding      │
│─────────────────│       │─────────────────│       │─────────────────│
│ id (PK)         │───1:N─│ id (PK)         │───1:N─│ id (PK)         │
│ email           │       │ user_id (FK)    │       │ portfolio_id(FK)│
│ name            │       │ name            │       │ stock_id (FK)   │
│ subscription    │       │ initial_capital │       │ shares          │
│ created_at      │       │ created_at      │       │ avg_cost        │
└─────────────────┘       └─────────────────┘       │ current_price   │
                                                     │ unrealized_pnl  │
                                                     │ bought_at       │
                                                     └─────────────────┘
                                                            │
                                                            │ N:1
                                                            ▼
                                              ┌─────────────────────────┐
                                              │         Stock           │
                                              │─────────────────────────│
                                              │ id (PK)                 │
                                              │ code (UNIQUE)           │
                                              │ name                    │
                                              │ sector                  │
                                              │ industry                │
                                              │ market_cap              │
                                              │ listed_date             │
                                              │ is_index_member         │
                                              └─────────────────────────┘
                                                      │
                                    ┌─────────────────┼─────────────────┐
                                    │                 │                 │
                                    │ N:1             │ N:1             │ N:1
                                    ▼                 ▼                 ▼
                          ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
                          │  Valuation   │  │ PriceHistory │  │  Dividend    │
                          │──────────────│  │──────────────│  │──────────────│
                          │ id (PK)      │  │ id (PK)      │  │ id (PK)      │
                          │ stock_id (FK)│  │ stock_id (FK)│  │ stock_id (FK)│
                          │ as_of_date   │  │ date         │  │ ex_date      │
                          │ price        │  │ open         │  │ amount_per_sh│
                          │ pbv          │  │ high         │  │ payment_date  │
                          │ roe          │  │ low          │  │ yield_pct    │
                          │ bvps         │  │ close        │  └──────────────┘
                          │ fv_5yr       │  │ volume       │
                          │ fair_value   │  └──────────────┘
                          │ margin_safety│
                          │ recommendation│
                          └──────────────┘

┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   Transaction   │       │  WatchlistItem  │       │   ContentDraft  │
│─────────────────│       │─────────────────│       │─────────────────│
│ id (PK)         │       │ id (PK)         │       │ id (PK)         │
│ portfolio_id(FK)│       │ user_id (FK)    │       │ stock_id (FK)   │
│ stock_id (FK)   │       │ stock_id (FK)   │       │ type            │
│ type            │       │ status          │       │ title           │
│ shares          │       │ thesis          │       │ status          │
│ price           │       │ trigger_buy     │       │ created_at      │
│ fee             │       │ trigger_sell    │       │ published_at    │
│ settlement_date │       │ priority        │       └─────────────────┘
│ transaction_at  │       │ notes          │
│ notes           │       │ created_at      │
└─────────────────┘       └─────────────────┘
```

---

## Core Entities

### 1. Stock (Saham IDX)

Represents an IDX-listed security.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| code | VARCHAR(4) | UNIQUE, NOT NULL | IDX stock code (e.g., "BBCA") |
| name | VARCHAR(255) | NOT NULL | Full company name |
| sector | VARCHAR(100) | | IDX sector (Finance, Consumer, etc.) |
| industry | VARCHAR(100) | | Sub-industry classification |
| market_cap | BIGINT | | Market cap in IDR |
| listed_date | DATE | | IPO listing date |
| is_index_member | BOOLEAN | default false | LQ45/JII/IDX30 member |
| ipo_price | DECIMAL(10,2) | | IPO price per share |
| par_value | DECIMAL(10,2) | default 100 | Par value per share |
| shares_outstanding | BIGINT | | Total shares outstanding |
| created_at | TIMESTAMP | default now | Record creation |
| updated_at | TIMESTAMP | auto update | Last update |

**Indexes:** `code`, `sector`, `is_index_member`

**Indonesian Market Specifics:**
- Stock codes are always 4 letters (e.g., BBCA, BBRI, GOTO)
- Par value typically Rp100 per share
- Market cap in IDR (not USD)

---

### 2. Valuation (Analisis Valuasi)

Stores valuation analysis following Teguh Hidayat's methodology.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| stock_id | UUID | FK → Stock, NOT NULL | Related stock |
| as_of_date | DATE | NOT NULL | Analysis date |
| price | DECIMAL(12,2) | NOT NULL | Market price at analysis |
| pbv | DECIMAL(6,2) | | Price-to-Book Value ratio |
| roe | DECIMAL(6,4) | | Return on Equity (decimal, 0.192 = 19.2%) |
| bvps | DECIMAL(12,2) | | Book Value Per Share |
| fv_5yr | DECIMAL(12,2) | | Future Value (ROE × 5 years) |
| fair_value_min | DECIMAL(12,2) | | Fair value low estimate |
| fair_value_max | DECIMAL(12,2) | | Fair value high estimate |
| margin_of_safety_pct | DECIMAL(6,2) | | Margin of safety percentage |
| fundamental_rating | ENUM | | 'poor', 'fair', 'good', 'excellent' |
| management_rating | ENUM | | 'poor', 'fair', 'good', 'excellent' |
| recommendation | ENUM | | 'buy', 'hold', 'wait', 'reject', 'sell' |
| thesis | TEXT | | Investment thesis summary |
| risks | TEXT | | Key risk factors |
| catalysts | TEXT | | Positive catalysts |
| thesis_broken_trigger | TEXT | | Events that invalidate thesis |
| created_by | VARCHAR(100) | default 'BIMA' | Analyst/agent name |
| created_at | TIMESTAMP | default now | Record creation |
| updated_at | TIMESTAMP | auto update | Last update |

**Indexes:** `stock_id`, `as_of_date`, `recommendation`

**Calculation Formulas (from Teguh Hidayat):**
```
Future Value = BVPS × (1 + ROE)^5
Fair Value = Future Value × target PBV
Margin of Safety = (Fair Value - Price) / Fair Value × 100%
```

---

### 3. Portfolio

Represents an investment portfolio (BenihSaham has one main portfolio).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| user_id | UUID | FK → User, NOT NULL | Portfolio owner |
| name | VARCHAR(100) | NOT NULL | Portfolio name |
| description | TEXT | | Portfolio description |
| initial_capital | DECIMAL(15,2) | NOT NULL | Starting capital (IDR) |
| current_value | DECIMAL(15,2) | default 0 | Current total value |
| total_return | DECIMAL(10,2) | default 0 | Total return (IDR) |
| total_return_pct | DECIMAL(6,2) | default 0 | Total return % |
| status | ENUM | default 'active' | 'active', 'closed', 'archived' |
| created_at | TIMESTAMP | default now | Record creation |
| updated_at | TIMESTAMP | auto update | Last update |

**Indexes:** `user_id`, `status`

---

### 4. Holding (Pegangan Saham)

Current position in a stock within a portfolio.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| portfolio_id | UUID | FK → Portfolio, NOT NULL | Parent portfolio |
| stock_id | UUID | FK → Stock, NOT NULL | Held stock |
| shares | INTEGER | NOT NULL | Number of shares (lot × 100) |
| avg_cost | DECIMAL(12,2) | NOT NULL | Average cost per share |
| current_price | DECIMAL(12,2) | | Latest market price |
| market_value | DECIMAL(15,2) | | shares × current_price |
| unrealized_pnl | DECIMAL(15,2) | | (current_price - avg_cost) × shares |
| unrealized_pnl_pct | DECIMAL(6,2) | | Unrealized return % |
| dividend_received | DECIMAL(15,2) | default 0 | Total dividends received |
| first_bought_at | DATE | NOT NULL | First purchase date |
| last_updated_at | TIMESTAMP | | Last price update |
| created_at | TIMESTAMP | default now | Record creation |
| updated_at | TIMESTAMP | auto update | Last update |

**Unique Constraint:** `(portfolio_id, stock_id)` - one holding per stock per portfolio

**Indexes:** `portfolio_id`, `stock_id`

**Indonesian Market Specifics:**
- `shares` is in actual shares (1 lot = 100 shares)
- `avg_cost` includes transaction fees

---

### 5. Transaction (Transaksi Jual/Beli)

Records buy/sell transactions with T+2 settlement.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| portfolio_id | UUID | FK → Portfolio, NOT NULL | Related portfolio |
| stock_id | UUID | FK → Stock, NOT NULL | Traded stock |
| type | ENUM | NOT NULL | 'buy', 'sell', 'dividend' |
| shares | INTEGER | NOT NULL | Number of shares |
| price | DECIMAL(12,2) | NOT NULL | Price per share |
| gross_amount | DECIMAL(15,2) | | shares × price |
| fee_brokerage | DECIMAL(15,2) | | Brokerage fee (max 0.25%) |
| fee_levy | DECIMAL(15,2) | | Levy fee (0.04% for buy) |
| fee_vat | DECIMAL(15,2) | | VAT (11% of brokerage) |
| net_amount | DECIMAL(15,2) | | Final amount (IDR) |
| settlement_date | DATE | NOT NULL | T+2 settlement date |
| transaction_at | DATE | NOT NULL | Transaction date |
| notes | TEXT | | Transaction notes |
| decision_log_id | UUID | FK → DecisionLog | Related investment decision |
| created_at | TIMESTAMP | default now | Record creation |

**Indexes:** `portfolio_id`, `stock_id`, `transaction_at`, `settlement_date`

**Indonesian Market Fee Structure:**
```
BUY:
- Brokerage: max 0.25% (min Rp5,000)
- Levy: 0.04% (to KPEI)
- VAT: 11% of brokerage

SELL:
- Brokerage: max 0.25% (min Rp5,000)
- VAT: 11% of brokerage
- Levy: 0.04% (to KPEI)
```

**T+2 Settlement:** Trade settles 2 business days after transaction date.

---

### 6. PriceHistory (Data Harga Harian)

Historical daily price data.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| stock_id | UUID | FK → Stock, NOT NULL | Related stock |
| date | DATE | NOT NULL | Price date |
| open | DECIMAL(12,2) | | Opening price |
| high | DECIMAL(12,2) | | Daily high |
| low | DECIMAL(12,2) | | Daily low |
| close | DECIMAL(12,2) | NOT NULL | Closing price |
| volume | BIGINT | | Trading volume |
| value | DECIMAL(20,2) | | Trading value (IDR) |
| created_at | TIMESTAMP | default now | Record creation |

**Unique Constraint:** `(stock_id, date)` - one record per stock per day

**Indexes:** `stock_id`, `date`, `(stock_id, date)`

---

### 7. Dividend (Data Dividen)

Dividend payment history.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| stock_id | UUID | FK → Stock, NOT NULL | Related stock |
| type | ENUM | NOT NULL | 'cash', 'stock' |
| ex_date | DATE | NOT NULL | Ex-dividend date |
| record_date | DATE | | Record date |
| payment_date | DATE | | Payment date |
| amount_per_share | DECIMAL(10,2) | | Cash dividend per share |
| stock_ratio | DECIMAL(6,4) | | Stock dividend ratio |
| yield_pct | DECIMAL(6,2) | | Dividend yield at announcement |
| fiscal_year | INTEGER | | Related fiscal year |
| created_at | TIMESTAMP | default now | Record creation |

**Indexes:** `stock_id`, `ex_date`, `payment_date`

---

### 8. WatchlistItem (Daftar Pantauan)

Stocks being monitored for potential investment.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| user_id | UUID | FK → User, NOT NULL | Watchlist owner |
| stock_id | UUID | FK → Stock, NOT NULL | Watched stock |
| status | ENUM | NOT NULL | 'watch', 'deep_dive', 'ready', 'reject' |
| priority | ENUM | default 'medium' | 'low', 'medium', 'high' |
| thesis | TEXT | | Investment thesis |
| trigger_buy | TEXT | | Buy trigger conditions |
| trigger_sell | TEXT | | Sell trigger conditions |
| reject_reason | TEXT | | Reason if rejected |
| notes | TEXT | | Additional notes |
| added_at | TIMESTAMP | default now | Added to watchlist |
| updated_at | TIMESTAMP | auto update | Last update |

**Unique Constraint:** `(user_id, stock_id)` - one entry per stock per user

**Indexes:** `user_id`, `stock_id`, `status`, `priority`

---

### 9. DecisionLog (Jurnal Keputusan)

Audit trail for all investment decisions.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| portfolio_id | UUID | FK → Portfolio | Related portfolio |
| stock_id | UUID | FK → Stock, NOT NULL | Related stock |
| action | ENUM | NOT NULL | 'buy', 'sell', 'hold', 'skip' |
| decision_date | DATE | NOT NULL | Decision date |
| rationale | TEXT | NOT NULL | Full reasoning |
| valuation_id | UUID | FK → Valuation | Related valuation |
| requires_approval | BOOLEAN | default false | Needs board approval |
| approved_by | VARCHAR(100) | | Approver name |
| approval_date | DATE | | Approval date |
| content_friendly | BOOLEAN | default true | Can be used for content |
| created_at | TIMESTAMP | default now | Record creation |

**Indexes:** `portfolio_id`, `stock_id`, `decision_date`

---

### 10. ContentDraft (Draft Konten)

Links investment analysis to content creation.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| stock_id | UUID | FK → Stock | Related stock (optional) |
| decision_log_id | UUID | FK → DecisionLog | Source decision |
| type | ENUM | NOT NULL | 'article', 'video', 'newsletter' |
| title | VARCHAR(255) | NOT NULL | Content title |
| slug | VARCHAR(255) | | URL slug |
| status | ENUM | default 'draft' | 'draft', 'review', 'published', 'archived' |
| educational_angle | TEXT | | Key learning point |
| draft_content | TEXT | | Draft content |
| published_url | VARCHAR(500) | | Published URL |
| published_at | TIMESTAMP | | Publication date |
| created_at | TIMESTAMP | default now | Record creation |
| updated_at | TIMESTAMP | auto update | Last update |

**Indexes:** `stock_id`, `status`, `published_at`

---

## Database Schema (SQL)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUM types
CREATE TYPE transaction_type AS ENUM ('buy', 'sell', 'dividend');
CREATE TYPE recommendation_type AS ENUM ('buy', 'hold', 'wait', 'reject', 'sell');
CREATE TYPE rating_type AS ENUM ('poor', 'fair', 'good', 'excellent');
CREATE TYPE watchlist_status AS ENUM ('watch', 'deep_dive', 'ready', 'reject');
CREATE TYPE priority_type AS ENUM ('low', 'medium', 'high');
CREATE TYPE action_type AS ENUM ('buy', 'sell', 'hold', 'skip');
CREATE TYPE content_type AS ENUM ('article', 'video', 'newsletter');
CREATE TYPE content_status AS ENUM ('draft', 'review', 'published', 'archived');
CREATE TYPE portfolio_status AS ENUM ('active', 'closed', 'archived');
CREATE TYPE dividend_type AS ENUM ('cash', 'stock');

-- Stocks table
CREATE TABLE stocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(4) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    sector VARCHAR(100),
    industry VARCHAR(100),
    market_cap BIGINT,
    listed_date DATE,
    is_index_member BOOLEAN DEFAULT false,
    ipo_price DECIMAL(10,2),
    par_value DECIMAL(10,2) DEFAULT 100,
    shares_outstanding BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stocks_code ON stocks(code);
CREATE INDEX idx_stocks_sector ON stocks(sector);
CREATE INDEX idx_stocks_index_member ON stocks(is_index_member);

-- Users table (simplified for MVP)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    subscription_type VARCHAR(50) DEFAULT 'free',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Portfolios table
CREATE TABLE portfolios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    initial_capital DECIMAL(15,2) NOT NULL,
    current_value DECIMAL(15,2) DEFAULT 0,
    total_return DECIMAL(10,2) DEFAULT 0,
    total_return_pct DECIMAL(6,2) DEFAULT 0,
    status portfolio_status DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_portfolios_user ON portfolios(user_id);
CREATE INDEX idx_portfolios_status ON portfolios(status);

-- Holdings table
CREATE TABLE holdings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id),
    stock_id UUID NOT NULL REFERENCES stocks(id),
    shares INTEGER NOT NULL,
    avg_cost DECIMAL(12,2) NOT NULL,
    current_price DECIMAL(12,2),
    market_value DECIMAL(15,2),
    unrealized_pnl DECIMAL(15,2),
    unrealized_pnl_pct DECIMAL(6,2),
    dividend_received DECIMAL(15,2) DEFAULT 0,
    first_bought_at DATE NOT NULL,
    last_updated_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(portfolio_id, stock_id)
);

CREATE INDEX idx_holdings_portfolio ON holdings(portfolio_id);
CREATE INDEX idx_holdings_stock ON holdings(stock_id);

-- Transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id),
    stock_id UUID NOT NULL REFERENCES stocks(id),
    type transaction_type NOT NULL,
    shares INTEGER NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    gross_amount DECIMAL(15,2),
    fee_brokerage DECIMAL(15,2),
    fee_levy DECIMAL(15,2),
    fee_vat DECIMAL(15,2),
    net_amount DECIMAL(15,2),
    settlement_date DATE NOT NULL,
    transaction_at DATE NOT NULL,
    notes TEXT,
    decision_log_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_portfolio ON transactions(portfolio_id);
CREATE INDEX idx_transactions_stock ON transactions(stock_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_at);
CREATE INDEX idx_transactions_settlement ON transactions(settlement_date);

-- Valuations table
CREATE TABLE valuations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stock_id UUID NOT NULL REFERENCES stocks(id),
    as_of_date DATE NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    pbv DECIMAL(6,2),
    roe DECIMAL(6,4),
    bvps DECIMAL(12,2),
    fv_5yr DECIMAL(12,2),
    fair_value_min DECIMAL(12,2),
    fair_value_max DECIMAL(12,2),
    margin_of_safety_pct DECIMAL(6,2),
    fundamental_rating rating_type,
    management_rating rating_type,
    recommendation recommendation_type,
    thesis TEXT,
    risks TEXT,
    catalysts TEXT,
    thesis_broken_trigger TEXT,
    created_by VARCHAR(100) DEFAULT 'BIMA',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_valuations_stock ON valuations(stock_id);
CREATE INDEX idx_valuations_date ON valuations(as_of_date);
CREATE INDEX idx_valuations_recommendation ON valuations(recommendation);

-- Price history table
CREATE TABLE price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stock_id UUID NOT NULL REFERENCES stocks(id),
    date DATE NOT NULL,
    open DECIMAL(12,2),
    high DECIMAL(12,2),
    low DECIMAL(12,2),
    close DECIMAL(12,2) NOT NULL,
    volume BIGINT,
    value DECIMAL(20,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(stock_id, date)
);

CREATE INDEX idx_price_history_stock ON price_history(stock_id);
CREATE INDEX idx_price_history_date ON price_history(date);
CREATE INDEX idx_price_history_stock_date ON price_history(stock_id, date);

-- Dividends table
CREATE TABLE dividends (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stock_id UUID NOT NULL REFERENCES stocks(id),
    type dividend_type NOT NULL,
    ex_date DATE NOT NULL,
    record_date DATE,
    payment_date DATE,
    amount_per_share DECIMAL(10,2),
    stock_ratio DECIMAL(6,4),
    yield_pct DECIMAL(6,2),
    fiscal_year INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dividends_stock ON dividends(stock_id);
CREATE INDEX idx_dividends_ex_date ON dividends(ex_date);
CREATE INDEX idx_dividends_payment ON dividends(payment_date);

-- Watchlist table
CREATE TABLE watchlist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    stock_id UUID NOT NULL REFERENCES stocks(id),
    status watchlist_status NOT NULL,
    priority priority_type DEFAULT 'medium',
    thesis TEXT,
    trigger_buy TEXT,
    trigger_sell TEXT,
    reject_reason TEXT,
    notes TEXT,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, stock_id)
);

CREATE INDEX idx_watchlist_user ON watchlist_items(user_id);
CREATE INDEX idx_watchlist_stock ON watchlist_items(stock_id);
CREATE INDEX idx_watchlist_status ON watchlist_items(status);

-- Decision log table
CREATE TABLE decision_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID REFERENCES portfolios(id),
    stock_id UUID NOT NULL REFERENCES stocks(id),
    action action_type NOT NULL,
    decision_date DATE NOT NULL,
    rationale TEXT NOT NULL,
    valuation_id UUID REFERENCES valuations(id),
    requires_approval BOOLEAN DEFAULT false,
    approved_by VARCHAR(100),
    approval_date DATE,
    content_friendly BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_decision_logs_portfolio ON decision_logs(portfolio_id);
CREATE INDEX idx_decision_logs_stock ON decision_logs(stock_id);
CREATE INDEX idx_decision_logs_date ON decision_logs(decision_date);

-- Content drafts table
CREATE TABLE content_drafts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stock_id UUID REFERENCES stocks(id),
    decision_log_id UUID REFERENCES decision_logs(id),
    type content_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    status content_status DEFAULT 'draft',
    educational_angle TEXT,
    draft_content TEXT,
    published_url VARCHAR(500),
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_content_drafts_stock ON content_drafts(stock_id);
CREATE INDEX idx_content_drafts_status ON content_drafts(status);
CREATE INDEX idx_content_drafts_published ON content_drafts(published_at);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_stocks_updated_at BEFORE UPDATE ON stocks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON portfolios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_holdings_updated_at BEFORE UPDATE ON holdings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_valuations_updated_at BEFORE UPDATE ON valuations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_watchlist_items_updated_at BEFORE UPDATE ON watchlist_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_drafts_updated_at BEFORE UPDATE ON content_drafts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## Key Design Decisions

### 1. UUID vs Integer IDs
**Decision:** UUID for all primary keys
**Rationale:**
- Distributed system compatibility
- No ID prediction security risk
- Easier data merging across environments

### 2. Separate Holdings vs Transactions
**Decision:** Holdings represents current state; Transactions is immutable history
**Rationale:**
- Holdings for quick position queries
- Transactions for audit trail and performance analysis
- Holdings computed from transactions on reconciliation

### 3. T+2 Settlement Support
**Decision:** Separate `transaction_at` and `settlement_date` fields
**Rationale:**
- Indonesian market uses T+2 settlement
- Cash balance tracking requires settlement date
- Accurate performance measurement

### 4. Lot Size Handling
**Decision:** Store actual share count, not lots
**Rationale:**
- 1 lot = 100 shares in IDX
- Storing shares is more precise
- Display can show lots when needed (shares / 100)

### 5. Valuation Versioning
**Decision:** New valuation record for each analysis date
**Rationale:**
- Full audit trail of valuation changes
- Track how thesis evolves over time
- Enable content showing "then vs now"

### 6. Content-First Design
**Decision:** Link decisions and valuations to content drafts
**Rationale:**
- BenihSaham's revenue depends on content
- Every investment decision becomes content material
- Trace content back to source analysis

---

## MVP Implementation Notes

For MVP (Phase 1), focus on:
1. **Stocks** - with basic data
2. **Valuations** - core PBV/ROE/FV analysis
3. **Watchlist** - tracking candidates
4. **Holdings** - single portfolio for BenihSaham
5. **Transactions** - buy/sell records
6. **Price History** - via external API (Yahoo Finance)

Deferred to Phase 2:
- Multiple users/portfolios
- Content drafts integration
- Decision log audit trail
- Real-time price updates

---

## API Integration Notes

Based on BEN-3 research:
- **MVP:** Yahoo Finance API (free, sufficient for basic data)
- **Production:** Alpha Vantage or RTI Business (Indonesia-specific)

Required API endpoints:
1. Stock quote (current price)
2. Historical prices (daily OHLCV)
3. Company info (sector, market cap)
4. Dividend history

---

*Document Version: 1.0*
*Last Updated: 2026-04-16*
*Designed for: BenihSaham Portfolio Engine*

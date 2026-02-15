# Data Playground

Browser-based tool for JSON/CSV data transformation. Parse, filter, transform, and export data with shareable session links.

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=flat&logo=postgresql&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

**Live Demo:** https://data-playground-beta.vercel.app

## What it does

Handles JSON and CSV data in the browser. Auto-detects format, shows preview table with pagination, lets you filter and select columns, then exports to JSON or CSV. Sessions can be saved and shared via URL (expires after 7 days).

## Features

**Data Input**

- Auto-detects JSON (arrays, nested objects, API responses) and CSV
- File upload or direct paste
- Sample datasets (Users, Products, Sales)

**Transformations**

- Column selection (pick specific columns to keep)
- Advanced filtering with 12 operators:
  - Text: equals, contains, startsWith, endsWith
  - Numeric: greaterThan, lessThan, >=, <=
  - Special: isEmpty, isNotEmpty, isNull
- Real-time preview with before/after row counts

**Export**

- Download as JSON or CSV
- Copy to clipboard
- Format preview (first 10 rows)

**Session Sharing**

- Saves data + transformations to PostgreSQL
- Generates 8-char short URLs (nanoid)
- Auto-expires after 7 days
- Loads from URL param `?session=xxx`

## Architecture

```
┌─────────────────────────────────────────────────────┐
│         Next.js Frontend (Client Components)        │
│  Parser → DataTable → Filters → Export              │
│  All processing happens in browser                  │
└─────────────────┬───────────────────────────────────┘
                  │ (Only for session save/load)
┌─────────────────▼───────────────────────────────────┐
│            Next.js API Routes (Serverless)          │
│  POST /api/sessions  │  GET /api/sessions/[id]      │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│         Neon PostgreSQL (Serverless)                │
│  Sessions table with JSONB data + 7-day expiry      │
└─────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **Parsing:** PapaParse for CSV
- **State:** React hooks (useState, useMemo, useEffect)

### Backend

- **API:** Next.js API Routes (serverless functions)
- **Database:** Neon PostgreSQL with @neondatabase/serverless
- **Session IDs:** nanoid (8-character short URLs)

### Development

- **Testing:** Vitest + React Testing Library (15 tests)
- **Linting:** ESLint 8 + Prettier
- **Pre-commit:** Husky + lint-staged (auto-format on commit)

## Project Structure

```
data-playground/
├── app/
│   ├── page.tsx              # Main page with data flow
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Tailwind imports
│   └── api/sessions/         # Save/load API routes
│       ├── route.ts          # POST /api/sessions
│       └── [id]/route.ts     # GET /api/sessions/:id
├── components/
│   ├── Input.tsx             # File upload, paste, sample data
│   ├── DataTable.tsx         # Paginated table (50 rows/page)
│   ├── SchemaPanel.tsx       # Column type inference
│   ├── ColumnSelector.tsx    # Column selection UI
│   ├── FilterBuilder.tsx     # Filter builder with 12 operators
│   ├── ExportPanel.tsx       # Download/copy with format toggle
│   └── SharePanel.tsx        # Session save and share
├── lib/
│   ├── types/                # TypeScript definitions
│   ├── utils/
│   │   ├── parser.ts         # JSON/CSV detection and parsing
│   │   ├── schema.ts         # Type inference (string, number, date, etc.)
│   │   ├── transformations.ts # Filter logic
│   │   └── export.ts         # JSON/CSV conversion
│   ├── db.ts                 # Neon connection
│   ├── schema.sql            # Database schema
│   └── samples.ts            # Sample datasets
└── __tests__/                # Unit tests (Vitest)
```

## Technical Details

**JSON Parsing**

- Accepts any valid JSON (not just arrays)
- Extracts nested arrays from common patterns:
  - `{"data": [...]}` → extracts `data` array
  - `{"results": [...]}` → extracts `results` array
  - Single objects get wrapped in array for consistent handling

**Type Inference**

- Scans first 100 rows to infer column types
- Detects: string, number, boolean, date, null, object, array
- Mixed types get labeled as "mixed"

**Filtering**

- AND logic (all filters must pass)
- Type-safe comparisons (converts values before comparing)
- Empty/null checks work correctly

**Database Schema**

```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,           -- 8-char nanoid
  data JSONB NOT NULL,           -- Parsed data
  transformations JSONB NOT NULL, -- Filter/column state
  format TEXT NOT NULL,          -- 'json' | 'csv'
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '7 days'
);
```

**Performance**

- All parsing and transformations run client-side (no server load)
- Pagination renders 50 rows at a time
- useMemo prevents unnecessary recalculations
- Suspense boundary for useSearchParams

## Local Setup

### Prerequisites

- Node.js 18+
- Neon PostgreSQL account (free tier works)

### Installation

```bash
git clone https://github.com/vidya381/data-playground.git
cd data-playground
npm install
```

### Database Setup

1. Create project at [console.neon.tech](https://console.neon.tech)
2. Run schema from `lib/schema.sql` in Neon SQL Editor
3. Create `.env.local`:

```bash
DATABASE_URL=postgresql://user:password@host/database
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Run Development Server

```bash
npm run dev  # http://localhost:3000
```

### Run Tests

```bash
npm test
```

### Build for Production

```bash
npm run build
npm start
```

## How it Works

**Format Detection**

- Tries `JSON.parse()` first
- If that fails, checks for CSV patterns (commas + newlines)
- Returns null if neither format detected

**Data Flow**

1. Input → Detect format (JSON/CSV)
2. Parse → Convert to internal array-of-objects
3. Transform → Apply filters and column selection
4. Preview → Show paginated table with schema
5. Export → Convert to target format and download/copy

**Session Sharing**

- Saves data + transformations to Neon as JSONB
- Generates short ID with nanoid (8 chars)
- Returns URL like `/?session=KGYZLtXI`
- Auto-loads on page visit if `?session` param exists
- PostgreSQL auto-deletes expired sessions (7 days)

---

Built with Next.js, TypeScript, Tailwind CSS, and Neon PostgreSQL.

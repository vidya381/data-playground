# Database Setup Guide

## 1. Create Neon Database

1. Go to [Neon Console](https://console.neon.tech)
2. Sign up / Log in
3. Create a new project: "data-playground"
4. Copy the connection string

## 2. Set Environment Variable

Create `.env.local` file:

```bash
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3. Create Table

Run the schema from `lib/schema.sql` in Neon SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  transformations JSONB NOT NULL,
  format TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '7 days'
);

CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at DESC);
```

## 4. Test Connection

```bash
npm run dev
# Visit http://localhost:3000
# Save a session - should create entry in Neon
```

## 5. Verify in Neon

Go to Neon Console → Tables → sessions → Should see your saved session

Done! ✅

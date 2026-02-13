-- Database schema for Data Playground sessions

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  transformations JSONB NOT NULL,
  format TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '7 days'
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at DESC);

-- Clean up expired sessions (run periodically)
-- DELETE FROM sessions WHERE expires_at < NOW();

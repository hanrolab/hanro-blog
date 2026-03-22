ALTER TABLE posts ADD COLUMN views INTEGER DEFAULT 0;
ALTER TABLE posts ADD COLUMN excerpt TEXT;

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#1a1a1a'
);

CREATE TABLE IF NOT EXISTS visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(date, visitor_id)
);

INSERT INTO categories (name, slug, color) VALUES
  ('개발', 'dev', '#3B82F6'),
  ('일상', 'daily', '#10B981'),
  ('기술', 'tech', '#8B5CF6'),
  ('회고', 'retrospective', '#F59E0B');

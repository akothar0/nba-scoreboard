-- Games table: updated by the ESPN polling worker
CREATE TABLE IF NOT EXISTS games (
  id TEXT PRIMARY KEY,
  home_team_id TEXT NOT NULL,
  home_team_name TEXT NOT NULL,
  home_team_abbr TEXT NOT NULL,
  home_team_logo TEXT,
  home_team_score INT DEFAULT 0,
  home_team_record TEXT,
  home_team_color TEXT,
  away_team_id TEXT NOT NULL,
  away_team_name TEXT NOT NULL,
  away_team_abbr TEXT NOT NULL,
  away_team_logo TEXT,
  away_team_score INT DEFAULT 0,
  away_team_record TEXT,
  away_team_color TEXT,
  status_state TEXT NOT NULL DEFAULT 'pre',
  status_detail TEXT,
  status_clock TEXT,
  status_period INT DEFAULT 0,
  game_date DATE NOT NULL,
  broadcast TEXT,
  venue_name TEXT,
  venue_city TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User favorites: stores which teams each user follows
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  team_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, team_id)
);

-- Index for fast favorites lookup
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);

-- Index for fast game date queries
CREATE INDEX IF NOT EXISTS idx_games_game_date ON games(game_date);

-- Enable Realtime on games table
ALTER PUBLICATION supabase_realtime ADD TABLE games;

-- RLS: games are public read, worker uses service role for writes
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
CREATE POLICY "games_public_read" ON games FOR SELECT USING (true);

-- RLS: favorites — API routes use service role key, so these are permissive
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "favorites_public_read" ON user_favorites FOR SELECT USING (true);
CREATE POLICY "favorites_public_insert" ON user_favorites FOR INSERT WITH CHECK (true);
CREATE POLICY "favorites_public_delete" ON user_favorites FOR DELETE USING (true);

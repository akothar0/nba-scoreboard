-- Add JSONB detail columns to games table for Phase 2 features
-- leaders: top scorer/rebounder/assister per team with athlete headshots
-- linescores: quarter-by-quarter scoring
-- situation: last play text + win probability percentages
-- notes: game context headline (e.g., "NBA Play-In - East")

ALTER TABLE games ADD COLUMN IF NOT EXISTS leaders JSONB;
ALTER TABLE games ADD COLUMN IF NOT EXISTS linescores JSONB;
ALTER TABLE games ADD COLUMN IF NOT EXISTS situation JSONB;
ALTER TABLE games ADD COLUMN IF NOT EXISTS notes TEXT;

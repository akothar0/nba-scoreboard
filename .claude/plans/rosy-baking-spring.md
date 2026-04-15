# Phase 2: Rich Game Details & Date Navigation

## Status: IMPLEMENTED

## Features

### 1. Expandable Game Cards
- Click any in-progress or completed game card to expand
- Smooth CSS grid animation (grid-rows transition)
- ChevronDown indicator rotates on expand
- Graceful degradation: cards without detail data don't show expand affordance

**Expanded panel contains:**
- **Quarter-by-quarter line scores** — table with Q1-Q4 + OT columns, team rows, totals
- **Win probability bar** — dual-tone bar using team colors with percentage labels, 700ms ease-out animation
- **Top performers** — player headshots with team-color ring, stat value + category (PTS/REB/AST), 2-column grid on desktop

### 2. Date Navigation Timeline
- Horizontal scrollable date strip (±7 days from selected date)
- Left/Right arrow buttons navigate one day at a time
- "Today", "Yesterday", "Tomorrow" labels for relative dates
- Selected date gets inverted pill (white on dark), today gets subtle highlight when not selected
- Header dynamically shows "Today's Games" vs formatted date
- Subtitle switches between "Scores update live" and full date string

### 3. Live Game Context Badges
Colored pills above the status row on game cards:
- **PLAY-IN** (purple) — from `notes` field containing "play-in"
- **PLAYOFFS / FINALS** (amber + trophy icon) — from `notes` field
- **CLUTCH** (red + flame icon) — Q4/OT, score within 5 points
- **CLOSE** (orange + zap icon) — score within 5 points (earlier quarters)
- **BLOWOUT** (muted) — 20+ point differential

### 4. Live Game Enhancements
- Shimmer animation across top of live game cards (team-color gradient)
- Last play ticker shown below scores for live games with situation data
- Card ring highlight: red for live, yellow for favorites

## Data Layer Changes

### Shared Types (`packages/shared/src/types.ts`)
Added interfaces: `GameLeaderEntry`, `GameLeaders`, `PeriodScore`, `GameLinescores`, `GameSituation`
Added Game fields: `leaders`, `linescores`, `situation`, `notes`

### Database Migration (`supabase/migrations/002_add_game_details.sql`)
Added JSONB columns: `leaders`, `linescores`, `situation`
Added TEXT column: `notes`

### Worker (`apps/worker/src/espn.ts`)
- Parses ESPN competitor `leaders` array → `GameLeaders` (top performer per stat per team)
- Parses ESPN competitor `linescores` array → `GameLinescores` (quarter scores)
- Parses ESPN competition `situation` + `odds` → `GameSituation` (last play + win probability)
- Parses ESPN competition `notes` → headline string
- `fetchScoreboard(date?)` now accepts optional YYYY-MM-DD for date-specific queries

### Frontend
- `next.config.ts` — added `a.espncdn.com/i/headshots/**` remote pattern for player photos
- `use-live-scores.ts` — accepts `date` param, subscribes to date-filtered realtime channel
- `scoreboard.tsx` — accepts `date` prop, passes to hook
- `scoreboard-page.tsx` — manages `selectedDate` state, renders `DateNav`

## Files Changed
- `packages/shared/src/types.ts` — new interfaces + Game fields
- `supabase/migrations/002_add_game_details.sql` — new migration
- `apps/worker/src/espn.ts` — ESPN parser for new fields
- `apps/web/next.config.ts` — headshot image pattern
- `apps/web/src/hooks/use-live-scores.ts` — date parameter support
- `apps/web/src/components/game-card.tsx` — full rewrite with expand, badges, leaders, linescores, win prob
- `apps/web/src/components/date-nav.tsx` — new component
- `apps/web/src/components/scoreboard.tsx` — date prop
- `apps/web/src/components/scoreboard-page.tsx` — date state + DateNav integration
- `apps/web/src/app/globals.css` — shimmer keyframe animation

## Deployment Checklist
1. Run migration `002_add_game_details.sql` on Supabase
2. Deploy updated worker to Railway (will start populating new JSONB fields)
3. Deploy updated web app to Vercel

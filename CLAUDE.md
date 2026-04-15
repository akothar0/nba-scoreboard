# NBA Live Scoreboard

## Project Structure
Turborepo monorepo with npm workspaces:
- `apps/web` — Next.js 16 App Router frontend (Vercel)
- `apps/worker` — ESPN API polling worker (Railway)
- `packages/shared` — Shared types and NBA team constants

## Stack
- **Frontend**: Next.js 16 App Router, Tailwind CSS v4, shadcn/ui (Base UI, NOT Radix — use `render` prop, not `asChild`)
- **Auth**: Clerk v7 (`proxy.ts` with `clerkMiddleware()`, `<Show>` not `<SignedIn>`, `auth()` is async)
- **Database**: Supabase (Postgres + Realtime)
- **Data source**: ESPN free API (`site.api.espn.com`)
- **Deployment**: Vercel (web), Railway (worker)
- **Live URL**: https://nba-scoreboard-web.vercel.app

## Key Patterns
- Worker polls ESPN → upserts Supabase `games` table → frontend subscribes via Supabase Realtime
- Games are public read (anon key). Favorites CRUD through API routes (Clerk + service role key).
- Clerk user ID stored directly in `user_favorites` table
- ESPN team logos: `https://a.espncdn.com/i/teamlogos/nba/500/{abbr}.png`
- ESPN player headshots: `https://a.espncdn.com/i/headshots/nba/players/full/{playerId}.png`
- ESPN date-specific scores: `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=YYYYMMDD`

## Supabase Schema
### `games` table
Core columns: `id`, `home_team_id`, `home_team_name`, `home_team_abbr`, `home_team_logo`, `home_team_score`, `home_team_record`, `home_team_color`, `away_team_*` (same), `status_state` (pre/in/post), `status_detail`, `status_clock`, `status_period`, `game_date`, `broadcast`, `venue_name`, `venue_city`, `updated_at`

Detail columns (JSONB): `leaders`, `linescores`, `situation`, `notes`
- `leaders`: top scorer/rebounder/assister with athlete headshot URLs
- `linescores`: `{home: [{period, value}], away: [{period, value}]}`
- `situation`: `{lastPlay: {text}, probability: {homeWinPercentage, awayWinPercentage}}`
- `notes`: game context headline (e.g., "NBA Play-In - East")

### `user_favorites` table
`id` (UUID), `user_id` (Clerk ID), `team_id` (ESPN ID), `created_at`

## Important Gotchas
- shadcn/ui initialized with **Base UI**, not Radix. Use `render` prop instead of `asChild` on triggers.
- Worker tsconfig uses **CommonJS** (`module: "CommonJS"`) — ESNext caused module resolution failures on Railway.
- Worker needs `--env-file=.env` flag in dev script for local env loading.
- Next.js 16 uses `proxy.ts` instead of `middleware.ts` for Clerk middleware.
- next.config.ts must include `images.remotePatterns` for `a.espncdn.com`.

## Commands
```bash
npm run dev          # Run all apps
npm run dev:web      # Run web only
npm run dev:worker   # Run worker only
npm run build        # Build all
```

## Environment Variables
### apps/web (.env.local)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### apps/worker (.env)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Phase 2 (Deployed)
1. **Expandable game cards** — click to reveal quarter scores, player headshots, win probability bar
2. **Date navigation timeline** — horizontal scrollable date strip, ±7 days, arrow keys
3. **Live game context badges** — PLAY-IN, CLUTCH, CLOSE, BLOWOUT, PLAYOFFS/FINALS
4. **Live enhancements** — shimmer animation, last play ticker, win probability bar with team colors

Key components: `game-card.tsx` (expandable card), `date-nav.tsx` (date strip), `scoreboard-page.tsx` (state management)

# NBA Live Scoreboard

## Project Structure
Turborepo monorepo with npm workspaces:
- `apps/web` — Next.js 15 App Router frontend (Vercel)
- `apps/worker` — ESPN API polling worker (Railway)
- `packages/shared` — Shared types and NBA team constants

## Stack
- **Frontend**: Next.js App Router, Tailwind CSS, shadcn/ui
- **Auth**: Clerk (`proxy.ts` with `clerkMiddleware()`, `<Show>` not `<SignedIn>`)
- **Database**: Supabase (Postgres + Realtime)
- **Data source**: ESPN free API (`site.api.espn.com`)
- **Deployment**: Vercel (web), Railway (worker)

## Key Patterns
- Worker polls ESPN → upserts Supabase `games` table → frontend subscribes via Supabase Realtime
- Games are public read (anon key). Favorites CRUD through API routes (Clerk + service role key).
- Clerk user ID stored directly in `user_favorites` table
- ESPN team logos: `https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/{abbr}.png`

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

# NBA Live Scoreboard

A real-time NBA scoreboard with live score updates, personalized team tracking, and rich game details. Built as a showcase project with a "glance-and-go" philosophy — open the app, instantly see your teams' scores.

**Live:** [nba-scoreboard-web.vercel.app](https://nba-scoreboard-web.vercel.app)

## Features

- **Live scores** — real-time updates via Supabase Realtime, no refresh needed
- **Favorite teams** — sign in to pin your teams to the top of the board
- **Expandable game cards** — click any game to see quarter-by-quarter scores, top performer stats with player headshots, and win probability bars
- **Date navigation** — browse past and future games with a scrollable date timeline
- **Live game context** — dynamic badges for PLAY-IN, CLUTCH TIME, CLOSE GAME, and BLOWOUT situations
- **Visual polish** — team-color accents, shimmer animations on live games, last play ticker

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), React 19, Tailwind CSS v4, shadcn/ui |
| Auth | Clerk v7 |
| Database | Supabase (Postgres + Realtime) |
| Data Source | ESPN free API |
| Deployment | Vercel (web), Railway (worker) |

## Architecture

```
ESPN API  -->  Worker (Railway)  -->  Supabase (Postgres)  -->  Frontend (Vercel)
               polls every 30s       games table + Realtime     subscribes to changes
```

The worker polls ESPN's scoreboard API and upserts game data into Supabase. The frontend subscribes to Supabase Realtime for instant updates. Games are public read (anon key). Favorites are managed through authenticated API routes (Clerk + service role key).

## Project Structure

```
nba-scoreboard/
  apps/
    web/          Next.js 16 frontend (Vercel)
    worker/       ESPN polling worker (Railway)
  packages/
    shared/       Shared TypeScript types and NBA team constants
  supabase/
    migrations/   Database schema migrations
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- Supabase project (free tier works)
- Clerk application (free tier works)

### Setup

1. **Clone and install**
   ```bash
   git clone https://github.com/akothar0/nba-scoreboard.git
   cd nba-scoreboard
   npm install
   ```

2. **Run database migrations** on your Supabase project:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_add_game_details.sql`

3. **Configure environment variables**

   `apps/web/.env.local`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
   CLERK_SECRET_KEY=sk_...
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```

   `apps/worker/.env`:
   ```
   SUPABASE_URL=https://xxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```

4. **Run the development servers**
   ```bash
   npm run dev          # Run all apps
   npm run dev:web      # Run web only
   npm run dev:worker   # Run worker only
   ```

## Commands

```bash
npm run dev          # Run all apps in parallel
npm run dev:web      # Run frontend only
npm run dev:worker   # Run ESPN worker only
npm run build        # Build all packages
```

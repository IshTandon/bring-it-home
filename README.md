# Bring It Home

> Every team starts the tournament. Only one nation brings it home.

**FIFA World Cup 2026** fan app — bracket simulator, player cards, live scores, group stage simulator, tournament timeline, and personalised WC Wrapped.

Built for fans who want to *play* the tournament, not just watch it.

---

## Quick start

```bash
cd bring-it-home
cp .env.local.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`. Runs fully on mock data — no API keys needed to get started.

---

## Features

| Feature | Status | Route |
|---|---|---|
| Bracket simulator | Scaffold ready | `/bracket` |
| FIFA-style player cards | Scaffold ready | `/players` |
| "If This Happens" group sim | Scaffold ready | `/groups` |
| Tournament timeline | Scaffold ready | `/timeline` |
| WC Wrapped | Scaffold ready | `/wrapped` |
| Friend leagues | Planned | `/leagues` |

---

## API keys (all free tiers)

| Service | Used for | Free limit | Sign up |
|---|---|---|---|
| API-Football | Live scores, standings, players | 100 req/day | api-football.com |
| OpenWeatherMap | Match-day weather per stadium city | 1,000 req/day | openweathermap.org |
| Anthropic Claude | AI narrative + tactical explainer | Pay-per-use (~$0.01/call) | console.anthropic.com |

Copy `.env.local.example` → `.env.local` and fill in your keys.

---

## Project structure

```
src/
  app/
    api/
      matches/      GET live + today's matches (polls every 30s)
      players/      GET player stats
      simulator/    POST Monte Carlo match simulation
    bracket/        Bracket simulator page
    players/        Player cards page
    groups/         Group stage "If This Happens" page
    timeline/       Tournament story timeline page
    wrapped/        WC Wrapped personalised stats page
  components/
    bracket/        BracketSimulator.tsx  ← build this first
    players/        PlayerCard.tsx, PlayerGrid.tsx
    groups/         IfThisHappens.tsx
    timeline/       TournamentTimeline.tsx
    simulator/      MatchSimulator.tsx
    ui/             StreakBar.tsx, StadiumCard.tsx, TeamInfoPanel.tsx
  lib/
    api-football.ts API-Football wrapper (mock fallback built in)
    weather.ts      OpenWeatherMap wrapper
    claude.ts       Anthropic SDK — server-side only
    store.ts        Zustand (bracket state + predictions, persisted to localStorage)
    data.ts         All mock data
  hooks/
    useMatches.ts   SWR hooks for live data
  types/
    index.ts        All TypeScript types (single source of truth)
```

---

## Opening in Cursor

Open the `bring-it-home` folder in Cursor. The `.cursorrules` file gives Cursor full context on:
- App identity and brand voice
- Stack conventions and file naming
- Which component to build next and in what order
- Where state lives and how to handle API/mock data

**First prompt to give Cursor:**

```
Build the BracketSimulator component for Bring It Home following .cursorrules
```

---

## Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

Add all env vars from `.env.local` in Vercel → Settings → Environment Variables.

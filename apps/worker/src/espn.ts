import type { Game } from "@nba-scoreboard/shared";

const SCOREBOARD_URL =
  "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard";

interface ESPNCompetitor {
  id: string;
  homeAway: "home" | "away";
  team: {
    id: string;
    displayName: string;
    abbreviation: string;
    color?: string;
    logo: string;
  };
  score?: string;
  records?: { summary: string }[];
}

interface ESPNStatus {
  displayClock: string;
  period: number;
  type: {
    state: "pre" | "in" | "post";
    detail: string;
  };
}

interface ESPNEvent {
  id: string;
  date: string;
  competitions: {
    competitors: ESPNCompetitor[];
    status: ESPNStatus;
    venue?: { fullName?: string; address?: { city?: string } };
    broadcast?: { market?: string; names?: string[] };
  }[];
}

function parseGame(event: ESPNEvent): Game {
  const comp = event.competitions[0];
  const home = comp.competitors.find((c) => c.homeAway === "home")!;
  const away = comp.competitors.find((c) => c.homeAway === "away")!;

  const gameDate = event.date.split("T")[0];

  return {
    id: event.id,
    home_team_id: home.team.id,
    home_team_name: home.team.displayName,
    home_team_abbr: home.team.abbreviation,
    home_team_logo: home.team.logo,
    home_team_score: parseInt(home.score || "0", 10),
    home_team_record: home.records?.[0]?.summary ?? null,
    home_team_color: home.team.color ?? null,
    away_team_id: away.team.id,
    away_team_name: away.team.displayName,
    away_team_abbr: away.team.abbreviation,
    away_team_logo: away.team.logo,
    away_team_score: parseInt(away.score || "0", 10),
    away_team_record: away.records?.[0]?.summary ?? null,
    away_team_color: away.team.color ?? null,
    status_state: comp.status.type.state,
    status_detail: comp.status.type.detail,
    status_clock: comp.status.displayClock,
    status_period: comp.status.period,
    game_date: gameDate,
    broadcast: comp.broadcast?.names?.[0] ?? null,
    venue_name: comp.venue?.fullName ?? null,
    venue_city: comp.venue?.address?.city ?? null,
    updated_at: new Date().toISOString(),
  };
}

export async function fetchScoreboard(): Promise<Game[]> {
  const res = await fetch(SCOREBOARD_URL);
  if (!res.ok) {
    throw new Error(`ESPN API error: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  const events: ESPNEvent[] = data.events ?? [];
  return events.map(parseGame);
}

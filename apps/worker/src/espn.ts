import type { Game, GameLeaders, GameLeaderEntry, GameLinescores, GameSituation } from "@nba-scoreboard/shared";

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
  linescores?: { value: number }[];
  leaders?: {
    name: string;
    displayName: string;
    leaders: {
      displayValue: string;
      athlete: {
        id: string;
        displayName: string;
        headshot?: { href: string };
        position?: { abbreviation: string };
      };
    }[];
  }[];
}

interface ESPNStatus {
  displayClock: string;
  period: number;
  type: {
    state: "pre" | "in" | "post";
    detail: string;
  };
}

interface ESPNSituation {
  lastPlay?: { text: string };
  lastEvent?: { text: string };
}

interface ESPNEvent {
  id: string;
  date: string;
  competitions: {
    competitors: ESPNCompetitor[];
    status: ESPNStatus;
    venue?: { fullName?: string; address?: { city?: string } };
    broadcast?: { market?: string; names?: string[] };
    situation?: ESPNSituation;
    odds?: { homeTeamOdds?: { winPercentage?: number }; awayTeamOdds?: { winPercentage?: number } }[];
    notes?: { headline?: string }[];
  }[];
}

function parseLeaders(competitor: ESPNCompetitor): GameLeaderEntry[] {
  if (!competitor.leaders) return [];
  return competitor.leaders.map((cat) => {
    const top = cat.leaders[0];
    return {
      name: cat.name,
      displayValue: top.displayValue,
      athlete: {
        id: top.athlete.id,
        displayName: top.athlete.displayName,
        headshot: top.athlete.headshot?.href ?? "",
        position: top.athlete.position?.abbreviation ?? "",
        team: { abbreviation: competitor.team.abbreviation },
      },
    };
  });
}

function parseLinescores(competitor: ESPNCompetitor): { period: number; value: string }[] {
  if (!competitor.linescores) return [];
  return competitor.linescores.map((ls, i) => ({
    period: i + 1,
    value: String(ls.value),
  }));
}

function parseGame(event: ESPNEvent): Game {
  const comp = event.competitions[0];
  const home = comp.competitors.find((c) => c.homeAway === "home")!;
  const away = comp.competitors.find((c) => c.homeAway === "away")!;

  const gameDate = event.date.split("T")[0];

  // Parse leaders
  const homeLeaders = parseLeaders(home);
  const awayLeaders = parseLeaders(away);
  const leaders: GameLeaders | null =
    homeLeaders.length > 0 || awayLeaders.length > 0
      ? { home: homeLeaders, away: awayLeaders }
      : null;

  // Parse linescores
  const homeLinescores = parseLinescores(home);
  const awayLinescores = parseLinescores(away);
  const linescores: GameLinescores | null =
    homeLinescores.length > 0 || awayLinescores.length > 0
      ? { home: homeLinescores, away: awayLinescores }
      : null;

  // Parse situation (live game context)
  let situation: GameSituation | null = null;
  if (comp.situation || comp.odds) {
    situation = {};
    if (comp.situation?.lastPlay) {
      situation.lastPlay = { text: comp.situation.lastPlay.text };
    }
    const odds = comp.odds?.[0];
    if (odds?.homeTeamOdds?.winPercentage != null) {
      situation.probability = {
        homeWinPercentage: odds.homeTeamOdds.winPercentage,
        awayWinPercentage: odds.awayTeamOdds?.winPercentage ?? (1 - odds.homeTeamOdds.winPercentage),
      };
    }
  }

  // Parse notes (game context like "NBA Play-In - East")
  const notes = comp.notes?.[0]?.headline ?? null;

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
    leaders,
    linescores,
    situation,
    notes,
    updated_at: new Date().toISOString(),
  };
}

export async function fetchScoreboard(date?: string): Promise<Game[]> {
  const url = date
    ? `${SCOREBOARD_URL}?dates=${date.replace(/-/g, "")}`
    : SCOREBOARD_URL;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`ESPN API error: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  const events: ESPNEvent[] = data.events ?? [];
  return events.map(parseGame);
}

export interface NBATeam {
  id: string;
  displayName: string;
  abbreviation: string;
  color: string;
  alternateColor: string;
  logo: string;
  conference: "East" | "West";
}

export interface GameLeaderEntry {
  name: string;
  displayValue: string;
  athlete: {
    id: string;
    displayName: string;
    headshot: string;
    position: string;
    team: { abbreviation: string };
  };
}

export interface GameLeaders {
  home: GameLeaderEntry[];
  away: GameLeaderEntry[];
}

export interface PeriodScore {
  period: number;
  value: string;
}

export interface GameLinescores {
  home: PeriodScore[];
  away: PeriodScore[];
}

export interface GameSituation {
  lastPlay?: { text: string };
  probability?: {
    homeWinPercentage: number;
    awayWinPercentage: number;
  };
}

export interface Game {
  id: string;
  home_team_id: string;
  home_team_name: string;
  home_team_abbr: string;
  home_team_logo: string;
  home_team_score: number;
  home_team_record: string | null;
  home_team_color: string | null;
  away_team_id: string;
  away_team_name: string;
  away_team_abbr: string;
  away_team_logo: string;
  away_team_score: number;
  away_team_record: string | null;
  away_team_color: string | null;
  status_state: "pre" | "in" | "post";
  status_detail: string | null;
  status_clock: string | null;
  status_period: number;
  game_date: string;
  broadcast: string | null;
  venue_name: string | null;
  venue_city: string | null;
  leaders: GameLeaders | null;
  linescores: GameLinescores | null;
  situation: GameSituation | null;
  notes: string | null;
  updated_at: string;
}

export interface UserFavorite {
  id: string;
  user_id: string;
  team_id: string;
  created_at: string;
}

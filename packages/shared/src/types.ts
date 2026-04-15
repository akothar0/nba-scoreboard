export interface NBATeam {
  id: string;
  displayName: string;
  abbreviation: string;
  color: string;
  alternateColor: string;
  logo: string;
  conference: "East" | "West";
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
  updated_at: string;
}

export interface UserFavorite {
  id: string;
  user_id: string;
  team_id: string;
  created_at: string;
}

import type { NBATeam } from "./types";

export const NBA_TEAMS: NBATeam[] = [
  // Eastern Conference
  { id: "1", displayName: "Atlanta Hawks", abbreviation: "ATL", color: "c8102e", alternateColor: "fdb927", logo: "https://a.espncdn.com/i/teamlogos/nba/500/atl.png", conference: "East" },
  { id: "2", displayName: "Boston Celtics", abbreviation: "BOS", color: "008348", alternateColor: "ffffff", logo: "https://a.espncdn.com/i/teamlogos/nba/500/bos.png", conference: "East" },
  { id: "17", displayName: "Brooklyn Nets", abbreviation: "BKN", color: "000000", alternateColor: "ffffff", logo: "https://a.espncdn.com/i/teamlogos/nba/500/bkn.png", conference: "East" },
  { id: "30", displayName: "Charlotte Hornets", abbreviation: "CHA", color: "008ca8", alternateColor: "1d1060", logo: "https://a.espncdn.com/i/teamlogos/nba/500/cha.png", conference: "East" },
  { id: "4", displayName: "Chicago Bulls", abbreviation: "CHI", color: "ce1141", alternateColor: "000000", logo: "https://a.espncdn.com/i/teamlogos/nba/500/chi.png", conference: "East" },
  { id: "5", displayName: "Cleveland Cavaliers", abbreviation: "CLE", color: "860038", alternateColor: "bc945c", logo: "https://a.espncdn.com/i/teamlogos/nba/500/cle.png", conference: "East" },
  { id: "8", displayName: "Detroit Pistons", abbreviation: "DET", color: "1d428a", alternateColor: "c8102e", logo: "https://a.espncdn.com/i/teamlogos/nba/500/det.png", conference: "East" },
  { id: "11", displayName: "Indiana Pacers", abbreviation: "IND", color: "0c2340", alternateColor: "ffd520", logo: "https://a.espncdn.com/i/teamlogos/nba/500/ind.png", conference: "East" },
  { id: "14", displayName: "Miami Heat", abbreviation: "MIA", color: "98002e", alternateColor: "000000", logo: "https://a.espncdn.com/i/teamlogos/nba/500/mia.png", conference: "East" },
  { id: "15", displayName: "Milwaukee Bucks", abbreviation: "MIL", color: "00471b", alternateColor: "eee1c6", logo: "https://a.espncdn.com/i/teamlogos/nba/500/mil.png", conference: "East" },
  { id: "18", displayName: "New York Knicks", abbreviation: "NY", color: "1d428a", alternateColor: "f58426", logo: "https://a.espncdn.com/i/teamlogos/nba/500/ny.png", conference: "East" },
  { id: "19", displayName: "Orlando Magic", abbreviation: "ORL", color: "0150b5", alternateColor: "9ca0a3", logo: "https://a.espncdn.com/i/teamlogos/nba/500/orl.png", conference: "East" },
  { id: "20", displayName: "Philadelphia 76ers", abbreviation: "PHI", color: "1d428a", alternateColor: "e01234", logo: "https://a.espncdn.com/i/teamlogos/nba/500/phi.png", conference: "East" },
  { id: "28", displayName: "Toronto Raptors", abbreviation: "TOR", color: "ce1141", alternateColor: "000000", logo: "https://a.espncdn.com/i/teamlogos/nba/500/tor.png", conference: "East" },
  { id: "27", displayName: "Washington Wizards", abbreviation: "WAS", color: "002b5c", alternateColor: "e31837", logo: "https://a.espncdn.com/i/teamlogos/nba/500/wsh.png", conference: "East" },
  // Western Conference
  { id: "6", displayName: "Dallas Mavericks", abbreviation: "DAL", color: "0064b1", alternateColor: "bbc4ca", logo: "https://a.espncdn.com/i/teamlogos/nba/500/dal.png", conference: "West" },
  { id: "7", displayName: "Denver Nuggets", abbreviation: "DEN", color: "0e2240", alternateColor: "fec524", logo: "https://a.espncdn.com/i/teamlogos/nba/500/den.png", conference: "West" },
  { id: "9", displayName: "Golden State Warriors", abbreviation: "GS", color: "fdb927", alternateColor: "1d428a", logo: "https://a.espncdn.com/i/teamlogos/nba/500/gs.png", conference: "West" },
  { id: "10", displayName: "Houston Rockets", abbreviation: "HOU", color: "ce1141", alternateColor: "000000", logo: "https://a.espncdn.com/i/teamlogos/nba/500/hou.png", conference: "West" },
  { id: "12", displayName: "LA Clippers", abbreviation: "LAC", color: "12173f", alternateColor: "c8102e", logo: "https://a.espncdn.com/i/teamlogos/nba/500/lac.png", conference: "West" },
  { id: "13", displayName: "Los Angeles Lakers", abbreviation: "LAL", color: "552583", alternateColor: "fdb927", logo: "https://a.espncdn.com/i/teamlogos/nba/500/lal.png", conference: "West" },
  { id: "29", displayName: "Memphis Grizzlies", abbreviation: "MEM", color: "5d76a9", alternateColor: "12173f", logo: "https://a.espncdn.com/i/teamlogos/nba/500/mem.png", conference: "West" },
  { id: "16", displayName: "Minnesota Timberwolves", abbreviation: "MIN", color: "266092", alternateColor: "79bc43", logo: "https://a.espncdn.com/i/teamlogos/nba/500/min.png", conference: "West" },
  { id: "3", displayName: "New Orleans Pelicans", abbreviation: "NO", color: "0a2240", alternateColor: "b4975a", logo: "https://a.espncdn.com/i/teamlogos/nba/500/no.png", conference: "West" },
  { id: "25", displayName: "Oklahoma City Thunder", abbreviation: "OKC", color: "007ac1", alternateColor: "ef3b24", logo: "https://a.espncdn.com/i/teamlogos/nba/500/okc.png", conference: "West" },
  { id: "21", displayName: "Phoenix Suns", abbreviation: "PHX", color: "e56020", alternateColor: "1d1160", logo: "https://a.espncdn.com/i/teamlogos/nba/500/phx.png", conference: "West" },
  { id: "22", displayName: "Portland Trail Blazers", abbreviation: "POR", color: "e03a3e", alternateColor: "000000", logo: "https://a.espncdn.com/i/teamlogos/nba/500/por.png", conference: "West" },
  { id: "23", displayName: "Sacramento Kings", abbreviation: "SAC", color: "5a2d81", alternateColor: "63727a", logo: "https://a.espncdn.com/i/teamlogos/nba/500/sac.png", conference: "West" },
  { id: "24", displayName: "San Antonio Spurs", abbreviation: "SA", color: "c4ced4", alternateColor: "000000", logo: "https://a.espncdn.com/i/teamlogos/nba/500/sa.png", conference: "West" },
  { id: "26", displayName: "Utah Jazz", abbreviation: "UTAH", color: "002b5c", alternateColor: "f9a01b", logo: "https://a.espncdn.com/i/teamlogos/nba/500/utah.png", conference: "West" },
];

export function getTeamById(id: string): NBATeam | undefined {
  return NBA_TEAMS.find((t) => t.id === id);
}

export function getTeamsByConference(conference: "East" | "West"): NBATeam[] {
  return NBA_TEAMS.filter((t) => t.conference === conference);
}

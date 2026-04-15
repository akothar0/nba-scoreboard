"use client";

import { useState } from "react";
import Image from "next/image";
import type { Game, GameLeaderEntry } from "@nba-scoreboard/shared";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ChevronDown, Zap, Flame, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameCardProps {
  game: Game;
  isFavorite: boolean;
  onToggleFavorite?: (teamId: string) => void;
  isSignedIn: boolean;
}

// --- Context Badges ---

function ContextBadges({ game }: { game: Game }) {
  const badges: { label: string; color: string; icon?: React.ReactNode }[] = [];

  // Play-In / Playoff badge from notes
  if (game.notes) {
    const lower = game.notes.toLowerCase();
    if (lower.includes("play-in")) {
      badges.push({ label: "PLAY-IN", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" });
    } else if (lower.includes("playoff") || lower.includes("finals")) {
      badges.push({
        label: game.notes.includes("Finals") ? "FINALS" : "PLAYOFFS",
        color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
        icon: <Trophy className="h-3 w-3" />,
      });
    }
  }

  // Live game context
  if (game.status_state === "in") {
    const diff = Math.abs(game.home_team_score - game.away_team_score);
    const period = game.status_period;

    // Clutch time: Q4 or OT, within 5 points
    if (period >= 4 && diff <= 5) {
      badges.push({
        label: "CLUTCH",
        color: "bg-red-500/20 text-red-400 border-red-500/30",
        icon: <Flame className="h-3 w-3" />,
      });
    }
    // Close game
    else if (diff <= 5) {
      badges.push({
        label: "CLOSE",
        color: "bg-orange-500/20 text-orange-400 border-orange-500/30",
        icon: <Zap className="h-3 w-3" />,
      });
    }
    // Blowout: 20+ point lead
    else if (diff >= 20) {
      badges.push({ label: "BLOWOUT", color: "bg-muted text-muted-foreground border-border" });
    }
  }

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {badges.map((b) => (
        <span
          key={b.label}
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase",
            b.color
          )}
        >
          {b.icon}
          {b.label}
        </span>
      ))}
    </div>
  );
}

// --- Status Badge ---

function StatusBadge({ game }: { game: Game }) {
  if (game.status_state === "in") {
    return (
      <Badge
        variant="destructive"
        className="animate-pulse text-xs font-semibold"
      >
        {game.status_detail}
      </Badge>
    );
  }
  if (game.status_state === "post") {
    return (
      <Badge variant="secondary" className="text-xs">
        Final
      </Badge>
    );
  }
  return (
    <span className="text-xs text-muted-foreground">{game.status_detail}</span>
  );
}

// --- Team Row ---

function TeamRow({
  name,
  abbr,
  logo,
  score,
  record,
  isWinner,
  isLive,
  isFavorite,
  onToggleFavorite,
  teamId,
  isSignedIn,
}: {
  name: string;
  abbr: string;
  logo: string;
  score: number;
  record: string | null;
  isWinner: boolean;
  isLive: boolean;
  isFavorite: boolean;
  onToggleFavorite?: (teamId: string) => void;
  teamId: string;
  isSignedIn: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-shrink-0">
        <Image
          src={logo}
          alt={name}
          width={40}
          height={40}
          className="rounded-full"
          unoptimized
        />
        {isSignedIn && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(teamId);
            }}
            className={cn(
              "absolute -right-1 -top-1 h-4 w-4 transition-colors",
              isFavorite
                ? "text-yellow-400"
                : "text-muted-foreground/30 hover:text-yellow-400/60"
            )}
            aria-label={isFavorite ? `Unfollow ${name}` : `Follow ${name}`}
          >
            <Star className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
          </button>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "font-semibold text-sm truncate",
              isWinner && "text-foreground",
              !isWinner && !isLive && "text-muted-foreground"
            )}
          >
            {abbr}
          </span>
          {isFavorite && (
            <Star className="h-3 w-3 text-yellow-400 flex-shrink-0" fill="currentColor" />
          )}
        </div>
        {record && (
          <span className="text-xs text-muted-foreground">{record}</span>
        )}
      </div>

      <span
        className={cn(
          "text-2xl font-mono font-bold tabular-nums",
          isWinner && "text-foreground",
          !isWinner && !isLive && "text-muted-foreground"
        )}
      >
        {score}
      </span>
    </div>
  );
}

// --- Win Probability Bar ---

function WinProbabilityBar({
  homePercentage,
  awayPercentage,
  homeColor,
  awayColor,
  homeAbbr,
  awayAbbr,
}: {
  homePercentage: number;
  awayPercentage: number;
  homeColor: string;
  awayColor: string;
  homeAbbr: string;
  awayAbbr: string;
}) {
  const homePct = Math.round(homePercentage * 100);
  const awayPct = Math.round(awayPercentage * 100);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        <span>Win Probability</span>
      </div>
      <div className="relative h-6 w-full overflow-hidden rounded-full bg-muted/50">
        {/* Away team portion (left) */}
        <div
          className="absolute inset-y-0 left-0 flex items-center justify-start pl-2 transition-all duration-700 ease-out rounded-l-full"
          style={{
            width: `${awayPct}%`,
            backgroundColor: `#${awayColor}`,
            minWidth: awayPct > 0 ? "2.5rem" : "0",
          }}
        >
          <span className="text-[10px] font-bold text-white drop-shadow-sm">
            {awayAbbr} {awayPct}%
          </span>
        </div>
        {/* Home team portion (right) */}
        <div
          className="absolute inset-y-0 right-0 flex items-center justify-end pr-2 transition-all duration-700 ease-out rounded-r-full"
          style={{
            width: `${homePct}%`,
            backgroundColor: `#${homeColor}`,
            minWidth: homePct > 0 ? "2.5rem" : "0",
          }}
        >
          <span className="text-[10px] font-bold text-white drop-shadow-sm">
            {homePct}% {homeAbbr}
          </span>
        </div>
      </div>
    </div>
  );
}

// --- Quarter Scores Table ---

function LinescoreTable({ game }: { game: Game }) {
  if (!game.linescores) return null;

  const periods = game.linescores.home.length;
  const hasOT = periods > 4;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-muted-foreground border-b border-border/50">
            <th className="py-1.5 text-left font-medium w-16">Team</th>
            {Array.from({ length: Math.min(periods, 4) }).map((_, i) => (
              <th key={i} className="py-1.5 text-center font-medium w-10">
                Q{i + 1}
              </th>
            ))}
            {hasOT &&
              Array.from({ length: periods - 4 }).map((_, i) => (
                <th key={`ot-${i}`} className="py-1.5 text-center font-medium w-10">
                  OT{i + 1}
                </th>
              ))}
            <th className="py-1.5 text-center font-bold w-12">T</th>
          </tr>
        </thead>
        <tbody>
          {/* Away team row */}
          <tr className="border-b border-border/30">
            <td className="py-1.5 font-semibold">{game.away_team_abbr}</td>
            {game.linescores.away.map((ps, i) => (
              <td key={i} className="py-1.5 text-center font-mono tabular-nums">
                {ps.value}
              </td>
            ))}
            <td className="py-1.5 text-center font-mono font-bold tabular-nums">
              {game.away_team_score}
            </td>
          </tr>
          {/* Home team row */}
          <tr>
            <td className="py-1.5 font-semibold">{game.home_team_abbr}</td>
            {game.linescores.home.map((ps, i) => (
              <td key={i} className="py-1.5 text-center font-mono tabular-nums">
                {ps.value}
              </td>
            ))}
            <td className="py-1.5 text-center font-mono font-bold tabular-nums">
              {game.home_team_score}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// --- Leader Card ---

const STAT_LABELS: Record<string, string> = {
  points: "PTS",
  rebounds: "REB",
  assists: "AST",
};

function LeaderCard({ entry, teamColor }: { entry: GameLeaderEntry; teamColor: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg bg-muted/30 p-2">
      {entry.athlete.headshot ? (
        <div
          className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full"
          style={{ boxShadow: `0 0 0 2px #${teamColor}` }}
        >
          <Image
            src={entry.athlete.headshot}
            alt={entry.athlete.displayName}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      ) : (
        <div
          className="h-10 w-10 flex-shrink-0 rounded-full bg-muted flex items-center justify-center text-xs font-bold"
          style={{ boxShadow: `0 0 0 2px #${teamColor}` }}
        >
          {entry.athlete.displayName.split(" ").map((n) => n[0]).join("")}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold truncate">{entry.athlete.displayName}</div>
        <div className="text-[10px] text-muted-foreground">
          {entry.athlete.team.abbreviation} &middot; {entry.athlete.position}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-sm font-bold font-mono tabular-nums">{entry.displayValue}</div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
          {STAT_LABELS[entry.name] ?? entry.name}
        </div>
      </div>
    </div>
  );
}

function LeadersSection({ game }: { game: Game }) {
  if (!game.leaders) return null;

  const homeColor = game.home_team_color || "888";
  const awayColor = game.away_team_color || "888";

  // Interleave home and away leaders by stat category
  const allLeaders: { entry: GameLeaderEntry; color: string }[] = [];
  const maxLen = Math.max(game.leaders.away.length, game.leaders.home.length);
  for (let i = 0; i < maxLen; i++) {
    if (game.leaders.away[i]) allLeaders.push({ entry: game.leaders.away[i], color: awayColor });
    if (game.leaders.home[i]) allLeaders.push({ entry: game.leaders.home[i], color: homeColor });
  }

  if (allLeaders.length === 0) return null;

  return (
    <div className="space-y-1.5">
      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        Top Performers
      </div>
      <div className="grid gap-1.5 sm:grid-cols-2">
        {allLeaders.map((l, i) => (
          <LeaderCard key={i} entry={l.entry} teamColor={l.color} />
        ))}
      </div>
    </div>
  );
}

// --- Main Game Card ---

export function GameCard({
  game,
  isFavorite,
  onToggleFavorite,
  isSignedIn,
}: GameCardProps) {
  const [expanded, setExpanded] = useState(false);

  const isLive = game.status_state === "in";
  const isFinal = game.status_state === "post";
  const homeWins = isFinal && game.home_team_score > game.away_team_score;
  const awayWins = isFinal && game.away_team_score > game.home_team_score;

  const homeColor = game.home_team_color || "888";
  const awayColor = game.away_team_color || "888";

  const hasDetails = game.linescores || game.leaders || game.situation?.probability;
  const isPre = game.status_state === "pre";

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300 cursor-pointer group/gamecard",
        isLive && "ring-1 ring-red-500/30",
        isFavorite && "ring-1 ring-yellow-400/40 bg-yellow-400/5",
        expanded && "ring-1 ring-foreground/20"
      )}
      onClick={() => hasDetails && !isPre && setExpanded((e) => !e)}
    >
      {/* Team color accent bar */}
      <div className="absolute inset-y-0 left-0 w-1 flex flex-col">
        <div className="flex-1" style={{ backgroundColor: `#${awayColor}` }} />
        <div className="flex-1" style={{ backgroundColor: `#${homeColor}` }} />
      </div>

      {/* Live game shimmer effect */}
      {isLive && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -inset-x-full top-0 h-px animate-[shimmer_3s_ease-in-out_infinite]"
            style={{
              background: `linear-gradient(90deg, transparent, #${homeColor}40, transparent)`,
            }}
          />
        </div>
      )}

      <div className="ml-2 p-4 space-y-3">
        {/* Context badges */}
        <ContextBadges game={game} />

        {/* Status row */}
        <div className="flex items-center justify-between">
          <StatusBadge game={game} />
          <div className="flex items-center gap-2">
            {game.broadcast && (
              <span className="text-xs text-muted-foreground font-mono">
                {game.broadcast}
              </span>
            )}
            {hasDetails && !isPre && (
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform duration-300",
                  expanded && "rotate-180"
                )}
              />
            )}
          </div>
        </div>

        {/* Away team */}
        <TeamRow
          name={game.away_team_name}
          abbr={game.away_team_abbr}
          logo={game.away_team_logo}
          score={game.away_team_score}
          record={game.away_team_record}
          isWinner={awayWins}
          isLive={isLive}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
          teamId={game.away_team_id}
          isSignedIn={isSignedIn}
        />

        {/* Divider */}
        <div className="border-t border-border/50" />

        {/* Home team */}
        <TeamRow
          name={game.home_team_name}
          abbr={game.home_team_abbr}
          logo={game.home_team_logo}
          score={game.home_team_score}
          record={game.home_team_record}
          isWinner={homeWins}
          isLive={isLive}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
          teamId={game.home_team_id}
          isSignedIn={isSignedIn}
        />

        {/* Venue for upcoming games */}
        {isPre && game.venue_name && (
          <span className="text-xs text-muted-foreground block">
            {game.venue_name}{game.venue_city ? `, ${game.venue_city}` : ""}
          </span>
        )}

        {/* Last play ticker for live games */}
        {isLive && game.situation?.lastPlay && (
          <div className="text-xs text-muted-foreground italic border-t border-border/30 pt-2">
            {game.situation.lastPlay.text}
          </div>
        )}
      </div>

      {/* Expandable details panel */}
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-in-out",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border/50 ml-3 mr-0 px-4 py-4 space-y-4">
            {/* Quarter scores */}
            <LinescoreTable game={game} />

            {/* Win probability bar */}
            {game.situation?.probability && (
              <WinProbabilityBar
                homePercentage={game.situation.probability.homeWinPercentage}
                awayPercentage={game.situation.probability.awayWinPercentage}
                homeColor={homeColor}
                awayColor={awayColor}
                homeAbbr={game.home_team_abbr}
                awayAbbr={game.away_team_abbr}
              />
            )}

            {/* Top performers */}
            <LeadersSection game={game} />
          </div>
        </div>
      </div>
    </Card>
  );
}

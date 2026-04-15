"use client";

import Image from "next/image";
import type { Game } from "@nba-scoreboard/shared";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameCardProps {
  game: Game;
  isFavorite: boolean;
  onToggleFavorite?: (teamId: string) => void;
  isSignedIn: boolean;
}

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

function TeamRow({
  name,
  abbr,
  logo,
  score,
  record,
  color,
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
  color: string | null;
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

export function GameCard({
  game,
  isFavorite,
  onToggleFavorite,
  isSignedIn,
}: GameCardProps) {
  const isLive = game.status_state === "in";
  const isFinal = game.status_state === "post";
  const homeWins =
    isFinal && game.home_team_score > game.away_team_score;
  const awayWins =
    isFinal && game.away_team_score > game.home_team_score;

  const homeColor = game.home_team_color || "888";
  const awayColor = game.away_team_color || "888";

  return (
    <Card
      className={cn(
        "relative overflow-hidden p-4 transition-all duration-200",
        isLive && "ring-1 ring-red-500/30",
        isFavorite && "ring-1 ring-yellow-400/40 bg-yellow-400/5"
      )}
    >
      {/* Team color accent */}
      <div className="absolute inset-y-0 left-0 w-1 flex flex-col">
        <div
          className="flex-1"
          style={{ backgroundColor: `#${awayColor}` }}
        />
        <div
          className="flex-1"
          style={{ backgroundColor: `#${homeColor}` }}
        />
      </div>

      <div className="ml-2 space-y-3">
        {/* Status */}
        <div className="flex items-center justify-between">
          <StatusBadge game={game} />
          {game.broadcast && (
            <span className="text-xs text-muted-foreground font-mono">
              {game.broadcast}
            </span>
          )}
        </div>

        {/* Away team */}
        <TeamRow
          name={game.away_team_name}
          abbr={game.away_team_abbr}
          logo={game.away_team_logo}
          score={game.away_team_score}
          record={game.away_team_record}
          color={game.away_team_color}
          isWinner={awayWins}
          isLive={isLive}
          isFavorite={isFavorite && true}
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
          color={game.home_team_color}
          isWinner={homeWins}
          isLive={isLive}
          isFavorite={isFavorite && true}
          onToggleFavorite={onToggleFavorite}
          teamId={game.home_team_id}
          isSignedIn={isSignedIn}
        />

        {/* Venue for upcoming games */}
        {game.status_state === "pre" && game.venue_name && (
          <span className="text-xs text-muted-foreground block">
            {game.venue_name}{game.venue_city ? `, ${game.venue_city}` : ""}
          </span>
        )}
      </div>
    </Card>
  );
}

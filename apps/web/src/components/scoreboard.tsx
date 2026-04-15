"use client";

import { useLiveScores } from "@/hooks/use-live-scores";
import { useFavorites } from "@/hooks/use-favorites";
import { GameCard } from "@/components/game-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Game } from "@nba-scoreboard/shared";

function sortGames(games: Game[]): Game[] {
  const order: Record<string, number> = { in: 0, pre: 1, post: 2 };
  return [...games].sort(
    (a, b) => (order[a.status_state] ?? 1) - (order[b.status_state] ?? 1)
  );
}

function GameSkeleton() {
  return (
    <div className="rounded-xl border border-border p-4 space-y-3">
      <Skeleton className="h-4 w-24" />
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="ml-auto h-8 w-12" />
      </div>
      <div className="border-t border-border/50" />
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="ml-auto h-8 w-12" />
      </div>
    </div>
  );
}

interface ScoreboardProps {
  date?: string;
}

export function Scoreboard({ date }: ScoreboardProps) {
  const { games, loading: gamesLoading } = useLiveScores(date);
  const { favoriteTeamIds, toggleFavorite, isSignedIn, loading: favsLoading } =
    useFavorites();

  const loading = gamesLoading || favsLoading;

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <GameSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-5xl mb-4">🏀</span>
        <h2 className="text-xl font-semibold mb-2">No games scheduled</h2>
        <p className="text-muted-foreground text-sm">
          Try a different date — use the arrows to navigate.
        </p>
      </div>
    );
  }

  // Split into favorites and rest
  const favoriteGames = sortGames(
    games.filter(
      (g) =>
        favoriteTeamIds.includes(g.home_team_id) ||
        favoriteTeamIds.includes(g.away_team_id)
    )
  );
  const otherGames = sortGames(
    games.filter(
      (g) =>
        !favoriteTeamIds.includes(g.home_team_id) &&
        !favoriteTeamIds.includes(g.away_team_id)
    )
  );

  const isFavoriteGame = (game: Game) =>
    favoriteTeamIds.includes(game.home_team_id) ||
    favoriteTeamIds.includes(game.away_team_id);

  return (
    <div className="space-y-8">
      {/* Favorite teams section */}
      {favoriteGames.length > 0 && (
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-medium text-yellow-400">
            <span>★</span> My Teams
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                isFavorite={true}
                onToggleFavorite={toggleFavorite}
                isSignedIn={isSignedIn}
              />
            ))}
          </div>
        </section>
      )}

      {/* All other games */}
      <section>
        {favoriteGames.length > 0 && (
          <h2 className="mb-4 text-sm font-medium text-muted-foreground">
            All Games
          </h2>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(favoriteGames.length > 0 ? otherGames : sortGames(games)).map(
            (game) => (
              <GameCard
                key={game.id}
                game={game}
                isFavorite={isFavoriteGame(game)}
                onToggleFavorite={toggleFavorite}
                isSignedIn={isSignedIn}
              />
            )
          )}
        </div>
      </section>
    </div>
  );
}

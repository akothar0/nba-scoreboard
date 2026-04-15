"use client";

import { Scoreboard } from "@/components/scoreboard";
import { TeamPicker } from "@/components/team-picker";
import { useFavorites } from "@/hooks/use-favorites";
import { Show } from "@clerk/nextjs";

export function ScoreboardPage() {
  const { favoriteTeamIds, toggleFavorite } = useFavorites();

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Today&apos;s Games</h1>
          <p className="text-sm text-muted-foreground">
            Scores update live — no refresh needed
          </p>
        </div>
        <Show when="signed-in">
          <TeamPicker
            favoriteTeamIds={favoriteTeamIds}
            onToggleFavorite={toggleFavorite}
          />
        </Show>
      </div>

      <Scoreboard />
    </div>
  );
}

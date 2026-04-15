"use client";

import { useState } from "react";
import { Scoreboard } from "@/components/scoreboard";
import { DateNav } from "@/components/date-nav";
import { TeamPicker } from "@/components/team-picker";
import { useFavorites } from "@/hooks/use-favorites";
import { Show } from "@clerk/nextjs";

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

export function ScoreboardPage() {
  const { favoriteTeamIds, toggleFavorite } = useFavorites();
  const [selectedDate, setSelectedDate] = useState(getToday);

  const isToday = selectedDate === getToday();

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isToday ? "Today\u2019s Games" : "Games"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isToday
              ? "Scores update live \u2014 no refresh needed"
              : new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
          </p>
        </div>
        <Show when="signed-in">
          <TeamPicker
            favoriteTeamIds={favoriteTeamIds}
            onToggleFavorite={toggleFavorite}
          />
        </Show>
      </div>

      {/* Date navigation */}
      <DateNav selectedDate={selectedDate} onDateChange={setSelectedDate} />

      {/* Scoreboard */}
      <Scoreboard date={selectedDate} />
    </div>
  );
}

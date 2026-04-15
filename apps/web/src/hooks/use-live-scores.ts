"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import type { Game } from "@nba-scoreboard/shared";

export function useLiveScores(date?: string) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  const targetDate = date || new Date().toISOString().split("T")[0];

  useEffect(() => {
    const supabase = createBrowserClient();
    setLoading(true);

    async function fetchGames() {
      const { data, error } = await supabase
        .from("games")
        .select("*")
        .eq("game_date", targetDate)
        .order("status_state", { ascending: true });

      if (!error && data) {
        setGames(data as Game[]);
      }
      setLoading(false);
    }

    fetchGames();

    // Subscribe to Realtime changes — filter to current date
    const channel = supabase
      .channel(`games-realtime-${targetDate}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "games" },
        (payload) => {
          const updated = payload.new as Game;
          // Only process updates for the current date
          if (updated.game_date !== targetDate) return;

          setGames((prev) => {
            const idx = prev.findIndex((g) => g.id === updated.id);
            if (idx >= 0) {
              const next = [...prev];
              next[idx] = updated;
              return next;
            }
            return [...prev, updated];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [targetDate]);

  return { games, loading };
}

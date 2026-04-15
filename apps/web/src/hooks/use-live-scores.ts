"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import type { Game } from "@nba-scoreboard/shared";

export function useLiveScores() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createBrowserClient();

    // Initial fetch
    async function fetchGames() {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("games")
        .select("*")
        .eq("game_date", today)
        .order("status_state", { ascending: true });

      if (!error && data) {
        setGames(data as Game[]);
      }
      setLoading(false);
    }

    fetchGames();

    // Subscribe to Realtime changes
    const channel = supabase
      .channel("games-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "games" },
        (payload) => {
          const updated = payload.new as Game;
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
  }, []);

  return { games, loading };
}

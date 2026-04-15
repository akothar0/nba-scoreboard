"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import type { UserFavorite } from "@nba-scoreboard/shared";

export function useFavorites() {
  const { user, isLoaded } = useUser();
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [loading, setLoading] = useState(true);

  const favoriteTeamIds = favorites.map((f) => f.team_id);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/favorites");
      if (res.ok) {
        const data = await res.json();
        setFavorites(data);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isLoaded) fetchFavorites();
  }, [isLoaded, fetchFavorites]);

  const toggleFavorite = useCallback(
    async (teamId: string) => {
      if (!user) return;

      const isFav = favoriteTeamIds.includes(teamId);

      if (isFav) {
        setFavorites((prev) => prev.filter((f) => f.team_id !== teamId));
        await fetch("/api/favorites", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ teamId }),
        });
      } else {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ teamId }),
        });
        if (res.ok) {
          const newFav = await res.json();
          setFavorites((prev) => [...prev, newFav]);
        }
      }
    },
    [user, favoriteTeamIds]
  );

  return { favorites, favoriteTeamIds, loading, toggleFavorite, isSignedIn: !!user };
}

"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, Settings2 } from "lucide-react";
import {
  NBA_TEAMS,
  getTeamsByConference,
} from "@nba-scoreboard/shared";
import { cn } from "@/lib/utils";

interface TeamPickerProps {
  favoriteTeamIds: string[];
  onToggleFavorite: (teamId: string) => void;
}

export function TeamPicker({
  favoriteTeamIds,
  onToggleFavorite,
}: TeamPickerProps) {
  const [open, setOpen] = useState(false);
  const eastTeams = getTeamsByConference("East");
  const westTeams = getTeamsByConference("West");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="gap-2" />
        }
      >
        <Settings2 className="h-4 w-4" />
        My Teams
        {favoriteTeamIds.length > 0 && (
          <span className="rounded-full bg-yellow-400/20 px-1.5 text-xs text-yellow-400">
            {favoriteTeamIds.length}
          </span>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Follow Your Teams</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Select teams to pin their games to the top of your scoreboard.
          </p>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Eastern Conference */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Eastern Conference
            </h3>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {eastTeams.map((team) => {
                const isFav = favoriteTeamIds.includes(team.id);
                return (
                  <button
                    key={team.id}
                    onClick={() => onToggleFavorite(team.id)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-lg border p-3 transition-all hover:bg-accent",
                      isFav
                        ? "border-yellow-400/50 bg-yellow-400/10"
                        : "border-border"
                    )}
                  >
                    <div className="relative">
                      <Image
                        src={team.logo}
                        alt={team.displayName}
                        width={40}
                        height={40}
                        className="rounded-full"
                        unoptimized
                      />
                      {isFav && (
                        <Star
                          className="absolute -right-1 -top-1 h-3.5 w-3.5 text-yellow-400"
                          fill="currentColor"
                        />
                      )}
                    </div>
                    <span className="text-xs font-medium text-center leading-tight">
                      {team.abbreviation}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Western Conference */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Western Conference
            </h3>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {westTeams.map((team) => {
                const isFav = favoriteTeamIds.includes(team.id);
                return (
                  <button
                    key={team.id}
                    onClick={() => onToggleFavorite(team.id)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-lg border p-3 transition-all hover:bg-accent",
                      isFav
                        ? "border-yellow-400/50 bg-yellow-400/10"
                        : "border-border"
                    )}
                  >
                    <div className="relative">
                      <Image
                        src={team.logo}
                        alt={team.displayName}
                        width={40}
                        height={40}
                        className="rounded-full"
                        unoptimized
                      />
                      {isFav && (
                        <Star
                          className="absolute -right-1 -top-1 h-3.5 w-3.5 text-yellow-400"
                          fill="currentColor"
                        />
                      )}
                    </div>
                    <span className="text-xs font-medium text-center leading-tight">
                      {team.abbreviation}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

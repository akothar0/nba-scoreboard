import { createClient } from "@supabase/supabase-js";
import type { Game } from "@nba-scoreboard/shared";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function upsertGames(games: Game[]): Promise<void> {
  if (games.length === 0) return;

  const { error } = await supabase.from("games").upsert(games, {
    onConflict: "id",
  });

  if (error) {
    throw new Error(`Supabase upsert error: ${error.message}`);
  }
}

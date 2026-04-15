import { fetchScoreboard } from "./espn";
import { upsertGames } from "./db";

const POLL_INTERVAL_LIVE = 30_000; // 30s when games are live
const POLL_INTERVAL_IDLE = 300_000; // 5min when no live games

async function poll() {
  try {
    const games = await fetchScoreboard();
    await upsertGames(games);

    const liveCount = games.filter((g) => g.status_state === "in").length;
    const totalCount = games.length;

    console.log(
      `[${new Date().toISOString()}] Updated ${totalCount} games (${liveCount} live)`
    );

    return liveCount > 0;
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Poll error:`, err);
    return false;
  }
}

async function main() {
  console.log("NBA Scoreboard Worker started");

  let hasLiveGames = await poll();

  const loop = () => {
    const interval = hasLiveGames ? POLL_INTERVAL_LIVE : POLL_INTERVAL_IDLE;
    const label = hasLiveGames ? "30s (live games)" : "5min (idle)";
    console.log(`Next poll in ${label}`);

    setTimeout(async () => {
      hasLiveGames = await poll();
      loop();
    }, interval);
  };

  loop();
}

main();

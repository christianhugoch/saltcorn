import { BackgroundFetch } from "@transistorsoft/capacitor-background-fetch";
import { sync } from "./offline_mode.js";

/**
 * Init the periodic background sync with a min omin interval.
 * This runs the sync even if the app is in background or was swipe closed.
 * If no internet connection is avalialbe it fails silently.
 * @param {number} interval min time interval in minutes. The system decides when to actually do it
 */
export async function startPeriodicBackgroundSync(interval = 15) {
  console.log("Configuring background sync with interval (minutes):", interval);
  const status = await BackgroundFetch.configure(
    {
      minimumFetchInterval: interval,
    },
    async (taskId) => {
      console.log("Starting background sync:", taskId, new Date().toISOString());
      await sync(true);
      console.log("Background sync finished:", taskId, new Date().toISOString());
      BackgroundFetch.finish(taskId);
    },
    async (taskId) => {
      console.log("[BackgroundFetch] TIMEOUT:", taskId);
      BackgroundFetch.finish(taskId);
    }
  );

  if (status !== BackgroundFetch.STATUS_AVAILABLE) {
    if (status === BackgroundFetch.STATUS_DENIED) {
      console.log(
        "The user explicitly disabled background behavior for this app or for the whole system."
      );
    } else if (status === BackgroundFetch.STATUS_RESTRICTED) {
      console.log(
        "Background updates are unavailable and the user cannot enable them again."
      );
    }
  }
}

import { BackgroundFetch } from "@transistorsoft/capacitor-background-fetch";
import { sync } from "./offline_mode.js";

export async function startPeriodicBackgroundSync(interval = 15) {
  const status = await BackgroundFetch.configure(
    {
      minimumFetchInterval: interval,
    },
    async (taskId) => {
      console.log("Starting background sync:", taskId);
      await sync(true);
      console.log("Background sync finished:", taskId);

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

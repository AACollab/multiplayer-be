import { CronJob } from "cron";
import { gamesDB } from "../db";

class SchedulerService {
  constructor() {}

  start() {
    const cleanOTPJob = new CronJob("0 * * * * *", this.cleanOTPs, null, true);

    const cleanGamesJob = new CronJob(
      "0 * * * * *",
      this.cleanGames,
      null,
      true,
    );
  }

  cleanOTPs() {
    console.log("Cleaning OTPs");
  }

  cleanGames() {
    gamesDB.cleanExpiredGames();
  }
}

export const scheduler = new SchedulerService();

import { CronJob } from "cron";
import { gamesDB, otpDB } from "../db";

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
    otpDB.cleanExpiredOTPs();
  }

  cleanGames() {
    console.log("Cleaning Games");
    gamesDB.cleanExpiredGames();
  }
}

export const scheduler = new SchedulerService();

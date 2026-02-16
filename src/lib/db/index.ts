import { DateTime } from "luxon";
import { Game, OTP } from "../types";
import { getOTP, getUniqueId, getUniqueName } from "../utils/utils";

class GamesDB {
  private db: Game[] = [];

  constructor() {}

  get allGames() {
    return this.db.slice();
  }
  get allActiveGames() {
    return this.db.filter((item) => item.status === "active").slice();
  }

  get allStartedGames() {
    return this.db.filter((item) => item.status === "started").slice();
  }

  new() {
    return {
      id: getUniqueId(),
      name: getUniqueName(),
      status: "created",
      result: "none",
    } as Game;
  }

  add(game: Game) {
    this.db.push(game);

    // Return copy
    return game;
  }

  update(game: Game) {
    const foundGameIndex = this.db.findIndex((item) => item.id === game.id);

    if (foundGameIndex > -1) {
      this.db.splice(foundGameIndex, 1, game);
    }

    // Return copy
    return this.db.slice();
  }

  delete(gameId: string) {
    const foundGameIndex = this.db.findIndex((item) => item.id === gameId);

    if (foundGameIndex > -1) {
      this.db.splice(foundGameIndex, 1);
    }

    // Return copy
    return this.db.slice();
  }

  read(gameId: string) {
    const foundGame = this.db.find((item) => item.id === gameId);

    // Return copy
    return foundGame;
  }
}

class OTPDB {
  otps: OTP[] = [];

  constructor() {}

  new(gameId: string) {
    return {
      id: gameId,
      otp: getOTP(),
      expires: DateTime.now().plus({ minutes: 30 }),
    } as OTP;
  }

  add(otp: OTP) {
    this.otps.push(otp);

    // Return copy
    return otp;
  }

  update(otp: OTP) {
    const foundOTPIndex = this.otps.findIndex((item) => item.id === otp.id);

    if (foundOTPIndex > -1) {
      this.otps.splice(foundOTPIndex, 1, otp);
    }

    // Return copy
    return this.otps.slice();
  }

  delete(gameId: string) {
    // remove all OTPs for the respective game id
    this.otps = this.otps.filter((item) => item.id !== gameId);

    // Return copy
    return this.otps.slice();
  }

  read(gameId: string) {
    return this.otps.find((item) => item.id === gameId);
  }
}

export const gamesDB = new GamesDB();
export const otpDB = new OTPDB();

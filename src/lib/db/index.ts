import { DateTime } from "luxon";
import {
  getOTP,
  getUniqueId,
  getUniqueName,
  isExpired,
  setExpiry,
} from "../utils/utils";
import { DEFAULT_EXPIRY } from "../constants";

class GamesDB {
  private games: Game[] = [];

  constructor() {}

  get allGames() {
    return this.games.slice();
  }
  get allActiveGames() {
    return this.games.filter((item) => item.status === "active").slice();
  }

  get allStartedGames() {
    return this.games.filter((item) => item.status === "started").slice();
  }

  new(size: number) {
    return {
      id: getUniqueId(),
      name: getUniqueName(),
      status: "created",
      result: "none",
      size,
      expires: setExpiry(),
    } as Game;
  }

  add(game: Game) {
    this.games.push(game);

    // Return copy
    return game;
  }

  update(game: Game) {
    const foundGameIndex = this.games.findIndex((item) => item.id === game.id);

    if (foundGameIndex > -1) {
      this.games.splice(foundGameIndex, 1, game);
    }

    // Return copy
    return this.games.slice();
  }

  delete(gameId: string) {
    const foundGameIndex = this.games.findIndex((item) => item.id === gameId);

    if (foundGameIndex > -1) {
      this.games.splice(foundGameIndex, 1);
    }

    // Return copy
    return this.games.slice();
  }

  read(gameId: string) {
    const foundGame = this.games.find((item) => item.id === gameId);

    // Return copy
    return foundGame;
  }

  playerExists(gameId: string, playerId: string) {
    const foundGame = this.games.find(
      (game) =>
        game.id === gameId &&
        (game.player1.id === playerId || game.player2.id === playerId),
    );

    return !!foundGame;
  }

  cleanExpiredGames() {
    this.games = this.games.filter(
      (item) => !isExpired(DateTime.fromJSDate(item.expires)),
    );
  }
}

class OTPDB {
  private otps: OTP[] = [];

  constructor() {}

  new(gameId: string) {
    return {
      id: gameId,
      otp: getOTP(),
      expires: setExpiry(),
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

  cleanExpiredOTPs() {
    this.otps = this.otps.filter(
      (item) => !isExpired(DateTime.fromJSDate(item.expires)),
    );
  }

  validate(id: string, otp: string) {
    const foundRecord = this.read(id);

    if (foundRecord) {
      return foundRecord.otp === otp;
    }

    return false;
  }
}

export const gamesDB = new GamesDB();
export const otpDB = new OTPDB();

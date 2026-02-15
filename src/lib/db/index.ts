import { Game, OTP } from "../types";

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

  add(game: Game) {
    this.db.push(game);

    // Return copy
    return this.db.slice();
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

  add(otp: OTP) {
    this.otps.push(otp);

    // Return copy
    return this.otps.slice();
  }

  update(otp: OTP) {
    const foundOTPIndex = this.otps.findIndex((item) => item.id === otp.id);

    if (foundOTPIndex > -1) {
      this.otps.splice(foundOTPIndex, 1, otp);
    }

    // Return copy
    return this.otps.slice();
  }
}

export const gamesDB = new GamesDB();

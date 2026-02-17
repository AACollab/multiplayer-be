import { DateTime } from "luxon";

export interface Player {
  id: string;
  name: string;
}

export interface Game {
  id: string;
  name: string;
  status: "created" | "active" | "started";
  result: "none" | "draw" | "won";
  size: number;
  player1?: Player;
  player2?: Player;
}

export interface OTP {
  id: string;
  otp: string;
  expires: DateTime;
}

export interface CreateGameResponse {
  gameId: string;
  otp: string;
}

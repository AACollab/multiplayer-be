import { Duration } from "luxon";

export const MAX_GAMES = 10;

export const MIN_GAME_SIZE = 3;
export const MAX_GAME_SIZE = 4;

export const DEFAULT_EXPIRY = { minutes: 30 } as Duration;

export enum MessageTypes {
  CREATE = "create",
  OTP = "otp",
  MOVE = "move",
  DISCONNECT = "disconnect",
  CONNECT = "connect",
  OTP_ACKNOWLEDGMENT = "otp_acknowledgement",
  JOIN_ACKNOWLEDGMENT = "join_acknowledgement",
  CREATE_GAME_ACKNOWLEDGMENT = "create_game_acknowledgement",
}

export enum GameStatus {
  CREATED = "created",
  ACTIVE = "active",
  IN_PROGRESS = "in-progress",
  COMPLETED = "completed",
}

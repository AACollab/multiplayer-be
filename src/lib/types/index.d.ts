type Player = {
  id: string;
  name: string;
};

type Game = {
  id: string;
  name: string;
  status: "created" | "active" | "started";
  result: "none" | "draw" | "won";
  size: number;
  player1?: Player;
  player2?: Player;
  expires: Date;
};

type OTP = {
  id: string;
  otp: string;
  expires?: Date;
};

type CreateGameResponse = {
  gameId: string;
  otp: string;
};

type ClientConnection = {
  id: string;
  gameId: string;
  status: "unknown" | "active" | "inactive";
  lastSentMessage?: unknown;
  lastRecievedMessage?: unknown;
  expires: Date;
  ws: unknown;
};

type SocketMessage = {
  type: "otp" | "move" | "disconnect" | "connect";
  data: unknown;
};

type GameMoveData = {
  gameId: string;
  playerId: string;
  move: unknown;
};

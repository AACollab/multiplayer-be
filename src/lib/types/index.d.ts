export interface Player {
  id: string;
  name: string;
}

export interface Game {
  id: string;
  name: string;
  status: "active" | "started";
  result: "draw" | "won";
  player1?: Player;
  player2?: Player;
}

export interface OTP {
  id: string;
  otp: string;
}

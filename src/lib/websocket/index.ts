import { Server } from "http";
import WebSocket from "ws";
import { getUniqueId, getUniqueName } from "../utils/utils";

export class GamesWSServer {
  private server: WebSocket.Server = null;

  constructor(server: Server) {
    this.server = new WebSocket.Server({ server, path: "/ws" });

    this.start();
  }

  start() {
    this.server?.on("connection", (ws: WebSocket) => {
      console.log("WebSocket client connected. ");

      ws.on("message", (message: WebSocket.Data) => {
        console.log("Received:", message.toString());
        ws.send("Welcome. Your id is " + getUniqueId());
      });
    });
  }

  sendMessage(message: string, playerId: string) {}
}

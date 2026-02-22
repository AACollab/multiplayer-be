import { Server } from "http";
import WebSocket from "ws";
import {
  errorSocketResponse,
  getUniqueId,
  getUniqueName,
  setExpiry,
  successSocketResponse,
} from "../utils/utils";
import { gamesDB, otpDB } from "../db";
import { MessageTypes } from "../constants";

export class GamesWSServer {
  private server: WebSocket.Server = null;
  private players: ClientConnection[] = [];

  constructor(server: Server) {
    this.server = new WebSocket.Server({ server, path: "/ws" });

    this.start();
  }

  start() {
    this.server?.on("connection", (ws: WebSocket) => {
      console.log("WebSocket client connected. ");

      ws.on("message", (message: WebSocket.Data) => {
        try {
          const request = JSON.parse(message.toString());
          this.processMessage(ws, request);
        } catch (error) {
          ws.close();
        }
      });
    });
  }

  processMessage(ws: WebSocket, message: SocketMessage) {
    var response = null;
    switch (message.type || "") {
      case MessageTypes.OTP:
        const otpDetails = message.data as OTP;
        response = this.handleNewConnection(ws, otpDetails.id, otpDetails.otp);

        if (!response.success) {
          ws.close();
          return;
        }
        break;

      case MessageTypes.CONNECT:
        break;

      case MessageTypes.DISCONNECT:
        break;

      case MessageTypes.MOVE:
        const gameData = message.data as GameMoveData;

        response = this.handleNewMove(
          gameData.gameId,
          gameData.playerId,
          gameData.move,
        );
        break;

      default:
        // ignore and disconnect
        break;
    }

    this.sendRawMessage(ws, JSON.stringify(response));
  }

  handleNewConnection(ws: WebSocket, gameId: string, otp: string) {
    const isValidOTP = otpDB.validate(gameId, otp);

    if (!isValidOTP)
      return errorSocketResponse("Invalid details. Connection refused");

    otpDB.delete(gameId);

    const newConnection: ClientConnection = {
      id: getUniqueId(),
      gameId: gameId,
      status: "active",
      lastSentMessage: null,
      lastRecievedMessage: null,
      expires: setExpiry(1),
      ws: ws,
    };

    this.players.push(newConnection);

    return successSocketResponse({
      playerId: newConnection.id,
      gameId: newConnection.gameId,
    });
  }

  handleNewMove(gameId: string, playerId: string, move: unknown) {
    const allPayers = this.getAllPlayersExcept(gameId, playerId);

    if (allPayers.length > 0) {
      allPayers.forEach((connection) =>
        this.sendRawMessage(connection.ws as WebSocket, JSON.stringify(move)),
      );
    } else {
      return errorSocketResponse("No players available to play");
    }

    return successSocketResponse(move);
  }

  getPlayer(gameId: string, playerId: string) {
    return this.players.find(
      (connection) =>
        connection.id === playerId && connection.gameId === gameId,
    );
  }

  getAllPlayersExcept(gameId: string, playerId: string) {
    return this.players.filter(
      (connection) =>
        connection.id !== playerId && connection.gameId === gameId,
    );
  }

  sendMessage(message: string, gameId: string, playerId: string) {
    const foundConnection = this.getPlayer(gameId, playerId);

    if (foundConnection) {
      this.sendRawMessage(foundConnection.ws as WebSocket, message);
    }
  }

  sendRawMessage(ws: WebSocket, message: string) {
    ws.send(message);
  }
}

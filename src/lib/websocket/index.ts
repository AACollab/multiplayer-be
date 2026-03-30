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
import { GameStatus, MessageTypes } from "../constants";

export class GamesWSServer {
  private server: WebSocket.Server = null;
  private players: ClientConnection[] = [];

  constructor(server: Server) {
    this.server = new WebSocket.Server({ server, path: "/ws" });

    this.start();
  }

  createPlayer(ws: WebSocket, gameId: string) {
    const newConnection: ClientConnection = {
      id: getUniqueId(),
      gameId: gameId,
      status: "active",
      lastSentMessage: null,
      lastRecievedMessage: null,
      expires: setExpiry(1),
      isPlayer: false,
      isCreator: false,
      ws: ws,
    };

    return newConnection;
  }

  start() {
    this.server?.on("connection", (ws: WebSocket) => {
      console.log("WebSocket client connected. ");

      ws.on("message", (message: WebSocket.Data) => {
        try {
          const messageString = message.toString();
          const request = JSON.parse(messageString);
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
        response = this.handleOTP(ws, otpDetails.id, otpDetails.otp);

        if (!response.success) {
          ws.close();
          return;
        }
        break;

      case MessageTypes.CONNECT:
        const connectionDetails = message.data as ConnectionRequest;
        response = this.handleConnect(ws, connectionDetails.gameId);
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

  handleOTP(ws: WebSocket, gameId: string, otp: string) {
    const foundGame = gamesDB.read(gameId);

    if (!foundGame) {
      return errorSocketResponse("Game not found");
    }

    const isValidOTP = otpDB.validate(gameId, otp);

    if (!isValidOTP)
      return errorSocketResponse("Invalid details. Connection refused");

    const newConnection = this.createPlayer(ws, gameId);

    newConnection.isPlayer = true;
    newConnection.isCreator = true;

    this.players.push(newConnection);

    otpDB.delete(gameId);
    gamesDB.update({ ...foundGame, status: GameStatus.ACTIVE });

    return successSocketResponse(MessageTypes.OTP_ACKNOWLEDGMENT, {
      playerId: newConnection.id,
      gameId: newConnection.gameId,
    });
  }

  handleConnect(ws: WebSocket, gameId: string) {
    const foundGame = gamesDB.read(gameId);

    var isValidGame = false;
    const newConnection = this.createPlayer(ws, gameId);
    if (foundGame?.status === GameStatus.ACTIVE) {
      newConnection.isPlayer = true;
      isValidGame = true;
    } else if (foundGame?.status === GameStatus.IN_PROGRESS) {
      newConnection.isPlayer = false;
      isValidGame = true;
    }

    if (isValidGame) {
      this.players.push(newConnection);

      const allPayers = this.getAllPlayersExcept(gameId, newConnection.id);

      if (allPayers.length > 0) {
        allPayers.forEach((connection) => {
          const messageToSend = successSocketResponse(MessageTypes.CONNECT, {
            playerId: newConnection.id,
            gameId: newConnection.gameId,
          });

          this.sendRawMessage(
            connection.ws as WebSocket,
            JSON.stringify(messageToSend),
          );
        });
      } else {
        return errorSocketResponse("No players available to play");
      }

      return successSocketResponse(MessageTypes.JOIN_ACKNOWLEDGMENT, {
        playerId: newConnection.id,
        gameId: newConnection.gameId,
      });
    }

    return errorSocketResponse("Invalid game");
  }

  handleNewMove(gameId: string, playerId: string, move: unknown) {
    const allPayers = this.getAllPlayersExcept(gameId, playerId);

    console.log(`Sending moves to ${allPayers.length}`);

    if (allPayers.length > 0) {
      allPayers.forEach((connection) => {
        const messageToSend = successSocketResponse(MessageTypes.MOVE, move);

        console.log("-----------------");
        console.log("Sending move to:");
        console.log(connection.id, connection.gameId);
        console.log("Move details: ");
        console.log(messageToSend);
        console.log("-----------------");
        console.log("\\n");

        this.sendRawMessage(
          connection.ws as WebSocket,
          JSON.stringify(messageToSend),
        );
      });
    } else {
      return errorSocketResponse("No players available to play");
    }

    return successSocketResponse(MessageTypes.MOVE, move);
  }

  getCreator(gameId: string) {
    return this.players.filter(
      (connection) =>
        connection.gameId === gameId && connection.isCreator === true,
    );
  }

  getPlayer(gameId: string, playerId: string) {
    return this.players.find(
      (connection) =>
        connection.id === playerId && connection.gameId === gameId,
    );
  }

  getAllPlayers(gameId: string) {
    return this.players.filter((connection) => connection.gameId === gameId);
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

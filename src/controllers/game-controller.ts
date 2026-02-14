import { Request, Response } from "express";
import { errorResponse, successResponse } from "../lib/utils/utils";
import gameService from "../lib/services/game-service";
import { Player } from "../lib/types";

export const getAllGames = async (req: Request, res: Response) => {
  try {
    return successResponse(
      res,
      gameService.allGames,
      "All games retrieved successfully",
    );
  } catch (error) {
    console.error("Error fetching games:", error);
    return errorResponse(res, error.message as string);
  }
};

export const createGame = async (req: Request, res: Response) => {
  try {
    return successResponse(
      res,
      gameService.createGame(req.body as Player),
      "Game created successfully",
    );
  } catch (error) {
    console.error("Error creating game:", error);
    return errorResponse(res, error.message as string);
  }
};

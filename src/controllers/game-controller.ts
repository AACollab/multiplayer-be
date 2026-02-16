import { Request, Response } from "express";
import {
  errorResponse,
  getUniqueId,
  getUniqueName,
  successResponse,
} from "../lib/utils/utils";
import { gamesDB, otpDB } from "../lib/db";
import { Game } from "../lib/types";

export const getAllGames = async (req: Request, res: Response) => {
  try {
    return successResponse(
      res,
      gamesDB.allGames,
      "All games retrieved successfully",
    );
  } catch (error) {
    console.error("Error fetching games:", error);
    return errorResponse(res, error.message as string);
  }
};

export const createGame = async (req: Request, res: Response) => {
  try {
    const newGame: Game = gamesDB.new();

    const game = gamesDB.add(newGame);

    if (game === newGame) {
      const newOTP = otpDB.new(game.id);

      const otp = otpDB.add(newOTP);

      if (otp === newOTP) {
        return successResponse(res, otp, "Game created successfully");
      }
    }

    return errorResponse(res, "Failed to create a new game. Please try again");
  } catch (error) {
    console.error("Error creating game:", error);
    return errorResponse(res, error.message as string);
  }
};

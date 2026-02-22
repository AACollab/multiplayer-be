import { Request, Response } from "express";
import {
  errorResponse,
  getUniqueId,
  getUniqueName,
  successResponse,
} from "../lib/utils/utils";
import { gamesDB, otpDB } from "../lib/db";
import { number } from "yup";
import { MAX_GAME_SIZE, MIN_GAME_SIZE } from "../lib/constants";

export const getAllGames = async (req: Request, res: Response) => {
  try {
    return successResponse(
      res,
      gamesDB.allActiveGames,
      "All games retrieved successfully",
    );
  } catch (error) {
    console.error("Error fetching games:", error);
    return errorResponse(res, error.message as string);
  }
};

export const createGame = async (req: Request, res: Response) => {
  try {
    const { size } = req.body;

    if (!size)
      return errorResponse(
        res,
        "Game size not provided. Please provide correct size to create the game.",
      );

    const providedSize = parseInt(size) || MIN_GAME_SIZE;

    if (providedSize < MIN_GAME_SIZE)
      return errorResponse(
        res,
        "Game size is too small. Please provide correct size to create the game.",
      );

    if (providedSize > MAX_GAME_SIZE)
      return errorResponse(
        res,
        "Game size is too large. Please provide correct size to create the game.",
      );

    const newGame: Game = gamesDB.new(parseInt(size) || MIN_GAME_SIZE);

    const game = gamesDB.add(newGame);

    if (game === newGame) {
      const newOTP = otpDB.new(game.id);

      const otp = otpDB.add(newOTP);

      if (otp === newOTP) {
        return successResponse(
          res,
          { ...game, otp: otp.otp },
          "Game created successfully",
        );
      }
    }

    return errorResponse(res, "Failed to create a new game. Please try again");
  } catch (error) {
    console.error("Error creating game:", error);
    return errorResponse(res, error.message as string);
  }
};

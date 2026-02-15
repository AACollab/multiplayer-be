import { Request, Response } from "express";
import { errorResponse, successResponse } from "../lib/utils/utils";
import { gamesDB } from "../lib/db";

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
    return successResponse(res, [], "Game created successfully");
  } catch (error) {
    console.error("Error creating game:", error);
    return errorResponse(res, error.message as string);
  }
};

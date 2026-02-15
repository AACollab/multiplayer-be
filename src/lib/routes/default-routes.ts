import { Router, Request, Response } from "express";
import { successResponse } from "../utils/utils";

const defaultRoutes = Router();

defaultRoutes.get("/", (req: Request, res: Response) => {
  return successResponse(
    res,
    { message: "Welcome to WISH Multiplayer" },
    "GET Successfully Executed",
  );
});

defaultRoutes.post("/", (req: Request, res: Response) => {
  return successResponse(res, req.body, "POST Successfully Executed");
});

export default defaultRoutes;

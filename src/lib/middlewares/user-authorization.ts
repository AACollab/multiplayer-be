import { RequestHandler, Request, Response } from "express";
import { errorResponse, hasToken, isValidHeader } from "../utils/utils";

export const userAuthorization: RequestHandler = (
  req: Request,
  res: Response,
  next,
) => {
  // if (!isValidHeader(req) || !hasToken(req))
  //   return errorResponse(res, "Access restricted");

  next();
};

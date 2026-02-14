import { v4 as uuidv4 } from "uuid";
import { nanoid } from "nanoid";
import { Request, Response } from "express";

export const errorResponse = (
  res: Response,
  message?: string,
  status_code?: number,
) => {
  return res.status(status_code || 400).json({
    success: false,
    message: message || "An error occurred",
  });
};

export const successResponse = <T>(
  res: Response,
  data?: T,
  message?: string,
  status_code?: number,
) => {
  return res
    .status(status_code || 200)
    .json({ success: true, message, data: data ?? {} });
};

export const getUniqueId = (): string => uuidv4();

export const getUniqueName = (): string => nanoid(5);

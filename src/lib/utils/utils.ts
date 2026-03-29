import { nanoid } from "nanoid";
import { Request, Response } from "express";
import { DateTime } from "luxon";
import { DEFAULT_EXPIRY, MessageTypes } from "../constants";
import { WebSocket } from "ws";

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

export const errorSocketResponse = (message?: string) => {
  return {
    success: false,
    message: message || "An error occurred",
  };
};

export const successSocketResponse = <T>(
  messageType: MessageTypes,
  data?: T,
  message?: string,
) => {
  return {
    success: true,
    type: messageType,
    data: data || "{}",
    message: message || "",
  };
};

export const getUniqueId = (): string => {
  // Generate a 16-character nanoid (default is 21, so we specify 16)
  const id = nanoid(16);

  // Add hyphen after every 4 characters
  return id.replace(/(.{4})(?!$)/g, "$1-");
};

export const getUniqueName = (): string => {
  // Generate a 16-character nanoid (default is 21, so we specify 16)
  const id = nanoid(6);

  // Add hyphen after every 4 characters
  return id.replace(/(.{4})(?!$)/g, "$1-");
};

export const getOTP = (length: number = 4): string => {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10); // 0-9
  }
  return otp;
};

export const isExpired = (expiry: DateTime) =>
  expiry.diffNow("minutes")?.minutes < 0;

export const setExpiry = (expiresInMinutes?: number) =>
  DateTime.now()
    .plus(!!expiresInMinutes ? { minutes: expiresInMinutes } : DEFAULT_EXPIRY)
    .toJSDate();

export const getToken = (req: Request): string => {
  const segments = (req.headers.authorization ?? "").split(" ");
  if (segments.length === 1) return segments[0];
  return segments[1];
};

export const hasToken = (req: Request): boolean => !!getToken(req);

export const isValidHeader = (req: Request): boolean =>
  (req.headers.authorization ?? "").startsWith("Bearer");

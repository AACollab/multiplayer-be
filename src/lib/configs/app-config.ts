import express, { Request, Response, NextFunction, Express } from "express";

export const prepareToRun = (app: Express) => {
  app.use(express.json({ limit: "10mb" }));
  app.use((req: Request, res: Response, next: NextFunction) => {
    // const allowedOrigins = ["http://localhost:3000"];

    // const origin = req.headers.origin ?? "";

    // if (allowedOrigins.includes(origin) || origin.includes("postman")) {
    //   res.setHeader("Access-Control-Allow-Origin", origin);
    // }

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, OPTIONS, DELETE",
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Authorization, Content-Type, X-Requested-With, Access-Control-Allow-Origin, Access-Control-Allow-Headers",
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });
};

import { Router } from "express";

const defaultRoutes = Router();

defaultRoutes.get("/", (req, res) => {
  return res.redirect("https://ww-hub.com");
});

export default defaultRoutes;

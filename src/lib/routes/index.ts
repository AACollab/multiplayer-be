import { Router } from "express";
import defaultRoutes from "./default-routes";
import { createGame, getAllGames } from "../../controllers/game-controller";

export const router = Router();

router.post("/", defaultRoutes);
router.get("/", defaultRoutes);

router.get("/games", getAllGames);
router.post("/games/create", createGame);

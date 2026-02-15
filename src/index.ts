import express from "express";
import { createServer } from "http";
import { router } from "./lib/routes";
import { GamesWSServer } from "./lib/websocket";

const app = express();
const server = createServer(app);
const port = process.env.PORT || 10000;

app.use(express.json()); // Parses JSON bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies
app.use("/", router);

new GamesWSServer(server);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

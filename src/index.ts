/// Load all environment variables
require("dotenv").config();

import express from "express";
import { prepareToRun } from "./lib/configs/app-config";
import { router } from "./lib/routes";
import WebSocket from "ws";

const WebSocketServer = new WebSocket.Server({ port: 10000 });
const app = express();

/// All the initialization code is wrapped in here
prepareToRun(app);

const PORT = process.env.PORT;

WebSocketServer.on("connection", (clientSocket) => {
  console.log("A client connected: ", clientSocket); // Log when a client connects

  // Event handler for when the server receives a message from a client
  clientSocket.on("message", (message) => {
    console.log(`Received: ${message}`); // Log the received message
    clientSocket.send(`Welcome: ${message}`); // Send a response to the client
  });

  // Event handler for when a client disconnects`
  clientSocket.on("close", () => {
    console.log("Client disconnected"); // Log when a client disconnects
  });
});

app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import { prisma } from "../lib/prisma";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("Socket server running");
});

io.on("connection", (socket) => {
  socket.on("joinRoom", async (data) => {
    const roomID = data.roomID[0];
    console.log(roomID);

    if (!roomID || typeof roomID !== "string") {
      socket.emit("error", "Room ID invalid or missing");
      return;
    }

    try {
      const roomData = await prisma.game.findUnique({
        where: { roomID },
        include: {
          players: true,
        },
      });

      if (!roomData) {
        socket.emit("error", "Room not found");
        return;
      }
      socket.join(roomID);
      io.to(roomID).emit("gameData", roomData);
    } catch (error) {
      console.error(error);
      socket.emit("error", "Internal server error");
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ connection out", socket.id);
  });
});

server.listen(3001, () => {
  console.log("🚀 http://localhost:3001");
});

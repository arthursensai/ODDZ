import { prisma } from "../lib/prisma";
import express from "express";
import http from "http";
import { Server } from "socket.io";

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
  console.log(`🟢 New client connected: ${socket.id}`);

  let currentRoomID: string | null = null;
  let currentEmail: string | null = null;

  socket.on("joinRoom", async (data) => {
    const roomID = data.roomID?.[0];
    const playerEmail = data.playerEmail;

    if (!roomID || typeof roomID !== "string" || !playerEmail) {
      socket.emit("error", "Room ID or player email invalid or missing");
      return;
    }

    try {
      const roomData = await prisma.game.findUnique({
        where: { roomID },
        include: { players: true },
      });

      if (!roomData) {
        socket.emit("error", "Room not found");
        return;
      }

      socket.join(roomID);
      currentRoomID = roomID;
      currentEmail = playerEmail;

      io.to(roomID).emit("gameData", roomData);
    } catch (error) {
      console.error("❌ joinRoom error:", error);
      socket.emit("error", "Internal server error");
    }
  });

  socket.on("disconnect", async () => {
    console.log(`🔴 Disconnected: ${socket.id}`);

    if (!currentRoomID || !currentEmail) return;

    try {
      await prisma.player.update({
        where: { email: currentEmail },
        data: { inGame: false },
      });

      await prisma.game.update({
        where: { roomID: currentRoomID },
        data: {
          players: {
            disconnect: { email: currentEmail },
          },
        },
      });

      const updatedRoom = await prisma.game.findUnique({
        where: { roomID: currentRoomID },
        include: { players: true },
      });

      if (!updatedRoom) return;

      if (updatedRoom.players.length === 0) {
        await prisma.game.delete({
          where: { roomID: currentRoomID },
        });
        console.log(`🗑️ Room ${currentRoomID} deleted (no players left)`);
      } else {
        io.to(currentRoomID).emit("gameData", updatedRoom);
      }
    } catch (err) {
      console.error("❌ Error during disconnect cleanup:", err);
    }
  });
});

server.listen(3001, () => {
  console.log("🚀 Socket server running at http://localhost:3001");
});

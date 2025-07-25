import { prisma } from "../lib/prisma";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import getQuestions from "./getQuestions";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const emailToSocketID = new Map<string, string>();

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
      socket.emit("joinRoomError", {
        message: "Room ID or player email invalid or missing",
      });
      return;
    }

    emailToSocketID.set(playerEmail, socket.id);
    currentRoomID = roomID;
    currentEmail = playerEmail;

    try {
      const roomData = await prisma.game.findUnique({
        where: { roomID },
        include: { players: true },
      });

      if (!roomData) {
        socket.emit("joinRoomError", { message: "Room not found" });
        return;
      }

      socket.join(roomID);
      io.to(roomID).emit("gameData", roomData);
    } catch (error) {
      console.error("❌ joinRoom error:", error);
      socket.emit("joinRoomError", { message: "Internal server error" });
    }
  });

  socket.on("startGame", async () => {
    if (!currentRoomID || !currentEmail) {
      socket.emit("startGameError", { message: "Invalid game context" });
      return;
    }

    try {
      const roomData = await prisma.game.findUnique({
        where: { roomID: currentRoomID },
        include: { players: true },
      });

      const player = await prisma.player.findUnique({
        where: { email: currentEmail },
        include: {
          adminOf: {
            where: { roomID: currentRoomID },
          },
        },
      });

      if (!roomData || !player || player.adminOf.length === 0) {
        socket.emit("startGameError", {
          message: "You are not the admin of this room.",
        });
        return;
      }

      const questions = await getQuestions();

      const players = roomData.players;
      const randomPlayer = players[Math.floor(Math.random() * players.length)];
      const imposterSocketID = emailToSocketID.get(randomPlayer.email);

      if (!imposterSocketID) {
        socket.emit("startGameError", {
          message: "Imposter player not connected",
        });
        return;
      }

      // Send imposter question to the chosen player
      io.to(imposterSocketID).emit("question", questions.imposterQuestion);

      // Send normal question to everyone else in the room (excluding imposter)
      for (const p of players) {
        const sID = emailToSocketID.get(p.email);
        if (sID && sID !== imposterSocketID) {
          io.to(sID).emit("question", questions.normalQuestion);
        }
      }

      io.to(currentRoomID).emit("gameStarted"); // Trigger UI/game state updates
    } catch (err) {
      console.error("❌ startGame error:", err);
      socket.emit("startGameError", { message: "Internal server error" });
    }
  });

  socket.on("disconnect", async () => {
    console.log(`🔴 Disconnected: ${socket.id}`);

    if (!currentRoomID || !currentEmail) return;

    emailToSocketID.delete(currentEmail);

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

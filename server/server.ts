import { prisma } from "../lib/prisma";
import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import getQuestions from "./getQuestions";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production" ? process.env.CLIENT_URL : "*",
    methods: ["GET", "POST"],
  },
});

// Types for better type safety
interface JoinRoomData {
  roomID: string | string[];
  playerEmail: string;
}

interface SocketContext {
  roomID: string | null;
  email: string | null;
}

// Enhanced connection tracking with room-based organization
class ConnectionManager {
  private emailToSocketID = new Map<string, string>();
  private socketToContext = new Map<string, SocketContext>();

  setConnection(email: string, socketId: string, roomID: string) {
    this.emailToSocketID.set(email, socketId);
    this.socketToContext.set(socketId, { roomID, email });
  }

  removeConnection(socketId: string) {
    const context = this.socketToContext.get(socketId);
    if (context?.email) {
      this.emailToSocketID.delete(context.email);
    }
    this.socketToContext.delete(socketId);
    return context;
  }

  getSocketId(email: string): string | undefined {
    return this.emailToSocketID.get(email);
  }

  getContext(socketId: string): SocketContext | undefined {
    return this.socketToContext.get(socketId);
  }

  getRoomPlayers(roomID: string): string[] {
    const players: string[] = [];
    for (const [email, socketId] of this.emailToSocketID.entries()) {
      const context = this.socketToContext.get(socketId);
      if (context?.roomID === roomID) {
        players.push(email);
      }
    }
    return players;
  }
}

const connectionManager = new ConnectionManager();

// Utility functions
const validateJoinRoomData = (data: unknown): data is JoinRoomData => {
  return (
    typeof data === "object" &&
    data !== null &&
    "roomID" in data &&
    "playerEmail" in data &&
    (typeof (data as JoinRoomData).roomID === "string" ||
      Array.isArray((data as JoinRoomData).roomID)) &&
    typeof (data as JoinRoomData).playerEmail === "string"
  );
};

const extractRoomID = (roomID: string | string[]): string | null => {
  if (typeof roomID === "string") return roomID;
  if (Array.isArray(roomID) && roomID.length > 0) return roomID[0];
  return null;
};

const emitToRoom = (roomID: string, event: string, data?: unknown) => {
  io.to(roomID).emit(event, data);
};

const emitError = (socket: Socket, event: string, message: string) => {
  socket.emit(event, { message });
};

// Database operations
class GameService {
  static async findRoomWithPlayers(roomID: string) {
    return prisma.game.findUnique({
      where: { roomID },
      include: { players: true },
    });
  }

  static async findPlayerWithAdminRights(email: string, roomID: string) {
    return prisma.player.findUnique({
      where: { email },
      include: {
        adminOf: {
          where: { roomID },
        },
      },
    });
  }

  static async updatePlayerStatus(email: string, inGame: boolean) {
    return prisma.player.update({
      where: { email },
      data: { inGame },
    });
  }

  static async disconnectPlayerFromRoom(email: string, roomID: string) {
    return prisma.game.update({
      where: { roomID },
      data: {
        players: {
          disconnect: { email },
        },
      },
    });
  }

  static async deleteEmptyRoom(roomID: string) {
    return prisma.game.delete({
      where: { roomID },
    });
  }
}

// Socket event handlers
class SocketHandlers {
  static async handleJoinRoom(socket: any, data: any) {
    if (!validateJoinRoomData(data)) {
      emitError(socket, "joinRoomError", "Invalid room data or player email");
      return;
    }

    const roomID = extractRoomID(data.roomID);
    const { playerEmail } = data;

    if (!roomID) {
      emitError(socket, "joinRoomError", "Invalid room ID format");
      return;
    }

    try {
      const roomData = await GameService.findRoomWithPlayers(roomID);

      if (!roomData) {
        emitError(socket, "joinRoomError", "Room not found");
        return;
      }

      // Check if player is already in the room
      const isPlayerInRoom = roomData.players.some(
        (p) => p.email === playerEmail
      );
      if (!isPlayerInRoom) {
        emitError(
          socket,
          "joinRoomError",
          "Player not authorized for this room"
        );
        return;
      }

      connectionManager.setConnection(playerEmail, socket.id, roomID);
      socket.join(roomID);

      console.log(`✅ Player ${playerEmail} joined room ${roomID}`);
      emitToRoom(roomID, "gameData", roomData);
    } catch (error) {
      console.error("❌ joinRoom error:", error);
      emitError(socket, "joinRoomError", "Internal server error");
    }
  }

  static async handleStartGame(socket: Socket) {
    const context = connectionManager.getContext(socket.id);

    if (!context?.roomID || !context?.email) {
      emitError(socket, "startGameError", "Invalid game context");
      return;
    }

    const { roomID, email } = context;

    try {
      const [roomData, player] = await Promise.all([
        GameService.findRoomWithPlayers(roomID),
        GameService.findPlayerWithAdminRights(email, roomID),
      ]);

      if (!roomData) {
        emitError(socket, "startGameError", "Room not found");
        return;
      }

      if (!player || player.adminOf.length === 0) {
        emitError(
          socket,
          "startGameError",
          "You are not the admin of this room"
        );
        return;
      }

      if (roomData.players.length < 2) {
        emitError(socket, "startGameError", "Need at least 2 players to start");
        return;
      }

      const questions = await getQuestions();
      const connectedPlayers = roomData.players.filter((p) =>
        connectionManager.getSocketId(p.email)
      );

      if (connectedPlayers.length !== roomData.players.length) {
        emitError(socket, "startGameError", "Not all players are connected");
        return;
      }

      // Select random imposter
      const randomPlayer =
        connectedPlayers[Math.floor(Math.random() * connectedPlayers.length)];
      const imposterSocketID = connectionManager.getSocketId(
        randomPlayer.email
      );

      if (!imposterSocketID) {
        emitError(socket, "startGameError", "Imposter player not connected");
        return;
      }

      // Send questions
      io.to(imposterSocketID).emit("question", {
        type: "imposter",
        question: questions.imposterQuestion,
      });

      for (const player of connectedPlayers) {
        const socketId = connectionManager.getSocketId(player.email);
        if (socketId && socketId !== imposterSocketID) {
          io.to(socketId).emit("question", {
            type: "normal",
            question: questions.normalQuestion,
          });
        }
      }

      emitToRoom(roomID, "gameStarted", {
        playerCount: connectedPlayers.length,
        startTime: new Date().toISOString(),
      });

      console.log(
        `🎮 Game started in room ${roomID} with ${connectedPlayers.length} players`
      );
    } catch (error) {
      console.error("❌ startGame error:", error);
      emitError(socket, "startGameError", "Internal server error");
    }
  }

  static async handleDisconnect(socket: Socket) {
    console.log(`🔴 Disconnected: ${socket.id}`);

    const context = connectionManager.removeConnection(socket.id);

    if (!context?.roomID || !context?.email) {
      return;
    }

    const { roomID, email } = context;

    try {
      await Promise.all([
        GameService.updatePlayerStatus(email, false),
        GameService.disconnectPlayerFromRoom(email, roomID),
      ]);

      const updatedRoom = await GameService.findRoomWithPlayers(roomID);

      if (!updatedRoom || updatedRoom.players.length === 0) {
        await GameService.deleteEmptyRoom(roomID);
        console.log(`🗑️ Room ${roomID} deleted (no players left)`);
      } else {
        emitToRoom(roomID, "gameData", updatedRoom);
        emitToRoom(roomID, "playerDisconnected", {
          email,
          remainingPlayers: updatedRoom.players.length,
        });
      }

      console.log(`👋 Player ${email} left room ${roomID}`);
    } catch (error) {
      console.error("❌ Error during disconnect cleanup:", error);
    }
  }
}

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "running",
    timestamp: new Date().toISOString(),
    connections: io.engine.clientsCount,
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    connections: io.engine.clientsCount,
  });
});

// Socket connection handling
io.on("connection", (socket) => {
  console.log(`🟢 New client connected: ${socket.id}`);

  socket.on("joinRoom", (data) => SocketHandlers.handleJoinRoom(socket, data));
  socket.on("startGame", () => SocketHandlers.handleStartGame(socket));
  socket.on("disconnect", () => SocketHandlers.handleDisconnect(socket));

  // Heartbeat to detect dead connections
  socket.on("ping", () => {
    socket.emit("pong");
  });
});

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log("🛑 Shutting down gracefully...");

  io.emit("serverShutdown", { message: "Server is restarting" });

  setTimeout(() => {
    server.close(() => {
      console.log("✅ Server closed");
      process.exit(0);
    });
  }, 1000);
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

// Error handling
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  gracefulShutdown();
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Socket server running at http://localhost:${PORT}`);
});

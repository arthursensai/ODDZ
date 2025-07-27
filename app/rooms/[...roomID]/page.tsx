"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/useRoomStore";
import { CircleUserRound } from "lucide-react";
import { getSocket } from "@/lib/socket";
import { useParams } from "next/navigation";
import SmileyLoader from "@/components/SmileyLoader";
import { usePlayerStore } from "@/store/usePlayerStore";
import colorMap from "@/types/color";
import GameDialog from "@/components/GameDialog";
import CopyButton from "@/components/CopyBtn";
import NotFound from "@/app/not-found";
import LeaveButton from "@/components/LeaveBtn";
import StartGame from "@/components/StartGame";

type Status = "loading" | "notfound" | "found";
type GameStatus = "gameOFF" | "gameON";

const Page = () => {
  const [status, setStatus] = useState<Status>("loading");
  const [gameStatus, setGameStatus] = useState<GameStatus>("gameOFF");

  const params = useParams();
  const roomID = params?.roomID as string;
  const roomName = useGameStore((state) => state.name);
  const playerEmail = usePlayerStore((state) => state.email);
  const router = useRouter();
  const setGame = useGameStore((state) => state.setGame);
  const setQuestion = useGameStore((state) => state.setQuestion);
  const gamePlayers = useGameStore((state) => state.players);
  const isAdmin = usePlayerStore((state) => state.isAdmin);

  useEffect(() => {
    if (!roomID) {
      router.replace("/");
    }
  }, [roomID, router]);

  const handleGameData = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data: any) => {
      setStatus("found");
      setGame(data.roomID, data.name, data.players, data.status);
    },
    [setGame]
  );

  const handleQuestion = useCallback(
    (question: any) => {
      setQuestion(question.question);
    },
    [setQuestion]
  );

  const handleJoinRoomError = useCallback(() => {
    setStatus("notfound");
  }, []);

  const handleGameStarted = useCallback(() => {
    setGameStatus("gameON");
  }, []);

  useEffect(() => {
    if (!roomID || !playerEmail) return;

    const socket = getSocket();

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("gameData", handleGameData);
    socket.on("question", handleQuestion);
    socket.on("joinRoomError", handleJoinRoomError);
    socket.on("gameStarted", handleGameStarted);

    socket.emit("joinRoom", { roomID, playerEmail });

    return () => {
      socket.off("connect");
      socket.off("gameData", handleGameData);
      socket.off("question", handleQuestion);
      socket.off("joinRoomError", handleJoinRoomError);
      socket.off("gameStarted", handleGameStarted);
    };
  }, [
    roomID,
    playerEmail,
    handleGameData,
    handleQuestion,
    handleJoinRoomError,
    handleGameStarted,
  ]);

  if (status === "loading") {
    return <SmileyLoader text="Finding Your Room..." />;
  }

  if (status === "notfound") {
    return <NotFound />;
  }

  return (
    <section className="flex items-center justify-center w-full h-screen">
      <div className="flex flex-col h-screen w-full">
        <div className="flex flex-col w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <h2 className="text-3xl font-bold">Players</h2>
            {isAdmin && <StartGame />}
          </div>

          {/* Players Grid */}
          <div className="grid grid-cols-2 grid-rows-2 gap-12 p-12">
            {/* Render existing players */}
            {gamePlayers.map((playerData, i) => (
              <div
                className="bg-green-50 flex items-center p-4 rounded-2xl text-white gap-4 border-4 border-black shadow-lg hover:shadow-xl transition-shadow duration-200"
                key={playerData.email || i}
                style={{ backgroundColor: colorMap[playerData.color] }}
              >
                <CircleUserRound className="w-14 h-14 rounded-3xl transition-transform duration-400 hover:scale-110" />
                <h1 className="text-2xl font-semibold">
                  {playerData.username}
                </h1>
              </div>
            ))}

            {/* Render empty slots */}
            {Array.from({ length: 4 - gamePlayers.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="bg-gray-200 flex items-center justify-center p-4 rounded-2xl border-4 border-dashed border-gray-400 text-gray-500"
              >
                <div className="text-center">
                  <CircleUserRound className="w-14 h-14 mx-auto mb-2 animate-pulse" />
                  <p className="text-lg">
                    Waiting for player
                    <span className="inline-flex ml-1">
                      <span className="animate-pulse animation-delay-0">.</span>
                      <span className="animate-pulse animation-delay-200">
                        .
                      </span>
                      <span className="animate-pulse animation-delay-400">
                        .
                      </span>
                    </span>
                  </p>

                  <style jsx>{`
                    .animation-delay-0 {
                      animation-delay: 0ms;
                    }
                    .animation-delay-200 {
                      animation-delay: 200ms;
                    }
                    .animation-delay-400 {
                      animation-delay: 400ms;
                    }
                  `}</style>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="flex flex-col p-4 border-l-2 border-black bg-white text-black h-screen w-3/12">
        <div className="mb-6">
          <h1 className="font-bold text-3xl text-center mb-4">{roomName}</h1>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl">Room ID: {roomID}</h2>
            <CopyButton text={roomID} />
          </div>
        </div>

        <div className="mb-4">
          <p className="text-lg">
            Players: <span className="font-semibold">{gamePlayers.length}</span>
            /<span className="font-semibold">4</span>
          </p>
        </div>

        <div className="mb-4">
          <p className="text-lg">
            Status:{" "}
            <span
              className={`font-semibold ${
                gameStatus === "gameOFF" ? "text-yellow-600" : "text-green-600"
              }`}
            >
              {gameStatus === "gameOFF"
                ? `Waiting for ${4 - gamePlayers.length} more player${
                    4 - gamePlayers.length !== 1 ? "s" : ""
                  }...`
                : "Game Starting!"}
            </span>
          </p>
        </div>

        {/* Leave Button */}
        <div className="mt-auto w-full flex">
          <LeaveButton />
        </div>

        {/* Game rules or instructions could go here */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Game Info</h3>
          <p className="text-sm text-gray-600">
            Waiting for all players to join. The game will start when 4 players
            are present.
          </p>
        </div>
      </div>
      <GameDialog gameStatus={gameStatus} />
    </section>
  );
};

export default Page;

"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/useRoomStore";
import { CircleUserRound, Users, Crown, Clock, Menu, X } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { usePathname, useSearchParams } from "next/navigation";

type Status = "loading" | "notfound" | "found";
type GameStatus = "gameOFF" | "gameON";

interface PlayerResponse {
  playerEmail: string;
  playerName: string;
  answer: string;
  timestamp: string;
}

interface QuestionData {
  message: string;
  question: string;
  totalAnswers: number;
  playersCount: number;
}

const Page = () => {
  const [status, setStatus] = useState<Status>("loading");
  const [gameStatus, setGameStatus] = useState<GameStatus>("gameOFF");
  const [showQuestion, setShowQuestion] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [playerResponses, setPlayerResponses] = useState<Map<string, string>>(
    new Map()
  );

  const params = useParams();
  const roomID = params?.roomID as string;
  const roomName = useGameStore((state) => state.name);
  const playerEmail = usePlayerStore((state) => state.email);
  const router = useRouter();
  const setGame = useGameStore((state) => state.setGame);
  const setQuestion = useGameStore((state) => state.setQuestion);
  const question = useGameStore((state) => state.question);
  const gamePlayers = useGameStore((state) => state.players);
  const isAdmin = usePlayerStore((state) => state.isAdmin);
  const setAdmin = usePlayerStore((state) => state.setAdmin);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fullURL =
    pathname + (searchParams?.toString() ? `?${searchParams?.toString()}` : "");

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
      setAdmin(data.isAdmin);
    },
    [setGame, setAdmin]
  );

  const handleQuestion = useCallback(
    (question: string) => {
      setQuestion(question);
    },
    [setQuestion]
  );

  const handleJoinRoomError = useCallback(() => {
    setStatus("notfound");
  }, []);

  const hanldeStartGameError = useCallback((error: string) => {
    console.log(error);
  }, []);

  const handleGameStarted = useCallback(() => {
    setGameStatus("gameON");
  }, []);

  const handlePlayerResponse = useCallback((data: PlayerResponse) => {
    setPlayerResponses((prev) => {
      const newMap = new Map(prev);
      newMap.set(data.playerEmail, data.answer);
      return newMap;
    });
  }, []);

  const handleAllPlayersRespond = useCallback(
    (data: QuestionData) => {
      setQuestion(data.question);
      setShowQuestion(true);
    },
    [setQuestion]
  );

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
    socket.on("startGameError", hanldeStartGameError);
    socket.on("playerResponse", handlePlayerResponse);
    socket.on("allPlayersAnswered", handleAllPlayersRespond);

    socket.emit("joinRoom", { roomID, playerEmail });

    return () => {
      socket.off("connect");
      socket.off("gameData", handleGameData);
      socket.off("question", handleQuestion);
      socket.off("joinRoomError", handleJoinRoomError);
      socket.off("gameStarted", handleGameStarted);
      socket.off("playerResponse", handlePlayerResponse);
    };
  }, [
    roomID,
    playerEmail,
    handleGameData,
    handleQuestion,
    handleJoinRoomError,
    handleGameStarted,
    hanldeStartGameError,
    handlePlayerResponse,
    handleAllPlayersRespond,
  ]);

  if (status === "loading") {
    return <SmileyLoader text="Finding Your Room..." />;
  }

  if (status === "notfound") {
    return <NotFound />;
  }

  const getPlayerStatusColor = (hasResponse: boolean) => {
    return hasResponse
      ? "border-green-400 shadow-green-200"
      : "border-yellow-400 shadow-yellow-200";
  };

  const getGameStatusText = () => {
    const playersNeeded = 4 - gamePlayers.length;
    if (gameStatus === "gameON") return "Game in Progress";
    if (playersNeeded === 0) return "Ready to Start!";
    return `Waiting for ${playersNeeded} more player${
      playersNeeded !== 1 ? "s" : ""
    }`;
  };

  return (
    <div className="game-bg min-h-screen">
      <div className="relative min-h-screen bg-black/5">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-white" />
            <h1 className="text-xl font-bold text-white truncate">
              {roomName}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && <StartGame />}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row min-h-screen lg:min-h-0">
          {/* Main Game Area */}
          <main className="flex-1 flex flex-col p-4 lg:p-8">
            {/* Desktop Header */}
            <div className="hidden lg:flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Players</h1>
                  <p className="text-white/70">
                    {gamePlayers.length}/4 players joined
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {showQuestion && (
                  <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-xl p-4 max-w-md">
                    <p className="text-white font-medium">{question}</p>
                  </div>
                )}
                {isAdmin && <StartGame />}
              </div>
            </div>

            {/* Players Grid - Responsive */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-6xl">
                {/* Mobile: Single column stack */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-8">
                  {/* Render existing players */}
                  {gamePlayers.map((playerData, i) => {
                    const hasResponse = playerResponses.has(playerData.email);
                    return (
                      <div
                        className={`relative overflow-hidden rounded-2xl border-4 ${getPlayerStatusColor(
                          hasResponse
                        )} shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
                        key={playerData.email || i}
                        style={{
                          backgroundColor: colorMap[playerData.color],
                          boxShadow: `0 10px 40px ${
                            colorMap[playerData.color]
                          }40`,
                        }}
                      >
                        {/* Player content */}
                        <div className="relative z-10 flex items-center p-4 lg:p-6 gap-4">
                          <div className="relative">
                            <CircleUserRound className="w-12 h-12 lg:w-16 lg:h-16 text-white drop-shadow-lg" />
                            {isAdmin && playerData.email === playerEmail && (
                              <Crown className="absolute -top-2 -right-2 w-6 h-6 text-yellow-300 drop-shadow-md" />
                            )}
                            {hasResponse && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h2 className="text-lg lg:text-xl font-bold text-white truncate">
                                {playerData.username}
                              </h2>
                              {playerData.email === playerEmail && (
                                <span className="text-xs bg-white/30 text-white px-2 py-1 rounded-full">
                                  You
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3 text-white/70" />
                              <p className="text-sm text-white/90 truncate">
                                {hasResponse
                                  ? "Answered ✓"
                                  : "Waiting for response..."}
                              </p>
                            </div>

                            {/* Response preview (hidden on mobile for space) */}
                            {hasResponse && (
                              <p className="hidden lg:block text-xs text-white/70 mt-1 truncate">
                                &quot;{playerResponses.get(playerData.email)}
                                &quot;
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Animated background effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    );
                  })}

                  {/* Empty slots */}
                  {Array.from({ length: 4 - gamePlayers.length }).map(
                    (_, i) => (
                      <div
                        key={`empty-${i}`}
                        className="bg-white/10 backdrop-blur-sm border-4 border-dashed border-white/30 rounded-2xl p-4 lg:p-6 flex items-center justify-center transition-all duration-300 hover:bg-white/15"
                      >
                        <div className="text-center">
                          <div className="relative mb-3">
                            <CircleUserRound className="w-12 h-12 lg:w-16 lg:h-16 mx-auto text-white/50" />
                            <div className="absolute inset-0 animate-ping">
                              <CircleUserRound className="w-12 h-12 lg:w-16 lg:h-16 mx-auto text-white/20" />
                            </div>
                          </div>

                          <p className="text-white/70 font-medium mb-1">
                            Waiting for player
                          </p>

                          <div className="flex justify-center gap-1">
                            {[0, 200, 400].map((delay, i) => (
                              <span
                                key={i}
                                className="w-1 h-1 bg-white/50 rounded-full animate-pulse"
                                style={{ animationDelay: `${delay}ms` }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </main>

          {/* Sidebar - Responsive */}
          <aside
            className={`
            fixed lg:relative top-0 right-0 h-full w-80 lg:w-96 
            bg-white/95 backdrop-blur-md border-l border-white/20 
            transform transition-transform duration-300 ease-in-out z-50
            ${
              isSidebarOpen
                ? "translate-x-0"
                : "translate-x-full lg:translate-x-0"
            }
          `}
          >
            {/* Sidebar content */}
            <div className="flex flex-col h-full p-6">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 truncate">
                    {roomName}
                  </h1>
                  <Button
                    onClick={() => setIsSidebarOpen(false)}
                    className="lg:hidden p-2 rounded-lg hover:bg-black/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-600" />
                  </Button>
                </div>

                <div className="bg-slate-100 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Room ID:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-slate-800 font-mono bg-white px-2 py-1 rounded text-sm">
                        {roomID}
                      </code>
                      <CopyButton text={roomID} />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-100 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">
                      Share with ur friends:{" "}
                    </span>
                    <div className="flex items-center gap-2">
                      <CopyButton text={fullURL} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-4 mb-8">
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-slate-800">
                      Players
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {gamePlayers.length}
                    <span className="text-slate-400">/4</span>
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        gameStatus === "gameON"
                          ? "bg-green-500 animate-pulse"
                          : "bg-yellow-500"
                      }`}
                    />
                    <span className="font-semibold text-slate-800">Status</span>
                  </div>
                  <p
                    className={`font-medium ${
                      gameStatus === "gameON"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {getGameStatusText()}
                  </p>
                </div>
              </div>

              {/* Game Info */}
              <div className="bg-slate-50 rounded-xl p-4 mb-8">
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                  Game Info
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {gameStatus === "gameON"
                    ? "The game is now in progress. Follow the instructions and submit your responses!"
                    : "Waiting for all players to join. The game will start when 4 players are present and the host starts the game."}
                </p>
              </div>

              {/* Actions */}
              <div className="mt-auto space-y-3">
                <LeaveButton />

                {/* Quick stats */}
                <div className="text-xs text-slate-500 text-center py-2">
                  Room created • {gamePlayers.length} active players
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile sidebar overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </div>

        <GameDialog gameStatus={gameStatus} />
      </div>
    </div>
  );
};

export default Page;
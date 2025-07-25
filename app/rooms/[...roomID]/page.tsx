"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/useRoomStore";
import { Button } from "@/components/ui/button";
import { CircleUserRound } from "lucide-react";
import { getSocket } from "@/lib/socket";
import { useParams } from "next/navigation";
import SmileyLoader from "@/components/SmileyLoader";
import { usePlayerStore } from "@/store/usePlayerStore";
import colorMap from "@/types/color";
import GameInput from "@/components/GameInput";
import GameDialog from "@/components/GameDialog";

const Page = () => {
  const [status, setStatus] = useState<"loading" | "notfound" | "found">(
    "loading"
  );

  const params = useParams();
  const roomID = params?.roomID;
  const roomName = useGameStore((state) => state.name);
  const playerEmail = usePlayerStore((state) => state.email);
  const router = useRouter();
  const setGame = useGameStore((state) => state.setGame);
  const setQuestion = useGameStore((state) => state.setQuestion);
  const gamePlayers = useGameStore((state) => state.players);
  const isAdmin = usePlayerStore((state) => state.isAdmin);
  const [gameStatus, setGameStatus] = useState<"gameOFF" | "gameON">("gameOFF");

  if (!roomID) router.replace("/");

  useEffect(() => {
    const socket = getSocket();

    socket.on("connect", () => {
      
    });

    socket.emit("joinRoom", { roomID, playerEmail });

    socket.on("gameData", (data) => {
      setStatus("found");
      setGame(data.roomID, data.name, data.players, data.status);
    });

    socket.on("question", (questionText: string) => {
      setQuestion(questionText);
    });

    socket.on("joinRoomError", () => {
      setStatus("notfound");
    });

    socket.on("gameStarted", () => {
      setGameStatus("gameON");
    });

    return () => {
      socket.off("connect");
      socket.off("welcome");
    };
  }, [roomID, router, playerEmail, setGame, setQuestion]);

  if (status === "loading") return <SmileyLoader />;
  if (status === "notfound") {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-4xl">Room Not Found</h1>
        <Button onClick={() => router.replace("/")}>Go Home</Button>
      </div>
    );
  }

  if (status === "found")
    return (
      <section className="flex items-center justify-center w-full h-screen">
        <div className="flex flex-col h-screen w-full">
          <div className="flex flex-col w-full">
            <div className="flex  items-center justify-between p-4">
              <h2 className="text-3xl">Players</h2>
              {isAdmin ? <GameInput /> : ""}
            </div>

            <div className="grid grid-cols-2 grid-rows-2 gap-12 p-12">
              {gamePlayers.map((playerData, i) => (
                <div
                  className="bg-green-50  flex items-center p-4 rounded-2xl text-white gap-4 border-4 border-black"
                  key={i}
                  style={{ backgroundColor: colorMap[playerData.color] }}
                >
                  <CircleUserRound className="!w-14 !h-14 rounded-3xl transition transition-400" />
                  <h1 className="text-2xl">{playerData.username}</h1>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col p-4 border-l-2 border-black bg-white text-black h-screen w-3/12">
          <div>
            <h1 className="font-bold text-3xl text-center mb-4">{roomName}</h1>
            <h2 className="text-2xl">RoomID: {roomID}</h2>
          </div>
          <div>
            <h2>Settings</h2>
          </div>
        </div>
        {isAdmin === false && <GameDialog gameStatus={gameStatus} />}
      </section>
    );
};

export default Page;

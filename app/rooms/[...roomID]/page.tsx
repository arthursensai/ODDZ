"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/useRoomStore";
import { Button } from "@/components/ui/button";
import { CircleUserRound } from "lucide-react";
import { getSocket } from "@/lib/socket";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const roomID = params?.roomID;
  const roomName = useGameStore((state) => state.name);
  const router = useRouter();

  if (!roomID) router.replace("/");

  useEffect(() => {
    const socket = getSocket();

    socket.on("connect", () => {
      console.log("Connected to the socket");
    });

    socket.emit("joinRoom", { roomID });

    socket.on("gameData", (data) => {
      console.log("وصلت بيانات:", data);
    });

    return () => {
      socket.off("connect");
      socket.off("welcome");
    };
  }, [roomID, router]);

  return (
    <section className="flex items-center justify-center w-full h-screen">
      <div className="flex flex-col h-screen w-full">
        <div>
          <div>
            <h2>Players</h2>
            <Button>Start the round</Button>
          </div>

          <div className="bg-green-50">
            <CircleUserRound className="!w-10 !h-10 bg-white rounded-3xl transition transition-400" />
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
    </section>
  );
};

export default Page;

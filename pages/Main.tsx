"use client";

import { useEffect, useState } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";
import Header from "@/components/Header";
import { Player } from "@prisma/client";
import CreateRoom from "../components/CreateRoom";
import JoinRoom from "@/components/JointRoom";

interface MainProps {
  player: Player;
}

const Main = ({ player }: MainProps) => {
  const [status, setStatus] = useState<"loading" | "found" | "notfound">("loading");

  const setPlayer = usePlayerStore((state) => state.setPlayer);
  useEffect(() => {
    if (player.email && player.username && player.color) {
      setPlayer(player.email, player.username, player.color);
      setStatus("found");
    } else {
      setStatus("notfound");
      console.log("Player data incomplete:", player);
    }
  }, [player, setPlayer]);

  if(status === "loading") return <div>loading...</div>
  if(status === "notfound") return <div>Error</div>

  return (
    <section className="flex flex-col h-screen w-full">
      <Header />
      <div className="flex justify-center items-center h-full gap-4">
        <CreateRoom />
        <JoinRoom />
      </div>
    </section>
  );
};

export default Main;

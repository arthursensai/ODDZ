"use client";

import { useEffect } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";
import Header from "@/components/Header";
import { Player } from "@prisma/client";
import CreateRoom from "../components/CreateRoom";
import JoinRoom from "@/components/JointRoom";

interface MainProps {
  player: Player;
}

const Main = ({ player }: MainProps) => {
  const setPlayer = usePlayerStore((state) => state.setPlayer);

  useEffect(() => {
    setPlayer(player.email, player.username, player.color);
  }, [player, setPlayer]);

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

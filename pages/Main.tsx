"use client";

import { useEffect, useState } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";
import Header from "@/components/Header";
import { Player } from "@prisma/client";
import CreateRoom from "../components/CreateRoom";
import JoinRoom from "@/components/JointRoom";
import { motion } from "framer-motion";
import SmileyLoader from "@/components/SmileyLoader";

interface MainProps {
  player: Player;
}

const Main = ({ player }: MainProps) => {
  const [status, setStatus] = useState<"loading" | "found" | "notfound">(
    "loading"
  );

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

  if (status === "loading") return <SmileyLoader text="loading..."/>;
  if (status === "notfound") return <div>Error</div>;

  return (
    <section className="flex flex-col h-screen w-full absolute inset-0 bg-black/35">
      <Header />
      <div className="flex flex-col justify-center items-center h-full gap-4">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-5xl font-extrabold mb-6 text-center drop-shadow"
        >
          Ready to find the <span className="text-[#84cc16]">imposter </span>?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg md:text-xl text-white/80 mb-4 text-center"
        >
          A game of logic, trust, and deception.
        </motion.p>
        <div className="flex gap-4">
          <CreateRoom />
          <JoinRoom />
        </div>
      </div>
    </section>
  );
};

export default Main;
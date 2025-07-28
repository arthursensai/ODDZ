"use client";

import { useEffect, useState } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";
import Header from "@/components/Header";
import { Player } from "@prisma/client";
import CreateRoom from "../components/CreateRoom";
import JoinRoom from "@/components/JointRoom";
import { motion } from "framer-motion";
import SmileyLoader from "@/components/SmileyLoader";
import BackgroundMusic from "@/components/BackgroundMusic";
import HomeAnimation from "@/components/HomeAnimation";

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

  if (status === "loading") return <SmileyLoader text="loading..." />;
  if (status === "notfound") return <div>Error</div>;

  return (
    // REMOVED: h-screen - this was constraining the height
    // CHANGED: Use min-h-screen to allow natural expansion
    <section className="min-h-screen w-full flex flex-col relative">
      <BackgroundMusic />
      <Header />
      
      {/* Main content container */}
      {/* CHANGED: Use min-h-0 to prevent flex issues and py-8 for breathing room */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0 py-8">
        {/* Animation section - smaller on desktop */}
        <div className="lg:w-2/5 flex items-center justify-center p-4 lg:p-6">
          <div className="w-full max-w-[300px] sm:max-w-[350px] lg:max-w-[400px]">
            <HomeAnimation />
          </div>
        </div>
        
        {/* Content section - larger on desktop */}
        <div className="flex-1 lg:w-3/5 flex flex-col justify-center items-center p-6 lg:p-8 lg:pr-16">
          <div className="w-full max-w-2xl space-y-8">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left space-y-4"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight drop-shadow-lg text-white">
                Ready to find the{" "}
                <span className="text-[#84cc16] drop-shadow-md">imposter</span>?
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xl sm:text-2xl lg:text-3xl text-white/80 text-center lg:text-left leading-relaxed"
            >
              A game of logic, trust, and deception.
            </motion.p>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 pt-6 justify-center items-center lg:justify-start"
            >
              <CreateRoom />
              <JoinRoom />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Main;
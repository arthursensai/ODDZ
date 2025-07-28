"use client";

import { usePlayerStore } from "@/store/usePlayerStore";
import { useEffect, useRef } from "react";

const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const musicOn = usePlayerStore((state) => state.musicOn);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/sounds/background.mp3");
      audioRef.current.loop = true;
    }

    if (musicOn) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }

    return () => {
      audioRef.current?.pause();
    };
  }, [musicOn]);

  return null;
};

export default BackgroundMusic;

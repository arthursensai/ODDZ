"use client";

import { useEffect, useRef } from "react";
import { useMusicStore } from "@/store/useMusicStore";

const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isPlaying } = useMusicStore();

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/sounds/background.mp3");
      audioRef.current.loop = true;
    }

    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }

    return () => {
      audioRef.current?.pause();
    };
  }, [isPlaying]);

  return null;
};

export default BackgroundMusic;

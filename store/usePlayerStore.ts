import { Color } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PlayerState {
  email: string;
  username: string;
  color: Color | "";
  isAdmin: boolean,
  musicOn: boolean,
  setPlayer: (email: string, username: string, color: Color) => void;
  setAdmin: (isAdmin: boolean) => void;
  setMusicON: (musicOn: boolean) => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      email: "",
      username: "",
      color: "",
      isAdmin: false,
      musicOn: false,
      setPlayer: (email, username, color) => set({ email, username, color}),
      setAdmin: (isAdmin) => set({ isAdmin }),
      setMusicON: (musicOn) => set({ musicOn })
    }),
    {
      name: "player-storage",
    }
  )
);
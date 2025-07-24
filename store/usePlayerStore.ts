import { Color } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PlayerState {
  email: string;
  username: string;
  color: Color | "";
  isAdmin: boolean,
  setPlayer: (email: string, username: string, color: Color) => void;
  setAdmin: (isAdmin: boolean) => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      email: "",
      username: "",
      color: "",
      isAdmin: false,
      setPlayer: (email, username, color) => set({ email, username, color}),
      setAdmin: (isAdmin) => set({ isAdmin })
    }),
    {
      name: "player-storage",
    }
  )
);
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GameState {
  roomID: string;
  name: string;
  players: string[];
  setGame: (roomID: string, name: string, playerID: string) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      roomID: "",
      name: "",
      players: ["", "", "", ""],
      setGame: (roomID, name, playerID) =>
        set(() => ({
          roomID,
          name,
          players: [playerID, "", "", ""],
        })),
      resetGame: () =>
        set(() => ({
          roomID: "",
          name: "",
          players: ["", "", "", ""],
        })),
    }),
    {
      name: "game-storage",
    }
  )
);

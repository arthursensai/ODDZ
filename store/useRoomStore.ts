import { create } from "zustand";
import { persist } from "zustand/middleware";
import GameStatus from "@/types/GameStatus";
import { Player as PlayerInfo } from "@prisma/client";

interface GameState {
  roomID: string;
  name: string;
  status: GameStatus;
  players: PlayerInfo[];
  winner: string | null;
  question: string | null;
  setGame: (roomID: string, name: string, players: PlayerInfo[], status: GameStatus) => void;
  addPlayer: (player: PlayerInfo) => void;
  setStatus: (status: GameStatus) => void;
  setQuestion: (question: string) => void;
  startGame: (question: string) => void;
  finishGame: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      roomID: "",
      name: "",
      status: "WAITING",
      winner: null,
      question: null,
      players: [],

      setGame: (roomID, name, players, status) =>
        set(() => ({
          roomID,
          name,
          status,
          players,
        })),

      addPlayer: (player) =>
        set((state) => {
          if (state.players.find((p) => p.id === player.id)) return {};
          return {
            players: [...state.players, player],
          };
        }),

      setStatus: (status) => set(() => ({ status })),

      setQuestion: (question) => set(() => ({ question })),

      startGame: (question: string) =>
        set(() => ({
          status: "IN_PROGRESS",
          question,
        })),

      finishGame: () =>
        set(() => ({
          roomID: "",
          name: "",
          status: "FINISHED",
          players: [],
          winner: null,
          question: null,
        })),
    }),
    {
      name: "game-storage",
    }
  )
);
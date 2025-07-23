import { Color } from "@prisma/client";
import { create } from "zustand";

interface PlayerState {
  email: string;
  username: string;
  color: Color | "";
  setPlayer: (email: string, username: string, color: Color) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  email: "",
  username: "",
  color: "",
  setPlayer: (email, username, color) => set({ email, username, color }),
}));
import { create } from "zustand";

type MusicStore = {
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
};

export const useMusicStore = create<MusicStore>((set) => ({
  isPlaying: true,
  setIsPlaying: (value) => set({ isPlaying: value }),
}));
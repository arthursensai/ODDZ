import { Button } from "@/components/ui/button";
import { getSocket } from "@/lib/socket";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useGameStore } from "@/store/useRoomStore";
import { FormEvent, useState } from "react";

const StartGame = () => {
  const playerEmail = usePlayerStore((state) => state.email);
  const roomID = useGameStore((state) => state.roomID);
  const [error, setError] = useState<string | null>(null);
  const players = useGameStore((state) => state.players);

  const handleStartGame = (e: FormEvent) => {
    e.preventDefault();
    const socket = getSocket();

    socket.emit("startGame", { roomID, playerEmail });

    socket.on("startGameError", (err) => {
      setError(err?.message);
    })
  };

  return (
    <form onSubmit={handleStartGame} className="flex flex-col">
      <Button type="submit" className="bg-green-700 hover:cursor-pointer hover:bg-green-600" disabled={players.length < 2}>Start the game</Button>
      <p className="text-red-700">{error}</p>
    </form>
  );
};

export default StartGame;

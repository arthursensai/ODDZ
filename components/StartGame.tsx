import { Button } from "@/components/ui/button";
import { getSocket } from "@/lib/socket";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useGameStore } from "@/store/useRoomStore";
import { FormEvent } from "react";

const StartGame = () => {
  const playerEmail = usePlayerStore((state) => state.email);
  const roomID = useGameStore((state) => state.roomID);

  const handleStartGame = (e: FormEvent) => {
    e.preventDefault();
    const socket = getSocket();

    socket.emit("startGame", { roomID, playerEmail });

    socket.on("startGameError", (err) => {
        console.log(err);
    })
  };

  return (
    <form onSubmit={handleStartGame}>
      <Button type="submit" className="bg-green-700 hover:cursor-pointer hover:bg-green-600">Start the game</Button>
    </form>
  );
};

export default StartGame;

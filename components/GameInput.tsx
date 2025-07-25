import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSocket } from "@/lib/socket";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useGameStore } from "@/store/useRoomStore";
import { useState } from "react";

const GameInput = ({ isDisabled }: { isDisabled: boolean }) => {
  const [status, setStatus] = useState<"loading" | "done" | "error" | "gameON">(
    "loading"
  );
  const email = usePlayerStore((state) => state.email);
  const question = useGameStore((state) => state.question);

  const startGame = async () => {
    const socket = getSocket();
    setStatus("loading");

    socket.emit("startGame", { email });

    socket.on("question", () => {
      setStatus("gameON");
    })

    socket.on("error", () => {
      setStatus("error");
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="disabled:opacity-75 hover:cursor-pointer" onClick={startGame} disabled={isDisabled} >
          Start the Game
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {status === "loading" ? (
          <DialogHeader>
            <DialogDescription>loading</DialogDescription>
          </DialogHeader>
        ) : (
          <form>
            <DialogHeader>
              <DialogTitle>The Question is: </DialogTitle>
              <DialogDescription>{question}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div>Timer: 30s</div>

              <div className="grid gap-3">
                <Label htmlFor="player-answer">your answer</Label>
                <Input id="player-answer" name="player-answer" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Send</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GameInput;

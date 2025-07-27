import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGameStore } from "@/store/useRoomStore";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import { usePlayerStore } from "@/store/usePlayerStore";

const GameDialog = ({ gameStatus }: { gameStatus: string }) => {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const question = useGameStore((state) => state.question);
  const playerEmail = usePlayerStore((state) => state.email);
  const gameId = useGameStore((state) => state.roomID);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!answer.trim()) return;

    setLoading(true);
    setError("");

    try {
      await axios.post("/api/room/collect-answers", {
        email: playerEmail,
        gameId,
        playerResponse: answer,
      });
      setOpen(false);
    } catch (err) {
      console.error("Error submitting answer:", err);
      setError("An error happened, try again.");
    } finally {
      setLoading(false);
      setAnswer("");
    }
  };

  useEffect(() => {
    if (gameStatus === "gameON") {
      setOpen(true);
    }
  }, [gameStatus]);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (isOpen) setOpen(true);
      }}
    >
      <DialogContent
        className="text-black"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader>The game has started!</DialogHeader>
          <DialogTitle>Your question is:</DialogTitle>
          <DialogDescription className="mb-2">{question}</DialogDescription>

          <div className="flex flex-col gap-2">
            <Label htmlFor="player_answer">Your answer:</Label>
            <Input
              id="player_answer"
              placeholder="Type your answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={loading}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          <DialogFooter className="mt-4">
            <Button type="submit" disabled={loading || !answer.trim()}>
              {loading ? "Sending..." : "Send your answer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GameDialog;
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
import { usePlayerStore } from "@/store/usePlayerStore";
import { getSocket } from "@/lib/socket";

const GameDialog = ({ gameStatus }: { gameStatus: string }) => {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const question = useGameStore((state) => state.question);
  const playerEmail = usePlayerStore((state) => state.email);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!answer.trim()) return;

    setLoading(true);
    setError("");

    try {
      const socket = getSocket();
      
      socket.emit("playerResponse", {
        answer: answer.trim()
      });

      const handleSuccess = () => {
        setOpen(false);
        setAnswer("");
        setLoading(false);
        socket.off("playerResponseError", handleError);
        socket.off("playerResponse", handleSuccess);
      };

      const handleError = (errorData: { message: string }) => {
        setError(errorData.message || "An error happened, try again.");
        setLoading(false);
        socket.off("playerResponseError", handleError);
        socket.off("playerResponse", handleSuccess);
      };

      socket.once("playerResponseError", handleError);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const originalPlayerResponseHandler = (data: any) => {
        if (data.playerEmail === playerEmail) {
          handleSuccess();
        }
      };
      
      socket.once("playerResponse", originalPlayerResponseHandler);

      setTimeout(() => {
        socket.off("playerResponseError", handleError);
        socket.off("playerResponse", originalPlayerResponseHandler);
        if (loading) {
          setError("Request timed out, please try again.");
          setLoading(false);
        }
      }, 10000);

    } catch (err) {
      console.error("Error submitting answer:", err);
      setError("An error happened, try again.");
      setLoading(false);
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
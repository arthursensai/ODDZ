import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useGameStore } from "@/store/useRoomStore";
import { useEffect, useState } from "react";

const GameDialog = ({ gameStatus }: { gameStatus: string }) => {
  const [open, setOpen] = useState(false);
  const question = useGameStore((state) => state.question);

  useEffect(() => {
    if (gameStatus === "gameON") {
      setOpen(true);
    }
  }, [gameStatus]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="text-black">
        <p>The game has started!</p>
        <p>{question}</p>
      </DialogContent>
    </Dialog>
  );
};

export default GameDialog;
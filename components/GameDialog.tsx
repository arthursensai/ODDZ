import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useGameStore } from "@/store/useRoomStore";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";

const GameDialog = ({ gameStatus }: { gameStatus: string }) => {
  const [open, setOpen] = useState(false);
  const question = useGameStore((state) => state.question);

  useEffect(() => {
    if (gameStatus === "gameON") {
      console.log(question)
      setOpen(true);
    }
  }, [gameStatus, question]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="text-black"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>The game has started!</DialogHeader>
        <DialogDescription>Your question is: </DialogDescription>
        <p>{question}</p>
      </DialogContent>
    </Dialog>
  );
};

export default GameDialog;

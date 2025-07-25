import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/useRoomStore";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useState, FormEvent } from "react";
import axios from "axios";

const JoinRoom = () => {
  const router = useRouter();

  const setGame = useGameStore((state) => state.setGame);
  const email = usePlayerStore((state) => state.email);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleCreating = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const roomID = formData.get("id");

    setStatus("loading");

    try {
      const room = await axios.post("/api/room/join-room", {
        roomID,
        email,
      });

      setGame(room.data.roomID, room.data.name, room.data.id, room.data.status);
      setStatus("success");
      router.push(`/rooms/${roomID}`);
    } catch (err) {
      setStatus("error");
      console.log(err);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#00c2ff] hover:bg-[#00c2ff] hover:cursor-pointer hover:scale-110 text-3xl px-4 py-8 ">
          Join a room
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] text-black">
        <form onSubmit={handleCreating}>
          <DialogHeader>
            <DialogTitle className="mb-4">Join Room</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <Label htmlFor="id">room ID:</Label>
            <Input id="id" name="id" />
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">
              {status === "loading"
                ? "Joining..."
                : status === "success"
                ? "Redirecting!"
                : "Join"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinRoom;

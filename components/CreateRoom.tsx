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
import { useState, FormEvent } from "react";
import axios from "axios";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useGameStore } from "@/store/useRoomStore";
import { useRouter } from "next/navigation";

const CreateRoom = () => {
  const router = useRouter();
  const setGame = useGameStore((state) => state.setGame);
  const email = usePlayerStore((state) => state.email);
  const setAdmin = usePlayerStore((state) => state.setAdmin);

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleCreating = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");

    setStatus("loading");

    try {
      const room = await axios.post("/api/room/create-room", {
        name,
        email,
      });

      setGame(room.data.roomID, room.data.name, room.data.id, room.data.status);
      setAdmin(true);
      setStatus("success");
      router.push(`/rooms/${room.data.roomID}`);
    } catch (err) {
      setStatus("error");
      console.log(err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#00c2ff] hover:bg-[#00c2ff] hover:cursor-pointer hover:scale-110 text-3xl px-4 py-8 ">
          Create a room
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] text-black">
        <form onSubmit={handleCreating}>
          <DialogHeader>
            <DialogTitle className="mb-4">Create Room</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <Label htmlFor="name">name</Label>
            <Input id="name" name="name" />
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              disabled={status === "loading"}
              type="submit"
              className={`hover:cursor-pointer ${
                status === "loading"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {status === "loading"
                ? "Creating..."
                : status === "success"
                ? "Redirecting!"
                : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoom;

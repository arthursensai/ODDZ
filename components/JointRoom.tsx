import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const roomIDSchema = z.object({
  roomId: z
    .string()
    .min(6, "Room ID is required")
    .max(6, "Room ID must be 6 characters"),
});

type FormData = z.infer<typeof roomIDSchema>;

const JoinRoom = () => {
  const router = useRouter();

  const setGame = useGameStore((state) => state.setGame);
  const email = usePlayerStore((state) => state.email);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(roomIDSchema),
  });

  const handleJoining = async (data: FormData) => {
    setStatus("loading");

    try {
      const room = await axios.post("/api/room/join-room", {
        roomID: data.roomId,
        email,
      });

      setGame(room.data.roomID, room.data.name, room.data.id, room.data.status);
      setStatus("success");
      router.push(`/rooms/${data.roomId}`);
    } catch (err) {
      setStatus("error");
      console.log(err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button className="bg-gradient-to-l from-[#00bcd4] to-[#0097a7] shadow-secondary-btn hover:bg-[#00b0e5] text-white px-6 py-4 rounded-xl transition-all duration-300 text-xl h-max hover:cursor-pointer">
            Join a room
          </Button>
        </motion.div>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[425px] text-black"
        onEscapeKeyDown={(e) =>
          status === "loading" ? e.preventDefault() : ""
        }
        onInteractOutside={(e) =>
          status === "loading" ? e.preventDefault() : ""
        }
      >
        <form onSubmit={handleSubmit(handleJoining)}>
          <DialogHeader>
            <DialogTitle>Join Room</DialogTitle>
          </DialogHeader>
          <DialogDescription className="my-4">
            Join your friends room
          </DialogDescription>
          <div className="grid gap-3">
            <Label htmlFor="roomId">Room ID:</Label>
            <Input id="roomId" placeholder="12ks79" {...register("roomId")} />
          </div>
          {errors.roomId && (
            <p className="text-red-500 text-sm mt-1">{errors.roomId.message}</p>
          )}
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="hover:cursor-pointer"
                disabled={status === "loading"}
              >
                Cancel
              </Button>
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
                ? "Searching..."
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

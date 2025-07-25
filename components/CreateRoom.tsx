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
import { useState } from "react";
import axios from "axios";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useGameStore } from "@/store/useRoomStore";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const roomSchema = z.object({
  name: z
    .string()
    .min(1, "Room name is required")
    .max(20, "Room name must be less than 20 characters")
    .regex(/^[a-zA-Z0-9\s]+$/, "Only letters, numbers and spaces allowed"),
});

type FormData = z.infer<typeof roomSchema>;

const CreateRoom = () => {
  const router = useRouter();
  const setGame = useGameStore((state) => state.setGame);
  const email = usePlayerStore((state) => state.email);
  const setAdmin = usePlayerStore((state) => state.setAdmin);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(roomSchema),
  });

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleCreating = async (data: FormData) => {
    setStatus("loading");

    try {
      const room = await axios.post("/api/room/create-room", {
        name: data.name,
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button className="bg-[#3b82f6] hover:bg-[#00b0e5] text-white px-6 py-4 rounded-xl shadow-md transition-all duration-300 text-xl h-max hover:cursor-pointer">
            Create a room
          </Button>
        </motion.div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] text-black">
        <form onSubmit={handleSubmit(handleCreating)}>
          <DialogHeader>
            <DialogTitle>Create Room</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-sm text-gray-600 my-4">
            Create a private room to play with your friends
          </DialogDescription>
          <div className="grid gap-3">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Room Name
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="My Awesome Game Room"
            />
          </div>
          {errors.name && ( // ✅ Add error display
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" className="hover:cursor-pointer">
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

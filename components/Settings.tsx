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
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { CircleUserRound } from "lucide-react";
import colorMap from "@/types/color";
import { useState, FormEvent } from "react";
import axios from "axios";
import { usePlayerStore } from "@/store/usePlayerStore";
import { Color } from "@prisma/client";

const Settings = () => {
  const setPlayer = usePlayerStore((state) => state.setPlayer);

  const email = usePlayerStore((state) => state.email);
  const username = usePlayerStore((state) => state.username);
  const color = usePlayerStore((state) => state.color);

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const newUsername = formData.get("username");
    const newColor = formData.get("color");

    if (typeof newUsername !== "string") return;

    try {
      await axios.post("/api/profile", {
        email,
        username: newUsername,
        color: newColor,
      });

      setStatus("success");
      setTimeout(() => setStatus("idle"), 2000);
      setPlayer(email, newUsername, newColor as Color);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <CircleUserRound
          color={colorMap[color]}
          className="!w-10 !h-10 bg-white rounded-3xl hover:cursor-pointer hover:scale-110 transition transition-400"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] text-black">
        <form onSubmit={handleSave}>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 mt-4">
            <div className="grid gap-3">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" defaultValue={username} />
            </div>
          </div>
          <div className="grid gap-4 mt-4">
            <div className="grid gap-3">
              <Label htmlFor="color">Color</Label>
              <RadioGroup name="color" defaultValue={color}>
                <div className=" grid grid-cols-4 grid-rows-3 gap-4">
                  {Object.entries(colorMap).map(([name, hex]) => (
                    <RadioGroupItem
                      key={hex}
                      value={name}
                      title={name}
                      className="w-full h-12 rounded-full cursor-pointer border border-black
                                  data-[state=checked]:ring-4 data-[state=checked]:ring-white 
                                  data-[state=checked]:ring-offset-2 data-[state=checked]:ring-offset-black"
                      style={{ backgroundColor: colorMap[name] }}
                    />
                  ))}
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" className="hover:cursor-pointer">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className={`hover:cursor-pointer ${
                status === "loading"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              disabled={status === "loading"}
            >
              {status === "loading"
                ? "Saving..."
                : status === "success"
                ? "Saved!"
                : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default Settings;

import { useMusicStore } from "@/store/useMusicStore";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

const PlayMusicButton = () => {
  const { isPlaying, setIsPlaying } = useMusicStore();

  return (
    <Button onClick={() => setIsPlaying(!isPlaying)} variant="outline">
      {isPlaying ? (
        <>
          <Volume2 className="mr-2" /> Turn Off
        </>
      ) : (
        <>
          <VolumeX className="mr-2" /> Turn On
        </>
      )}
    </Button>
  );
};

export default PlayMusicButton;
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/store/usePlayerStore";

const PlayMusicButton = () => {
  const musicOn = usePlayerStore((state) => state.musicOn);
  const setMusicON = usePlayerStore((state) => state.setMusicON);

  return (
    <Button
      onClick={() => {
        setMusicON(!musicOn);
      }}
      variant="outline"
    >
      {musicOn ? (
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
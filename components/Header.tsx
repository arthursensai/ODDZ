import Settings from "./Settings";
import { usePlayerStore } from "@/store/usePlayerStore";

const Header = () => {

  const username = usePlayerStore((state) => state.username);

  return (
    <header className="w-full border-b border-white flex p-4 justify-between">
      <h1 className="font-bold text-5xl">ODDZ</h1>

      <div className="flex justify-center text-center items-center gap-4">
        <h3 className="text-2xl">{username}</h3>
        <Settings/>
      </div>
    </header>
  );
};

export default Header;

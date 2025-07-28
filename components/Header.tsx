import Settings from "./Settings";
import { usePlayerStore } from "@/store/usePlayerStore";

const Header = () => {

  const username = usePlayerStore((state) => state.username);

  return (
    <header className="w-full flex p-4 justify-between header-bg">
      <h1 className="text-logo">ODDZ</h1>

      <div className="flex justify-center text-center items-center gap-4 settings player-bg">
        <h3 className="text-2xl">{username}</h3>
        <Settings/>
      </div>
    </header>
  );
};

export default Header;

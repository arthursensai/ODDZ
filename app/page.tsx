import { auth } from "@/auth";
import Main from "../pages/Main";
import getPlayerData from "@/utils/getPlayerData";
import LandingAnimation from "@/components/LandingAnimation";
import SignOut from "@/components/SignOut";

const Home = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    return (
      <div className="game-bg min-h-screen">
        <div className="flex flex-col items-center justify-center text-center relative min-h-screen px-4">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="relative z-10 w-full max-w-md">
            <LandingAnimation />
          </div>
        </div>
      </div>
    );
  }

  const player = await getPlayerData(session.user.email);

  if (!player) {
    return (
      <div className="game-bg min-h-screen">
        <div className="flex flex-col items-center justify-center relative min-h-screen px-4">
          <div className="absolute inset-0 bg-black/5"></div>

          <div className="relative z-10 text-center">
            <p className="text-xl font-semibold mb-4">❌ Player not found.</p>
            <div className="bg-white p-2 rounded-2xl inline-block">
              <SignOut />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-bg">
      <div className="relative">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative z-10">
          <Main player={player} />
        </div>
      </div>
    </div>
  );
};

export default Home;

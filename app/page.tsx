import { auth } from "@/auth";
import Main from "../pages/Main";
import getPlayerData from "@/utils/getPlayerData";
import LandingAnimation from "@/components/LandingAnimation";
import SignOut from "@/components/SignOut";

const Home = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    return (
      <section className="min-h-screen flex flex-col text-center text-white">
         <LandingAnimation />
      </section>
    );
  }

  const player = await getPlayerData(session.user.email);

  if (!player) {
    return (
      <section className="flex flex-col items-center justify-center w-full min-h-screen text-white">
        <p className="text-xl font-semibold">❌ Player not found.</p>
        <div className="bg-white p-2 rounded-2xl">
          <SignOut />
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col w-full min-h-screen justify-center items-center">
      <Main player={player} />
    </section>
  );
};

export default Home;

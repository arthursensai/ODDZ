import { auth } from "@/auth";
import SignIn from "../components/SignIn";
import Main from "../pages/Main";
import getPlayerData from "@/utils/getPlayerData";

const Home = async () => {
  const session = await auth();

  // If no session, show login prompt
  if (!session?.user?.email) {
    return (
      <section className="flex flex-col w-full min-h-screen justify-center items-center text-white">
        <p className="text-3xl font-bold mb-4">Click the button below to login first</p>
        <SignIn />
      </section>
    );
  }

  const player = await getPlayerData(session.user.email);

  if (!player) {
    return (
      <section className="flex items-center justify-center w-full min-h-screen text-white">
        <p className="text-xl font-semibold">❌ Player not found.</p>
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
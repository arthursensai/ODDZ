import { auth } from "@/auth";
import SignIn from "../components/SignIn";
import Main from "../pages/Main";
import getPlayerData from "@/utils/getPlayerData";

const Home = async () => {
  const session = await auth();
  if(!session?.user?.email) return <section>Error</section>

  const player = await getPlayerData(session?.user?.email);
  if(!player) return <section>Error</section>

  return (
    <section className="flex flex-col w-full min-h-screen justify-center items-center">
      {session && session?.user ? (
        <Main player={player} />
      ) : (
        <>
          <p className="text-3xl font-bold text-white">Click the button below to login first</p>
          <SignIn />
        </>
      )}
    </section>
  );
};

export default Home;

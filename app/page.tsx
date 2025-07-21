import { auth } from "@/auth";
import SignIn from "../components/SignIn";
import Main from "../pages/Main";

const Home = async () => {
  const session = await auth();
  return (
    <section className="flex flex-col w-full min-h-screen justify-center items-center">
      {session && session?.user ? (
        <Main />
      ) : (
        <>
          <p>Click the button below to login first</p>
          <SignIn />
        </>
      )}
    </section>
  );
};

export default Home;

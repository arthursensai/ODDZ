import { Button } from "@/components/ui/button";
import { SiGoogle } from "react-icons/si";
import { signInWithGoogle } from "@/lib/SignIn";

const SignIn = () => {
  return (
    <form action={signInWithGoogle}>
      <Button type="submit" className="bg-blue-400 hover:bg-blue-600 hover:cursor-pointer">
        <SiGoogle size={40} color="black" />
        Sign in with Google
      </Button>
    </form>
  );
};

export default SignIn;
import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { SiGoogle } from "react-icons/si";

export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <Button type="submit" className="bg-blue-400 hover:bg-blue-600 hover:cursor-pointer"><SiGoogle size={40} color="black" />Sign in with Google</Button>
    </form>
  );
}

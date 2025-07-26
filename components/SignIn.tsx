import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/SignIn";
import { motion } from "framer-motion";

const SignIn = () => {
  return (
    <motion.form
      action={signInWithGoogle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        type="submit"
        className="bg-blue-400 hover:bg-blue-500 hover:cursor-pointer"
      >
        Sign in with Google
      </Button>
    </motion.form>
  );
};

export default SignIn;

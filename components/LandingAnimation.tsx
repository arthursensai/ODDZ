"use client";

import { motion } from "framer-motion";
import SignIn from "../components/SignIn";

const LandingAnimation = () => {
  return (
    <>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-6xl font-bold mb-6"
      >
        👀 ODDZ – who&apos;s the imposter between them?
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-lg md:text-xl max-w-2xl mb-8"
      >
        A multiplayer game show the smartest between you 👁️‍🗨️!
      </motion.p>

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <SignIn />
      </motion.div>
    </>
  );
};

export default LandingAnimation;
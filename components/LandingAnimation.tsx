"use client";

import { motion } from "framer-motion";
import SignIn from "../components/SignIn";

const LandingAnimation = () => {
  return (
    <>
      <header className="flex items-center justify-between p-4">
        <motion.h1
          className="text-4xl font-bold"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          ODDZ
        </motion.h1>
        <motion.span initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }} className="opacity-75">Made By -ARTHUR</motion.span>
      </header>
      <div className="w-full h-full flex flex-1 items-center justify-center flex-col">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          who&apos;s the imposter between them?
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
      </div>
    </>
  );
};

export default LandingAnimation;
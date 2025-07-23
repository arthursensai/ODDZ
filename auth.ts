import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./lib/prisma";
import getRandomColorKey from "./utils/createRandomColor";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      try {
        const existingPlayer = await prisma.player.findUnique({
          where: { email: user.email! },
        });

        if (!existingPlayer) {
          await prisma.player.create({
            data: {
              email: user.email!,
              username: user.name || "Unknown",
              isOnline: true,
              inGame: false,
              color: getRandomColorKey(),
            },
          });
        } else {
          await prisma.player.update({
            where: { email: user.email! },
            data: { isOnline: true },
          });
        }

        return true;
      } catch (err) {
        console.error("Sign-in error:", err);
        return false;
      }
    },
  },
});
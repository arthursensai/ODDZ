import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ roomID: string }>;
};  

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const roomID = resolvedParams.roomID;

  const room = await prisma.game.findUnique({
    where: { id: roomID },
    select: { name: true },
  });

  const roomName = room?.name || `Room ${roomID}`;

  return {
    title: `ODDZ Room ${roomName} – Join the Logic Battle`,
    description: `Join room ${roomName} in ODDZ – a multiplayer strategy game of logic and chaos.`,
    openGraph: {
      title: `ODDZ Room ${roomName}`,
      description: `Real-time multiplayer gameplay in Room ${roomName}. Invite friends now!`,
      url: `https://oddz1-sigma.vercel.app/rooms/${roomID}`,
      images: [
        {
          url: "https://oddz1-sigma.vercel.app/og.png",
          width: 1200,
          height: 630,
          alt: "ODDZ Room Preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `ODDZ Room ${roomName}`,
      description: "Challenge your friends in this logic-driven game room.",
      images: ["https://oddz1-sigma.vercel.app/og.png"],
    },
  };
}

export default function RoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex justify-center items-center h-screen">
      {children}
    </main>
  );
}
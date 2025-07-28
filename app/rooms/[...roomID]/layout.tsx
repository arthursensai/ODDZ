import { Metadata } from "next";

type Props = {
  params: { roomID: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const roomID = params.roomID;

  return {
    title: `ODDZ Room ${roomID} – Join the Logic Battle`,
    description: `Join room ${roomID} in ODDZ – a multiplayer strategy game of logic and chaos.`,
    openGraph: {
      title: `ODDZ Room ${roomID}`,
      description: `Real-time multiplayer gameplay in Room ${roomID}. Invite friends now!`,
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
      title: `ODDZ Room ${roomID}`,
      description: "Challenge your friends in this logic-driven game room.",
      images: ["https://oddz1-sigma.vercel.app/og.png"],
    },
  };
}

export default function RoomLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex justify-center items-center h-screen">
      {children}
    </main>
  );
}

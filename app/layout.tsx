import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ODDZ – Multiplayer Game of Logic & Chaos",
  description:
    "ODDZ is a real-time multiplayer strategy game combining chaos, psychology, and logic. Challenge your friends now!",
  keywords: [
    "ODDZ",
    "multiplayer game",
    "strategy game",
    "browser game",
    "real-time game",
    "play with friends",
    "chaos game",
    "logic battle",
  ],
  authors: [{ name: "Arthur", url: "https://mohamedaitsidibah.netlify.app/" }],
  metadataBase: new URL("https://oddz1-sigma.vercel.app"),
  alternates: {
    canonical: "https://oddz1-sigma.vercel.app/",
  },
  icons: {
    icon: "/images/favicon.png",
    shortcut: "/images/favicon.png",
    apple: "/images/apple-touch-icon.png",
  },
  openGraph: {
    title: "ODDZ – Multiplayer Game of Logic & Chaos",
    description:
      "A unique browser game blending psychology and logic. Outplay your opponents in real-time chaos.",
    url: "https://oddz1-sigma.vercel.app/",
    siteName: "ODDZ",
    images: [
      {
        url: "https://oddz1-sigma.vercel.app/og.png",
        width: 1200,
        height: 630,
        alt: "ODDZ Game – Outplay with Logic",
      },
    ],
    locale: "fr_MA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ODDZ – Multiplayer Game of Logic & Chaos",
    description:
      "Challenge your mind in a real-time multiplayer logic game. Welcome to the chaos.",
    images: ["https://oddz1-sigma.vercel.app/og.png"],
  },
  category: "Game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter} antialiased game-bg`}>{children}</body>
    </html>
  );
}

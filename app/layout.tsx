import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Crypto Agent — 2222 Onchain Agents",
  description:
    "Complete daily onchain missions, earn points, unlock rewards, and secure your place in the next generation of autonomous crypto ecosystems.",
  metadataBase: new URL("https://agentpfp.live"),
  icons: {
    icon: "/images/favicon.png",
    shortcut: "/images/favicon.png",
    apple: "/images/favicon.png",
  },
  openGraph: {
    title: "Crypto Agent — 2222 Onchain Agents",
    description:
      "Your personal AI agent for the onchain future. Free mint. 2222 supply. Ethereum.",
    url: "https://agentpfp.live",
    siteName: "Crypto Agent",
    images: ["/images/og-banner.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crypto Agent — 2222 Onchain Agents",
    description:
      "Your personal AI agent for the onchain future. Free mint. 2222 supply. Ethereum.",
    images: ["/images/og-banner.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-void text-text-primary font-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

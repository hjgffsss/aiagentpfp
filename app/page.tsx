"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import LiveStats from "./components/LiveStats";
import About from "./components/About";
import Features from "./components/Features";
import Collection from "./components/Collection";
import Roadmap from "./components/Roadmap";
import Leaderboard from "./components/Leaderboard";
import EligibilityChecker from "./components/EligibilityChecker";
import FAQ from "./components/FAQ";
import Community from "./components/Community";
import Footer from "./components/Footer";
import WhitelistBot from "./components/WhitelistBot";

export default function Home() {
  const [botOpen, setBotOpen] = useState(false);
  const { address } = useAccount();
  const { open } = useWeb3Modal();

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Navbar
        onJoinWhitelist={() => setBotOpen(true)}
        onConnectWallet={() => open()}
        walletAddress={address ?? null}
      />
      <Hero onGetWhitelisted={() => setBotOpen(true)} />
      <LiveStats />
      <About />
      <Features />
      <Collection />
      <Roadmap />
      <Leaderboard />
      <EligibilityChecker />
      <FAQ />
      <Community onJoinWhitelist={() => setBotOpen(true)} />
      <Footer />

      {botOpen && <WhitelistBot onClose={() => setBotOpen(false)} />}
    </main>
  );
}

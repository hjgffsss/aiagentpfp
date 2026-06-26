"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Compass } from "lucide-react";
import AgentConstellation from "./AgentConstellation";

export default function Hero({
  onGetWhitelisted,
}: {
  onGetWhitelisted: () => void;
}) {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden"
    >
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="agent-field opacity-60" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass shimmer-bg text-xs font-medium text-agent-cyan mb-6">
            <Sparkles size={13} />
            2222 Autonomous Onchain Agents
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight text-text-primary">
            Your Personal{" "}
            <span className="text-gradient">AI Agent</span> For The
            Onchain Future
          </h1>

          <p className="mt-6 text-base sm:text-lg text-text-secondary max-w-xl leading-relaxed">
            Complete daily onchain activities, earn reward points, climb the
            leaderboard, and secure exclusive ecosystem benefits through
            intelligent agent participation.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <button
              onClick={onGetWhitelisted}
              className="group flex items-center gap-2 px-6 py-3.5 rounded-xl bg-agent-gradient text-white font-medium shadow-glow hover:opacity-90 transition-opacity"
            >
              Get Whitelisted
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </button>
            <a
              href="#collection"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-edge text-text-primary font-medium hover:bg-white/5 transition-colors"
            >
              <Compass size={16} />
              Explore Collection
            </a>
          </div>

          <p className="mt-7 text-xs text-text-muted tracking-wide">
            Built for the next billion onchain users
          </p>
        </motion.div>

        {/* Right: signature agent constellation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
          className="relative aspect-square w-full max-w-lg mx-auto"
        >
          <AgentConstellation />
        </motion.div>
      </div>
    </section>
  );
}

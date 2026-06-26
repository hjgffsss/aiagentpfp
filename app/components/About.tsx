"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-medium uppercase tracking-widest text-agent-cyan">
            About The Project
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            What Is <span className="text-gradient">Crypto Agent?</span>
          </h2>
          <p className="mt-5 text-text-secondary leading-relaxed text-base sm:text-lg">
            Crypto Agent is a collection of 2222 intelligent onchain agents
            designed to reward users for completing meaningful blockchain
            activities. Earn points, unlock opportunities, and build your
            onchain reputation through a gamified AI-powered ecosystem.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {["GM", "WAGMI", "LFG", "Onchain Alpha"].map((tag) => (
              <span
                key={tag}
                className="px-3.5 py-1.5 rounded-full glass text-xs font-medium text-text-secondary"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative"
        >
          <div className="glass-border-gradient glass rounded-xl2 p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-agent-purple/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-agent-blue/20 rounded-full blur-3xl" />
            <div className="relative flex items-center justify-center">
              <Image
                src="/images/logo.png"
                alt="Crypto Agent emblem"
                width={140}
                height={140}
                className="drop-shadow-[0_0_40px_rgba(139,92,246,0.35)]"
              />
            </div>
            <div className="relative mt-8 grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="mono-num text-2xl font-semibold text-gradient">2222</div>
                <div className="text-xs text-text-muted mt-1">Agents</div>
              </div>
              <div>
                <div className="mono-num text-2xl font-semibold text-gradient">100%</div>
                <div className="text-xs text-text-muted mt-1">Community Owned</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

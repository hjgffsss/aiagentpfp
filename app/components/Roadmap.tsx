"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const PHASES = [
  {
    phase: "01",
    title: "Foundation",
    items: ["Launch Website", "Launch Community", "Whitelist Campaign"],
  },
  {
    phase: "02",
    title: "Genesis Mint",
    items: ["Agent Mint", "Point System Launch", "Community Rewards"],
  },
  {
    phase: "03",
    title: "Agent House",
    items: ["Agent House", "Staking", "Locking", "Marketplace"],
  },
  {
    phase: "04",
    title: "Expansion",
    items: ["Governance", "Advanced AI Features", "Ecosystem Expansion"],
  },
];

export default function Roadmap() {
  return (
    <section id="roadmap" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-medium uppercase tracking-widest text-agent-cyan">
            The Path Ahead
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            Roadmap To <span className="text-gradient">Full Autonomy</span>
          </h2>
        </div>

        <div className="relative">
          {/* connecting line */}
          <div className="hidden lg:block absolute top-[42px] left-0 right-0 h-px bg-gradient-to-r from-agent-blue via-agent-purple to-agent-cyan opacity-30" />

          <div className="grid lg:grid-cols-4 gap-6">
            {PHASES.map((p, i) => (
              <motion.div
                key={p.phase}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                <div className="hidden lg:flex w-3.5 h-3.5 rounded-full bg-agent-gradient mb-6 shadow-glow relative z-10" />
                <div className="glass-border-gradient glass rounded-xl2 p-6 h-full">
                  <div className="mono-num text-xs text-agent-cyan/80 mb-2">
                    PHASE {p.phase}
                  </div>
                  <h3 className="font-display font-semibold text-lg text-text-primary mb-4">
                    {p.title}
                  </h3>
                  <ul className="space-y-2.5">
                    {p.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-text-secondary">
                        <Check size={14} className="text-agent-cyan mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

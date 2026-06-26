"use client";

import { motion } from "framer-motion";
import { Bot, Gift, Fingerprint, Users, Star, Lock } from "lucide-react";

const FEATURES = [
  { icon: Bot, title: "AI Agent Powered Missions", desc: "Daily onchain tasks generated and tracked by your personal agent." },
  { icon: Gift, title: "Daily Reward System", desc: "Earn points every day for completing onchain missions." },
  { icon: Fingerprint, title: "Onchain Reputation", desc: "Build a verifiable track record of your ecosystem activity." },
  { icon: Users, title: "Community Driven Growth", desc: "Roadmap and features shaped by active agent holders." },
  { icon: Star, title: "Whitelist Rewards", desc: "Early agents unlock priority access and bonus point multipliers." },
  { icon: Lock, title: "Future Staking Utility", desc: "Lock your agent for boosted rewards once staking goes live." },
];

export default function Features() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-medium uppercase tracking-widest text-agent-cyan">
            Ecosystem Features
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            Built For Active <span className="text-gradient">Onchain Agents</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="glass-border-gradient glass rounded-xl2 p-6 hover:bg-white/[0.05] transition-colors group"
            >
              <div className="w-11 h-11 rounded-xl bg-agent-gradient-soft flex items-center justify-center mb-4 group-hover:shadow-glow transition-shadow">
                <f.icon size={20} className="text-agent-cyan" strokeWidth={1.7} />
              </div>
              <h3 className="font-display font-semibold text-text-primary text-base">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

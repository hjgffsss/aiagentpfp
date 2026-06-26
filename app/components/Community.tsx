"use client";

import { motion } from "framer-motion";
import { Twitter, MessageCircle, Github, FileText } from "lucide-react";

const SOCIALS = [
  { icon: Twitter, label: "X / Twitter", href: "#" },
  { icon: MessageCircle, label: "Discord", href: "#" },
  { icon: Github, label: "GitHub", href: "#" },
  { icon: FileText, label: "Docs", href: "#" },
];

export default function Community({ onJoinWhitelist }: { onJoinWhitelist: () => void }) {
  return (
    <section id="community" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative glass-border-gradient glass rounded-xl2 p-10 sm:p-14 text-center overflow-hidden"
        >
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-agent-gradient opacity-15 rounded-full blur-3xl" />

          <span className="relative text-xs font-medium uppercase tracking-widest text-agent-cyan">
            Join The Movement
          </span>
          <h2 className="relative mt-3 font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            WAGMI. Built By Agents, <span className="text-gradient">For Agents.</span>
          </h2>
          <p className="relative mt-4 text-text-secondary max-w-xl mx-auto">
            Join thousands of future agents securing their spot in the next
            generation of autonomous onchain ecosystems. LFG.
          </p>

          <div className="relative mt-8 flex items-center justify-center gap-3 flex-wrap">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
              >
                <s.icon size={16} />
                {s.label}
              </a>
            ))}
          </div>

          <button
            onClick={onJoinWhitelist}
            className="relative mt-9 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-agent-gradient text-white font-medium shadow-glow hover:opacity-90 transition-opacity"
          >
            Join Whitelist Now
          </button>
        </motion.div>
      </div>
    </section>
  );
}

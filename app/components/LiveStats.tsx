"use client";

import { motion } from "framer-motion";
import { Layers, Coins, Link2, CalendarClock, Ticket, Activity } from "lucide-react";

const STATS = [
  { icon: Layers, title: "Total Supply", value: "2222" },
  { icon: Coins, title: "Mint Price", value: "FREE" },
  { icon: Link2, title: "Chain", value: "Ethereum" },
  { icon: CalendarClock, title: "Mint Date", value: "TBA" },
  { icon: Ticket, title: "Whitelist Spots", value: "Limited" },
  { icon: Activity, title: "Agent Status", value: "Active" },
];

export default function LiveStats() {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="glass-border-gradient glass rounded-xl2 p-4 sm:p-5 text-center hover:bg-white/[0.05] transition-colors"
            >
              <stat.icon size={18} className="mx-auto mb-2.5 text-agent-cyan" strokeWidth={1.6} />
              <div className="mono-num text-lg sm:text-xl font-semibold text-text-primary">
                {stat.value}
              </div>
              <div className="mt-1 text-[11px] sm:text-xs text-text-muted uppercase tracking-wide">
                {stat.title}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const NFT_COUNT = 8;

export default function Collection() {
  return (
    <section id="collection" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-medium uppercase tracking-widest text-agent-cyan">
              Genesis Collection
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold tracking-tight">
              Crypto Agent <span className="text-gradient">Genesis</span>
            </h2>
          </div>
          <div className="flex gap-6 mono-num text-sm">
            <div>
              <div className="text-text-muted text-xs uppercase mb-1">Supply</div>
              <div className="text-text-primary font-semibold">2222</div>
            </div>
            <div>
              <div className="text-text-muted text-xs uppercase mb-1">Mint</div>
              <div className="text-agent-cyan font-semibold">FREE</div>
            </div>
            <div>
              <div className="text-text-muted text-xs uppercase mb-1">Chain</div>
              <div className="text-text-primary font-semibold">Ethereum</div>
            </div>
            <div>
              <div className="text-text-muted text-xs uppercase mb-1">Date</div>
              <div className="text-text-primary font-semibold">TBA</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: NFT_COUNT }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              className="glass-border-gradient glass rounded-xl2 overflow-hidden group"
            >
              <div className="relative aspect-square">
                <Image
                  src={`/images/nft/agent-${String(i + 1).padStart(4, "0")}.png`}
                  alt={`Crypto Agent #${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-sm font-medium text-text-primary">
                  Agent #{String(i + 1).padStart(4, "0")}
                </span>
                <span className="text-[10px] uppercase tracking-wide text-agent-cyan/80 border border-agent-cyan/30 rounded-full px-2 py-0.5">
                  Soon
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <span className="inline-flex items-center px-4 py-2 rounded-full glass text-xs text-text-secondary">
            Full collection reveal — Coming Soon
          </span>
        </div>
      </div>
    </section>
  );
}

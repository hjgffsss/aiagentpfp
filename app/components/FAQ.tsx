"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "What is Crypto Agent?",
    a: "Crypto Agent is a collection of 2222 onchain agents that reward holders for completing daily onchain missions, earning points, and building onchain reputation.",
  },
  {
    q: "How much does it cost to mint?",
    a: "Mint is free. You'll only need to cover the standard Ethereum network gas fee at mint time.",
  },
  {
    q: "How do I get whitelisted?",
    a: "Click \"Join Whitelist,\" connect your wallet to verify ownership, follow our X account, and confirm your repost of the pinned announcement. Our assistant will guide you through each step.",
  },
  {
    q: "What chain is Crypto Agent on?",
    a: "Crypto Agent mints on Ethereum.",
  },
  {
    q: "When does staking and the Agent Marketplace launch?",
    a: "Staking, Locking, the Agent Marketplace, and Governance are all part of Agent House, planned for Phase 3 of our roadmap. Exact dates will be announced to the community first.",
  },
  {
    q: "Will my wallet ever be asked to approve a transaction during whitelist verification?",
    a: "No. Whitelist verification only asks you to sign a plain text message proving wallet ownership. It never requests a token approval or transaction.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-medium uppercase tracking-widest text-agent-cyan">
            Need To Know
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={faq.q} className="glass-border-gradient glass rounded-xl2 overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 text-left"
              >
                <span className="font-medium text-text-primary text-sm sm:text-base">
                  {faq.q}
                </span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-text-muted transition-transform ${
                    open === i ? "rotate-180 text-agent-cyan" : ""
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="px-5 sm:px-6 pb-5 text-sm text-text-secondary leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

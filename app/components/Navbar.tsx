"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, Menu, X, Wallet } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Collection", href: "#collection" },
  { label: "Leaderboard", href: "#leaderboard" },
  { label: "Eligibility Checker", href: "#eligibility" },
  { label: "FAQ", href: "#faq" },
  { label: "Community", href: "#community" },
];

const AGENT_HOUSE_ITEMS = [
  "Staking",
  "Locking",
  "Agent Marketplace",
  "Agent Upgrades",
  "Governance",
];

export default function Navbar({
  onJoinWhitelist,
  onConnectWallet,
  walletAddress,
}: {
  onJoinWhitelist: () => void;
  onConnectWallet: () => void;
  walletAddress: string | null;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [houseOpen, setHouseOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="mt-3 flex items-center justify-between rounded-2xl glass-strong px-4 py-3 lg:px-6">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2.5 shrink-0">
            <Image src="/images/logo.png" alt="Crypto Agent" width={36} height={36} />
            <span className="font-display font-semibold text-lg tracking-tight text-text-primary">
              Crypto Agent
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}

            <div
              className="relative"
              onMouseEnter={() => setHouseOpen(true)}
              onMouseLeave={() => setHouseOpen(false)}
            >
              <button className="flex items-center gap-1 px-3 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-white/5">
                Agent House
                <ChevronDown size={14} className={`transition-transform ${houseOpen ? "rotate-180" : ""}`} />
              </button>
              {houseOpen && (
                <div className="absolute top-full right-0 pt-2 w-56">
                  <div className="glass-strong rounded-xl p-2 shadow-glow">
                    {AGENT_HOUSE_ITEMS.map((item) => (
                      <div
                        key={item}
                        className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:bg-white/5 cursor-not-allowed"
                      >
                        <span>{item}</span>
                        <span className="text-[10px] uppercase tracking-wide text-agent-cyan/80 border border-agent-cyan/30 rounded-full px-2 py-0.5">
                          Soon
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CTAs */}
          <div className="hidden lg:flex items-center gap-2.5">
            <button
              onClick={onJoinWhitelist}
              className="px-4 py-2 text-sm font-medium rounded-xl bg-agent-gradient text-white shadow-glow hover:opacity-90 transition-opacity"
            >
              Join Whitelist
            </button>
            <button
              onClick={onConnectWallet}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-edge text-text-primary hover:bg-white/5 transition-colors"
            >
              <Wallet size={15} />
              {walletAddress
                ? `${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`
                : "Connect Wallet"}
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 text-text-primary"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden mt-2 glass-strong rounded-2xl p-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary rounded-lg hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
            <div className="px-3 py-2 text-xs uppercase tracking-wide text-text-muted">
              Agent House
            </div>
            {AGENT_HOUSE_ITEMS.map((item) => (
              <div
                key={item}
                className="flex items-center justify-between px-3 py-2 text-sm text-text-secondary"
              >
                <span>{item}</span>
                <span className="text-[10px] uppercase tracking-wide text-agent-cyan/80 border border-agent-cyan/30 rounded-full px-2 py-0.5">
                  Soon
                </span>
              </div>
            ))}
            <div className="flex flex-col gap-2 pt-3">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onJoinWhitelist();
                }}
                className="px-4 py-2.5 text-sm font-medium rounded-xl bg-agent-gradient text-white"
              >
                Join Whitelist
              </button>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onConnectWallet();
                }}
                className="px-4 py-2.5 text-sm font-medium rounded-xl border border-edge text-text-primary"
              >
                {walletAddress
                  ? `${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`
                  : "Connect Wallet"}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

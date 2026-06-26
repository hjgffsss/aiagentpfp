"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Loader2, Users } from "lucide-react";
import type { LeaderboardEntry } from "@/lib/types";

const RANK_COLORS: Record<number, string> = {
  1: "text-amber-300",
  2: "text-slate-300",
  3: "text-orange-400",
};

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/leaderboard?limit=20");
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error ?? "Could not load the leaderboard.");
        } else {
          setEntries(data.entries ?? []);
          setConfigured(data.configured !== false);
        }
      } catch {
        if (!cancelled) setError("Network error loading the leaderboard.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    // Refresh periodically so the board stays live without a manual reload.
    const interval = setInterval(load, 30_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <section id="leaderboard" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-medium uppercase tracking-widest text-agent-cyan">
            Top Agents
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            Mission <span className="text-gradient">Leaderboard</span>
          </h2>
          <p className="mt-4 text-text-secondary">
            Live rankings, updated as agents complete missions and earn points.
          </p>
        </div>

        <div className="glass-border-gradient glass rounded-xl2 overflow-hidden">
          {loading && (
            <div className="flex items-center justify-center gap-2 py-16 text-text-muted">
              <Loader2 size={18} className="animate-spin" /> Loading leaderboard…
            </div>
          )}

          {!loading && error && (
            <div className="py-12 text-center text-sm text-red-400 px-6">{error}</div>
          )}

          {!loading && !error && !configured && (
            <div className="py-12 text-center px-6">
              <Users size={28} className="mx-auto text-text-muted mb-3" />
              <p className="text-sm text-text-secondary">
                The leaderboard isn&apos;t connected to a database yet.
              </p>
              <p className="text-xs text-text-muted mt-1">
                Once Firebase is configured, real agent rankings will appear here.
              </p>
            </div>
          )}

          {!loading && !error && configured && entries.length === 0 && (
            <div className="py-12 text-center px-6">
              <Users size={28} className="mx-auto text-text-muted mb-3" />
              <p className="text-sm text-text-secondary">
                No agents have earned points yet.
              </p>
              <p className="text-xs text-text-muted mt-1">
                Be the first — complete whitelist verification to claim the top spot.
              </p>
            </div>
          )}

          {!loading &&
            !error &&
            entries.map((leader, i) => (
              <motion.div
                key={leader.walletAddress}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={`flex items-center justify-between px-5 sm:px-7 py-4 ${
                  i !== entries.length - 1 ? "border-b border-edge" : ""
                } hover:bg-white/[0.03] transition-colors`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-8 text-center mono-num font-semibold ${
                      RANK_COLORS[leader.rank] ?? "text-text-muted"
                    }`}
                  >
                    {leader.rank <= 3 ? (
                      <Trophy size={16} className="inline" />
                    ) : (
                      leader.rank
                    )}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-agent-gradient-soft border border-edge flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-semibold text-agent-cyan">
                      {leader.xUsername.replace("@", "").slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm sm:text-base text-text-primary font-medium">
                    {leader.xUsername}
                  </span>
                </div>
                <span className="mono-num text-sm sm:text-base text-agent-cyan font-semibold">
                  {leader.points.toLocaleString()} pts
                </span>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
}

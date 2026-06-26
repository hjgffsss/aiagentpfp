"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import type { EligibilityResult } from "@/lib/types";

export default function EligibilityChecker() {
  const [mode, setMode] = useState<"address" | "username">("address");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: value.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const roleLabel =
    result?.role === "GTD"
      ? "Guaranteed (GTD)"
      : result?.role === "WL"
      ? "Whitelisted"
      : "Not Eligible";

  return (
    <section id="eligibility" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-medium uppercase tracking-widest text-agent-cyan">
            Verification
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            Check Your <span className="text-gradient">Eligibility</span>
          </h2>
          <p className="mt-4 text-text-secondary">
            Search by wallet address or X username to see your whitelist status.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-border-gradient glass rounded-xl2 p-6 sm:p-8"
        >
          <div className="flex gap-2 mb-5">
            {(["address", "username"] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setResult(null);
                  setError(null);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mode === m
                    ? "bg-agent-gradient text-white"
                    : "text-text-secondary hover:bg-white/5"
                }`}
              >
                {m === "address" ? "EVM Address" : "X Username"}
              </button>
            ))}
          </div>

          <form onSubmit={handleCheck} className="flex gap-3">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={mode === "address" ? "0x..." : "@username"}
              className="flex-1 px-4 py-3 rounded-xl bg-black/30 border border-edge text-text-primary placeholder:text-text-muted focus:border-agent-cyan/50 outline-none mono-num text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3 rounded-xl bg-agent-gradient text-white font-medium flex items-center gap-2 disabled:opacity-60 shrink-0"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              <span className="hidden sm:inline">Check</span>
            </button>
          </form>

          {error && (
            <p className="mt-4 text-sm text-red-400">{error}</p>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-xl border border-edge bg-black/20 p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                {result.role === "NOT_ELIGIBLE" ? (
                  <XCircle size={22} className="text-red-400" />
                ) : (
                  <CheckCircle2 size={22} className="text-agent-cyan" />
                )}
                <span
                  className={`font-display font-semibold text-lg ${
                    result.role === "NOT_ELIGIBLE" ? "text-red-400" : "text-gradient"
                  }`}
                >
                  {roleLabel}
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-text-muted text-xs uppercase mb-1">Wallet Address</div>
                  <div className="mono-num text-text-primary break-all">
                    {result.walletAddress}
                  </div>
                </div>
                <div>
                  <div className="text-text-muted text-xs uppercase mb-1">X Username</div>
                  <div className="mono-num text-text-primary">{result.xUsername}</div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

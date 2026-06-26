"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed.");
        setLoading(false);
        return;
      }
      router.push("/admin/dashboard");
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-void relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="agent-field opacity-40" />

      <div className="relative w-full max-w-sm glass-border-gradient glass rounded-xl2 p-8">
        <div className="flex items-center gap-2.5 mb-8">
          <Image src="/images/logo.png" alt="Crypto Agent" width={32} height={32} />
          <span className="font-display font-semibold text-text-primary">
            Crypto Agent Admin
          </span>
        </div>

        <div className="flex items-center gap-2 text-text-secondary text-sm mb-6">
          <Lock size={14} />
          Restricted access — admin credentials required
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wide mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-edge text-text-primary outline-none focus:border-agent-cyan/50 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wide mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-edge text-text-primary outline-none focus:border-agent-cyan/50 text-sm"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-agent-gradient text-white font-medium disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Sign In
          </button>
        </form>
      </div>
    </main>
  );
}

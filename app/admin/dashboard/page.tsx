"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  LogOut,
  Loader2,
} from "lucide-react";
import type { Application, ApplicationStatus, EligibilityRole } from "@/lib/types";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [notConfigured, setNotConfigured] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    setLoading(true);
    const res = await fetch("/api/admin/applications");
    if (res.status === 401) {
      router.push("/admin");
      return;
    }
    const data = await res.json();
    setApplications(data.applications ?? []);
    setNotConfigured(data.configured === false);
    setLoading(false);
  }

  async function updateApplication(
    id: string,
    update: { status?: ApplicationStatus; role?: EligibilityRole | null }
  ) {
    setBusyId(id);
    await fetch(`/api/admin/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    });
    setApplications((apps) =>
      apps.map((a) => (a.id === id ? { ...a, ...update } : a))
    );
    setBusyId(null);
  }

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin");
  }

  const stats = useMemo(() => {
    return {
      total: applications.length,
      approved: applications.filter((a) => a.status === "approved").length,
      pending: applications.filter((a) => a.status === "pending").length,
      rejected: applications.filter((a) => a.status === "rejected").length,
    };
  }, [applications]);

  const filtered = applications.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.walletAddress.toLowerCase().includes(q) ||
      a.xUsername.toLowerCase().includes(q)
    );
  });

  return (
    <main className="min-h-screen bg-void px-4 sm:px-6 lg:px-8 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <Image src="/images/logo.png" alt="Crypto Agent" width={32} height={32} />
            <span className="font-display font-semibold text-lg text-text-primary">
              Admin Dashboard
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-edge text-sm text-text-secondary hover:bg-white/5"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>

        {notConfigured && (
          <div className="mb-6 px-4 py-3 rounded-xl glass text-xs text-amber-300">
            ⚠ Firebase Admin credentials are not set on the server, so no
            real applications can be loaded or saved yet. Add
            FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and
            FIREBASE_ADMIN_PRIVATE_KEY to your environment and redeploy.
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Users} label="Total Applicants" value={stats.total} />
          <StatCard icon={CheckCircle2} label="Approved" value={stats.approved} accent="text-agent-cyan" />
          <StatCard icon={Clock} label="Pending" value={stats.pending} accent="text-amber-300" />
          <StatCard icon={XCircle} label="Rejected" value={stats.rejected} accent="text-red-400" />
        </div>

        {/* Search */}
        <div className="relative mb-4 max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search wallet or X username…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/30 border border-edge text-text-primary placeholder:text-text-muted outline-none focus:border-agent-cyan/50 text-sm"
          />
        </div>

        {/* Table */}
        <div className="glass-border-gradient glass rounded-xl2 overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-text-muted">
              <Loader2 size={20} className="animate-spin mr-2" /> Loading applications…
            </div>
          ) : (
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="text-left text-text-muted text-xs uppercase tracking-wide border-b border-edge">
                  <th className="px-5 py-3.5"></th>
                  <th className="px-5 py-3.5">Wallet Address</th>
                  <th className="px-5 py-3.5">X Username</th>
                  <th className="px-5 py-3.5">Points</th>
                  <th className="px-5 py-3.5">Repost Link</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Created</th>
                  <th className="px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => (
                  <tr key={app.id} className="border-b border-edge last:border-0 hover:bg-white/[0.02]">
                    <td className="px-5 py-3.5">
                      <div className="w-8 h-8 rounded-full bg-agent-gradient-soft border border-edge flex items-center justify-center">
                        <span className="text-[10px] font-semibold text-agent-cyan">
                          {app.xUsername?.replace("@", "").slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 mono-num text-text-primary">
                      {app.walletAddress.slice(0, 8)}…{app.walletAddress.slice(-6)}
                    </td>
                    <td className="px-5 py-3.5 text-text-primary">{app.xUsername}</td>
                    <td className="px-5 py-3.5 mono-num text-agent-cyan">{app.points ?? 0}</td>
                    <td className="px-5 py-3.5">
                      <a
                        href={app.repostUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-agent-cyan hover:underline"
                      >
                        View
                      </a>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        value={app.role ?? ""}
                        onChange={(e) =>
                          updateApplication(app.id, {
                            role: (e.target.value || null) as EligibilityRole | null,
                          })
                        }
                        disabled={busyId === app.id}
                        className="bg-black/30 border border-edge rounded-lg px-2 py-1 text-xs text-text-primary outline-none"
                      >
                        <option value="">—</option>
                        <option value="GTD">GTD</option>
                        <option value="WL">WL</option>
                      </select>
                    </td>
                    <td className="px-5 py-3.5 text-text-muted text-xs mono-num">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateApplication(app.id, { status: "approved" })}
                          disabled={busyId === app.id}
                          className="px-3 py-1.5 rounded-lg bg-agent-cyan/15 text-agent-cyan text-xs font-medium hover:bg-agent-cyan/25 disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateApplication(app.id, { status: "rejected" })}
                          disabled={busyId === app.id}
                          className="px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 text-xs font-medium hover:bg-red-500/25 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-10 text-center text-text-muted">
                      No applications match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: any;
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div className="glass-border-gradient glass rounded-xl2 p-5">
      <Icon size={18} className={accent ?? "text-text-secondary"} />
      <div className={`mt-3 mono-num text-2xl font-semibold ${accent ?? "text-text-primary"}`}>
        {value}
      </div>
      <div className="mt-1 text-xs text-text-muted uppercase tracking-wide">{label}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
  const map: Record<ApplicationStatus, string> = {
    pending: "bg-amber-300/15 text-amber-300",
    approved: "bg-agent-cyan/15 text-agent-cyan",
    rejected: "bg-red-500/15 text-red-400",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${map[status]}`}>
      {status}
    </span>
  );
}

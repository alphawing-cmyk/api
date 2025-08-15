import { useEffect, useState } from "react";
import { useLoaderData } from "@remix-run/react";
import type { loader as indexLoader } from "~/routes/_index";
import { GitCommitHorizontal, Activity, Rocket } from "lucide-react";

// Sleek, startup-style bottom status bar
// - Glassy cards, soft gradients, subtle motion-ready classes
// - Mobile-first with tight spacing; expands on md+
// - Accessible: live region for commit updates
// Drop in anywhere; keep your existing loader returning `{ _action: 'fetchCommits', ok: true, data: { commits } }`.

export default function BottomStatus({
  name = "Automated Trading Tool",
  status = "In Development",
}: {
  name?: string;
  status?: string;
}) {
  const data = useLoaderData<typeof indexLoader>();
  const [commits, setCommits] = useState<string>("— — — —");

  useEffect(() => {
    if (data && typeof data === "object" && "_action" in data) {
      if (data._action === "fetchCommits" && data.ok) {
        setCommits(String(data.data?.commits ?? "0"));
      }
    }
  }, [data]);

  return (
    <div className="w-full border-t border-white/10 bg-[#0b0b0e]/80 backdrop-blur-md supports-[backdrop-filter]:bg-[#0b0b0e]/60">
      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        <div className="grid grid-cols-1 gap-2 py-2 md:grid-cols-3">
          {/* Commits */}
          <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-2 text-white">
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="absolute -inset-x-16 -top-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>
            <div className="flex items-center justify-center gap-2 text-[11px] sm:text-xs md:text-sm">
              <GitCommitHorizontal className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
              <span aria-live="polite" className="font-mono tabular-nums tracking-tight">
                {commits} <span className="text-white/60">commits</span>
              </span>
            </div>
          </div>

          {/* Development status */}
          <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-2 text-white">
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(255,255,255,0.06),transparent)]" />
            </div>
            <div className="flex items-center justify-center gap-2 text-center text-[11px] sm:text-xs md:text-sm">
              <span className="inline-flex h-2 w-2 translate-y-0.5 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)] animate-pulse" />
              <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-amber-300" />
              <p className="text-white/90 tracking-wide">{status}</p>
            </div>
          </div>

          {/* Product name / description */}
          <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-2 text-white">
            <div className="pointer-events-none absolute -inset-1 rounded-[14px] bg-gradient-to-r from-sky-500/10 via-fuchsia-500/10 to-indigo-500/10 opacity-0 blur transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative z-10 flex items-center justify-center gap-2 text-[11px] sm:text-xs md:text-sm">
              <Rocket className="h-4 w-4 sm:h-5 sm:w-5" />
              <p className="truncate text-white/90">
                <span className="font-medium tracking-wide">{name}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

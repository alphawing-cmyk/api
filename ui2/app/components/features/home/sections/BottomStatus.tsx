import { useEffect, useState } from "react";
import { GitCommitHorizontal } from "lucide-react";
import { useLoaderData } from "@remix-run/react";
import { loader } from "~/routes/_index";

function BottomStatus() {
  const [commits, setCommits] = useState<string>("----");
  const data = useLoaderData<typeof loader>();

  useEffect(() => {
    if ("_action" in data && data?._action === "fetchCommits" && data.ok) {
      setCommits(data.data.commits);
    }
  }, [data]);

  return (
    <div className="w-full text-white font-mono text-xs md:text-sm border-t border-gray-700 bg-[#1a1a1a] grid grid-cols-1 md:grid-cols-3">
      {/* Commits */}
      <div className="flex items-center justify-center gap-2 py-2 bg-[#0f172a] border-b border-gray-700 md:border-b-0 md:border-r">
        <GitCommitHorizontal className="text-green-400" size={16} />
        <span className="text-blue-400 tracking-wide">{commits} commits</span>
      </div>

      {/* Development status */}
      <div className="flex items-center justify-center text-center py-2 bg-[#1e293b] border-b border-gray-700 md:border-b-0 md:border-r">
        <p className="text-gray-300">System is currently in development</p>
      </div>

      {/* Description */}
      <div className="flex items-center justify-center py-2 bg-[#2d2d2d]">
        <p className="text-gray-300">Automated Trading Tool</p>
      </div>
    </div>
  );
}

export default BottomStatus;

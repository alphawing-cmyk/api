import { useEffect, useState } from "react";
import { GitCommitHorizontal } from "lucide-react";
import { useLoaderData } from "@remix-run/react";
import { loader } from "~/routes";

function BottomStatus() {
  const [commits, setCommits] = useState<string>("----");
  const data = useLoaderData<typeof loader>();
  
  useEffect(() => {
    if ("_action" in data && data?._action === "fetchCommits" && data.ok) {
      setCommits(data.data.commits);
    }
  }, [data]);

  return (
    <div className="md:h-[30px] bgTheme-black grid grid-cols-1 md:grid-cols-4 md:border-b-md">
      <div className="w-full bg-tmGolden font-mono flex flex-row justify-center items-center">
          <GitCommitHorizontal className="fs-[1em] text-green-500" />
        <p className="text-blue-500 text-[12px] ml-2">{commits} commits</p>
      </div>
      <div className="text-white font-mono text-[12px] flex flex-col items-center justify-center bg-black col-span-2">
        <p> System is currently in development </p>
      </div>
      <div className="font-mono flex flex-row justify-center items-center text-[12px] text-white bg-[#333533]">
        Automated Trading Tool
      </div>
    </div>
  );
}

export default BottomStatus;

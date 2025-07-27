import type { MetaFunction } from "@remix-run/node";
import Navbar from "~/components/features/home/components/Navbar";

export const meta: MetaFunction = () => {
  return [
    { title: "Alpha Wing" },
    { name: "description", content: "Automated Trading Platform" },
  ];
};

export default function Index() {
  return (<>
    <Navbar />
  </>);
}

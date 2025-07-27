import XIcon from "~/images/home/XIcon";
import DiscordIcon from "~/images/home/DiscordIcon";
import GitlabIcon from "~/images/home/GitlabIcon";
import { useNavigate } from "@remix-run/react";

function Footer() {
  const navigate = useNavigate();

  return (
    <div className="max-w-[1240px] mt-[100px] mx-auto py-16 px-4 grid lg:grid-cols-3 gap-8 text-gray-600 border-t-[1px]">
      <div>
        <h1 className="w-full text-3xl font-bold text-green-500">Alpha Wing</h1>
        <p className="py-4">
          Alpha Wing trading platform is in affiliation with DEV-TOP Tech.
          Development is done by Raj Solanki. Please note, we are not liable for
          any trading losses and all trades are done at your risk and
          discretion.
        </p>
        <div className="flex justify-between md:w-[75%] my-6">
          <DiscordIcon size="2em" className="cursor-pointer" />
          <XIcon size="2em" className="cursor-pointer" />
          <GitlabIcon size="2em" className="cursor-pointer" />
        </div>
      </div>

      <div className="lg:col-span-2 flex justify-between mt-6">
        <div></div>
        <div>
          <h6 className="font-medium text-gray-400">Links</h6>
          <ul>
            <li
              className="py-2 text-sm cursor-pointer"
              onClick={() => {
                navigate("/privacy");
              }}
            >
              Privacy
            </li>
            <li className="py-2 text-sm cursor-pointer">Contact</li>
            <li className="py-2 text-sm cursor-pointer">API</li>
          </ul>
        </div>
        <div className="flex flex-col justify-baseline">
          <p className="font-bold">Version 0.0.1</p>
        </div>
      </div>
    </div>
  );
}

export default Footer;

import { cn } from "~/lib/utils";
import MobileSidebar from "./MobileSidebar";
import UserNav from "../features/dashboard/UserNav";
import AwLogo from "~/images/aw-logo.svg";
import { Button } from "../ui/button";
import { useNavigate, useLocation } from "@remix-run/react";
import { useEffect } from "react";

interface HeaderProps {
  showNavigation: boolean;
}

const HeaderCustom: React.FC<HeaderProps> = ({ showNavigation }) => {
  const location = useLocation();
  const navigate = useNavigate();
  let origin;

  useEffect(()=>{
    origin = window.location.origin;
  },[]);

  return (
    <div
      className="fixed top-0 left-0 right-0 supports-backdrop-blur:bg-background/60
                    border-b bg-background/95 backdrop-blur z-20 bg-white dark:bg-black "
    >
      <nav className="h-14 flex items-center justify-between px-4">
        <div className="hidden lg:block">
          <a
            href={origin}
            target="_blank"
            className="flex flex-row items-center"
          >
            <img src={AwLogo} height={48} width={48} />
            <span className="text-sm text-gray-600 pl-2 font-bold">
              Alpha Wing
            </span>
          </a>
        </div>
        {location.pathname === "/login" ||
        location.pathname === "/register" ||
        location.pathname === "/forgot" ? (
          <div onClick={() => {  navigate("/")  }}>
            <Button>Return Home</Button>
          </div>
        ) : null}

        {showNavigation && (
          <div className={cn("block lg:!hidden")}>
            <MobileSidebar />
          </div>
        )}
        {showNavigation && (
          <div className="flex items-center gap-2">
            <UserNav />
          </div>
        )}
      </nav>
    </div>
  );
};

export default HeaderCustom;
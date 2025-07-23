import { cn } from "~/lib/utils";
import MobileSidebar from "./MobileSidebar";
import UserNav from "./UserNav";
import AwLogo from "~/images/aw-logo.svg";
import { ThemeBtn } from "./ThemeBtn";

const Header = () => {
    return (
        <div className="fixed top-0 left-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20">
            <nav className="h-14 flex items-center justify-between px-4">
                <div className="hidden lg:block">
                    <a
                        href={"https://alpha-wing.co"}
                        target="_blank"
                    >
                        <img src={AwLogo} height={48} width={48} />
                    </a>
                </div>
                <div className={cn("block lg:!hidden")}>
                    <MobileSidebar />
                </div>

                <div className="flex items-center gap-2">
                    <ThemeBtn />
                    <UserNav />
                </div>
            </nav>
        </div>
    )
}

export default Header;
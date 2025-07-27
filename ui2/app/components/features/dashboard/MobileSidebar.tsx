import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "~/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { NavItem, navitems } from "~/lib/navitems";
import { useLocation, useNavigate } from "@remix-run/react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";


const MobileSidebar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <VisuallyHidden>
          <SheetTitle>Sidebar</SheetTitle>
          <SheetDescription>
            N/A
          </SheetDescription>
        </VisuallyHidden>
        <SheetTrigger asChild>
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="left" className="!px-0">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Menu Options
              </h2>
              <div className="space-y-1">
                {navitems.map((item: NavItem) => (
                  <span
                    key={item.id}
                    onClick={() => { navigate(item.href); }}
                    className={cn(
                      "group flex items-center cursor-pointer rounded-md px-3 py-2 text-sm font-[28px] hover:bg-accent hover:text-accent-foreground",
                      location.pathname === item.href
                        ? "bg-accent"
                        : "transparent",
                      item.disabled && "cursor-not-allowed opacity-80"
                    )}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileSidebar;

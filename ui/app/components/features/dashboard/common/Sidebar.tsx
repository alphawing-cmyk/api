import { cn } from "~/lib/utils";
import { navitems } from "~/lib/navitems";
import { useNavigate } from "@remix-run/react";
import { useLocation } from "@remix-run/react";
import { Badge } from "~/components/ui/badge";
import { UserLevel } from "~/lib/navitems";

const getBadgeVariant = (
  level: UserLevel
): "default" | "secondary" | "destructive" => {
  switch (level) {
    case "demo":
      return "secondary";
    case "client":
      return "default";
    case "admin":
      return "destructive";
    case "service":
      return "destructive";
    default:
      return "default";
  }
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav
      className={cn(`relative hidden h-screen border-r pt-16 lg:block w-72`)}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">
              Overview
            </h2>
            {navitems.map((item) => (
              <span
                key={item.id}
                onClick={() => navigate(item.href)}
                className={cn(
                  "grid cursor-pointer rounded-md px-3 py-2 text-sm font-[28px] hover:bg-accent hover:text-accent-foreground",
                  "grid-cols-[auto_1fr_auto] items-center gap-2", // grid layout with icon, title, and badge
                  location.pathname === item.href ? "bg-accent" : "transparent",
                  item.disabled && "cursor-not-allowed opacity-80"
                )}
              >
                {item.icon}
                <span>{item.title}</span>
                {item.userLevel && (
                  <Badge
                    variant={getBadgeVariant(item.userLevel)}
                    className="text-[11px] capitalize p-1"
                  >
                    {item.userLevel}
                  </Badge>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;


import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./button";
import { ScrollText, BarChart3, Network, BookOpenText, Layers, LayoutDashboard, Search, FileText } from "lucide-react";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    icon?: React.ReactNode;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const location = useLocation();

  return (
    <nav
      className={cn(
        "flex space-y-2 lg:flex-col flex-row lg:space-x-0 space-x-2",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Button
          key={item.href}
          variant={location.pathname === item.href ? "default" : "ghost"}
          className={cn(
            "justify-start w-full transition-all",
            location.pathname === item.href
              ? "bg-justice-primary text-white hover:bg-justice-secondary"
              : "hover:bg-justice-light/10"
          )}
          asChild
        >
          <Link to={item.href}>
            {item.icon}
            <span className="ml-2">{item.title}</span>
          </Link>
        </Button>
      ))}
    </nav>
  );
}

export const mainNavItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    title: "Precedent Explorer",
    href: "/precedent",
    icon: <Network className="w-5 h-5" />,
  },
  {
    title: "Scroll Memory",
    href: "/scroll-memory",
    icon: <ScrollText className="w-5 h-5" />,
  },
  {
    title: "Principle Evolution",
    href: "/principles",
    icon: <Layers className="w-5 h-5" />,
  },
  {
    title: "Case Search",
    href: "/search",
    icon: <Search className="w-5 h-5" />,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    title: "Documentation",
    href: "/docs",
    icon: <BookOpenText className="w-5 h-5" />,
  },
  {
    title: "Legal Systems",
    href: "/legal-systems",
    icon: <FileText className="w-5 h-5" />,
  },
];

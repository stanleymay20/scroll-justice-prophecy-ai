
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./button";
import { 
  ScrollText, 
  BarChart2, 
  Network, 
  BookOpenText, 
  Layers, 
  LayoutDashboard, 
  Search, 
  FileText, 
  Gavel,
  Files,
  Upload,
  Scale,
  Play,
  Brain
} from "lucide-react";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    icon?: React.ReactNode;
    badge?: string;
    highlight?: boolean;
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
            "justify-start w-full transition-all relative group",
            location.pathname === item.href
              ? "bg-justice-primary text-white hover:bg-justice-secondary"
              : "hover:bg-justice-light/10"
          )}
          asChild
        >
          <Link to={item.href}>
            {item.icon}
            <span className="ml-2">{item.title}</span>
            {item.badge && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-justice-secondary px-1.5 py-0.5 rounded-full text-[10px]">
                {item.badge}
              </span>
            )}
            {item.highlight && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-scroll-rise animate-pulse-glow"></span>
            )}
            <span className="absolute inset-y-0 left-0 w-1 bg-justice-light scale-y-0 origin-bottom transition-transform duration-150 group-hover:scale-y-100"></span>
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
    title: "Case Classification",
    href: "/case-classification",
    icon: <Gavel className="w-5 h-5" />,
    highlight: true,
  },
  {
    title: "Trial Simulation",
    href: "/simulation-trial",
    icon: <Play className="w-5 h-5" />,
    badge: "New",
  },
  {
    title: "AI Training",
    href: "/ai-training",
    icon: <Brain className="w-5 h-5" />,
    badge: "New",
    highlight: true,
  },
  {
    title: "Document Upload",
    href: "/document-upload",
    icon: <Upload className="w-5 h-5" />,
    badge: "New",
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
    icon: <BarChart2 className="w-5 h-5" />,
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
  {
    title: "File Manager",
    href: "/file-manager",
    icon: <Files className="w-5 h-5" />,
    badge: "New",
  },
];


import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/language";

interface NavLink {
  name: string;
  href: string;
}

interface NavLinksProps {
  className?: string;
  onClick?: () => void;
}

export const NavLinks = ({ className, onClick }: NavLinksProps) => {
  const { t } = useLanguage();
  
  const navLinks: NavLink[] = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.precedent"), href: "/precedent" },
    { name: t("nav.community"), href: "/community" },
    { name: t("court.simulation"), href: "/simulation-trial" },
  ];

  return (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          className={`px-3 py-2 rounded-md text-sm font-medium text-justice-light hover:text-white hover:bg-justice-primary/20 transition ${className || ""}`}
          onClick={onClick}
        >
          {link.name}
        </Link>
      ))}
    </>
  );
};

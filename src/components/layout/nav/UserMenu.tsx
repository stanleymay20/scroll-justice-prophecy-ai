
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, ScrollText, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/language";

// Admin user IDs with access to developer dashboard
const ADMIN_USER_IDS = ['f7d71f55-ae04-491e-87d0-df4a10e1f669'];

export const UserMenu = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isAdmin = user && ADMIN_USER_IDS.includes(user.id);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (!user) {
    return (
      <Button variant="default" size="sm" onClick={() => navigate("/signin")}>
        {t("nav.signin")}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="ml-2">
          <User className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline-block">
            {user.email?.split("@")[0]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-justice-dark border-justice-light/20">
        <DropdownMenuLabel>{t("nav.profile")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate("/profile")}>
            <User className="mr-2 h-4 w-4" />
            <span>{t("nav.profile")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/subscription/manage")}>
            <ScrollText className="mr-2 h-4 w-4" />
            <span>{t("subscription.manage")}</span>
          </DropdownMenuItem>
          
          {isAdmin && (
            <DropdownMenuItem onClick={() => navigate("/admin/dashboard")}>
              <Shield className="mr-2 h-4 w-4" />
              <span>{t("dashboard.masterControlPanel")}</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t("nav.signout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

import { LogOut, Settings as SettingsIcon, User as UserIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { InitialsAvatar } from "@/components/InitialsAvatar";

/**
 * Componente 1 — botão de perfil que abre menu com Logout.
 */
export function UserMenu() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("header.profile")}
        className="group inline-flex items-center gap-2 rounded-full p-0.5 outline-none transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/60"
      >
        <InitialsAvatar initials={user.initials} size="md" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-2">
        <div className="flex items-center gap-3 rounded-md p-2">
          <InitialsAvatar initials={user.initials} size="lg" />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-foreground">
              {user.displayName}
            </div>
            <div className="truncate text-xs text-muted-foreground">{user.email}</div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">
          {t("header.signedInAs")}
        </DropdownMenuLabel>
        <DropdownMenuItem className="gap-2">
          <UserIcon className="h-4 w-4" /> {t("header.profile")}
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <SettingsIcon className="h-4 w-4" /> {t("header.settings")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={logout}
          className="gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <LogOut className="h-4 w-4" /> {t("header.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ChevronRight, Folder, Inbox, Send, Star, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDroppable } from "@dnd-kit/core";
import { fetchMenus } from "@/lib/api";
import type { Menu, SubMenu } from "@/types/api";
import { cn } from "@/lib/utils";

interface Props {
  selectedSubMenuId: number | null;
  onSelect: (sub: SubMenu, parent: Menu) => void;
}

function pickIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("entrada") || lower.includes("inbox")) return Inbox;
  if (lower.includes("saída") || lower.includes("sent") || lower.includes("send")) return Send;
  if (lower.includes("vip") || lower.includes("star")) return Star;
  if (lower.includes("lixo") || lower.includes("trash")) return Trash2;
  return Folder;
}

function DroppableSubMenu({
  sub,
  parent,
  active,
  onSelect,
}: {
  sub: SubMenu;
  parent: Menu;
  active: boolean;
  onSelect: Props["onSelect"];
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: `sub-${sub.id}`,
    data: { subMenuId: sub.id, parentId: parent.id },
  });
  const Icon = pickIcon(sub.name);

  return (
    <button
      ref={setNodeRef}
      type="button"
      onClick={() => onSelect(sub, parent)}
      aria-current={active ? "true" : undefined}
      className={cn(
        "group relative flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-sm transition",
        "hover:bg-sidebar-accent/60",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
          : "text-sidebar-foreground",
        isOver && "ring-2 ring-primary ring-offset-1 ring-offset-sidebar bg-sidebar-accent",
      )}
    >
      {active && (
        <motion.span
          layoutId="active-pill"
          className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary"
        />
      )}
      <Icon className="h-3.5 w-3.5 shrink-0 opacity-70" />
      <span className="truncate">{sub.name}</span>
    </button>
  );
}

function MenuGroup({
  menu,
  selectedSubMenuId,
  onSelect,
}: {
  menu: Menu;
  selectedSubMenuId: number | null;
  onSelect: Props["onSelect"];
}) {
  const hasActive = menu.subMenus.some((s) => s.id === selectedSubMenuId);
  const [open, setOpen] = useState<boolean>(hasActive || true);

  return (
    <div className="mb-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground transition hover:text-foreground"
        aria-expanded={open}
      >
        <ChevronRight
          className={cn("h-3 w-3 transition-transform", open && "rotate-90")}
        />
        <span className="truncate">{menu.name}</span>
        <span className="ml-auto text-[10px] font-normal text-muted-foreground/70">
          {menu.subMenus.length}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="ml-2 overflow-hidden border-l border-sidebar-border pl-2"
          >
            <div className="space-y-0.5 py-1">
              {menu.subMenus.map((sub) => (
                <DroppableSubMenu
                  key={sub.id}
                  sub={sub}
                  parent={menu}
                  active={selectedSubMenuId === sub.id}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Componente 2 — árvore de menus carregada da API.
 */
export function MenuTree({ selectedSubMenuId, onSelect }: Props) {
  const { t } = useTranslation();
  const { data, isLoading, error } = useQuery({
    queryKey: ["menus"],
    queryFn: fetchMenus,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <aside
      className="flex h-full w-full flex-col bg-sidebar text-sidebar-foreground"
      aria-label={t("sidebar.accounts")}
    >
      <div className="flex items-center gap-2 border-b border-sidebar-border px-4 py-3">
        <Folder className="h-4 w-4 text-sidebar-primary" />
        <h2 className="text-sm font-semibold">{t("sidebar.accounts")}</h2>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {isLoading && (
          <div className="space-y-2 p-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-1">
                <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                <div className="h-6 w-full animate-pulse rounded bg-muted/60" />
                <div className="h-6 w-4/5 animate-pulse rounded bg-muted/60" />
              </div>
            ))}
          </div>
        )}
        {error && (
          <div className="p-3 text-xs text-destructive">{(error as Error).message}</div>
        )}
        {data?.length === 0 && (
          <div className="p-3 text-xs text-muted-foreground">{t("sidebar.empty")}</div>
        )}
        {data?.map((menu) => (
          <MenuGroup
            key={menu.id}
            menu={menu}
            selectedSubMenuId={selectedSubMenuId}
            onSelect={onSelect}
          />
        ))}
      </nav>
    </aside>
  );
}

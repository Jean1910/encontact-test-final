import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { Mail, Menu as MenuIcon, Search, X } from "lucide-react";
import type { Item, Menu, SubMenu } from "@/types/api";
import { MenuTree } from "@/components/main/MenuTree";
import { ItemsList } from "@/components/main/ItemsList";
import { UserMenu } from "@/components/main/UserMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MainPage() {
  const { t } = useTranslation();

  const [selectedSub, setSelectedSub] = useState<SubMenu | null>(null);
  const [parentMenu, setParentMenu] = useState<Menu | null>(null);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Items moved into a given subMenu via drag-and-drop
  const [movedInBySub, setMovedInBySub] = useState<Record<number, Item[]>>({});
  // Globally archived ids
  const [archivedIds, setArchivedIds] = useState<Set<number>>(new Set());
  // Toast for archived count
  const [toast, setToast] = useState<string | null>(null);

  // Currently visible items (registered by ItemsList) — used to resolve drag source
  const currentItemsRef = useRef<Item[]>([]);
  const registerCurrentItems = useCallback((items: Item[]) => {
    currentItemsRef.current = items;
  }, []);

  // Search input ref for shortcut
  const searchRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if (e.key === "/" && !isTyping) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === searchRef.current) {
        setSearch("");
        searchRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleSelectSub = (sub: SubMenu, parent: Menu) => {
    setSelectedSub(sub);
    setParentMenu(parent);
    setSidebarOpen(false);
  };

  const handleAfterArchive = (ids: number[]) => {
    setArchivedIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      return next;
    });
    setToast(t("list.archived", { count: ids.length }));
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(id);
  }, [toast]);

  // DnD sensors — only start drag after small movement to keep clicks usable
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const itemId = active.data.current?.itemId as number | undefined;
    const targetSubId = over.data.current?.subMenuId as number | undefined;
    if (typeof itemId !== "number" || typeof targetSubId !== "number") return;
    if (selectedSub && targetSubId === selectedSub.id) return; // dropped on same folder

    const item = currentItemsRef.current.find((i) => i.id === itemId);
    if (!item) return;

    // Move: archive from current view + add to destination subMenu's "movedIn" bucket
    setArchivedIds((prev) => {
      const next = new Set(prev);
      next.add(itemId);
      return next;
    });
    setMovedInBySub((prev) => {
      const list = prev[targetSubId] ?? [];
      // Avoid duplicates
      if (list.some((i) => i.id === itemId)) return prev;
      return { ...prev, [targetSubId]: [{ ...item }, ...list] };
    });
    setToast("✓");
  };

  const headerTitle = useMemo(() => t("app.name"), [t]);

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex h-screen w-full flex-col overflow-hidden bg-background">
        {/* Top header */}
        <header
          className="relative z-30 flex h-14 shrink-0 items-center gap-2 bg-header px-3 text-header-foreground shadow-header sm:px-4"
          role="banner"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen((o) => !o)}
            className="text-header-foreground hover:bg-white/10 hover:text-header-foreground lg:hidden"
            aria-label="Toggle sidebar"
          >
            <MenuIcon className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-white/15">
              <Mail className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold tracking-tight">{headerTitle}</span>
          </div>

          {/* Search */}
          <div className="ml-2 hidden flex-1 max-w-xl md:block">
            <label htmlFor="global-search" className="sr-only">
              {t("header.search")}
            </label>
            <div className="group relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-header-foreground/70" />
              <input
                ref={searchRef}
                id="global-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("header.searchPlaceholder")}
                className="h-9 w-full rounded-md border border-white/10 bg-white/10 pl-9 pr-9 text-sm text-header-foreground placeholder:text-header-foreground/60 outline-none transition focus:border-white/30 focus:bg-white/15 focus:ring-2 focus:ring-white/30"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-header-foreground/70 hover:bg-white/10"
                  aria-label="Clear"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="ml-auto flex items-center gap-1">
            <LanguageSwitcher />
            <ThemeToggle />
            <UserMenu />
          </div>
        </header>

        {/* Mobile search */}
        <div className="border-b border-border bg-background px-3 py-2 md:hidden">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("header.searchPlaceholder")}
              className="h-9 w-full rounded-md border border-input bg-card pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Body */}
        <div className="flex min-h-0 flex-1">
          {/* Sidebar */}
          <div
            className={cn(
              "fixed inset-y-0 left-0 z-20 w-72 transform border-r border-sidebar-border transition-transform lg:static lg:translate-x-0",
              sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
            )}
            style={{ top: "56px" }}
          >
            <MenuTree
              selectedSubMenuId={selectedSub?.id ?? null}
              onSelect={handleSelectSub}
            />
          </div>

          {/* Backdrop on mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-10 bg-foreground/30 backdrop-blur-[1px] lg:hidden"
              style={{ top: "56px" }}
              onClick={() => setSidebarOpen(false)}
              aria-hidden
            />
          )}

          {/* Main */}
          <main className="min-w-0 flex-1">
            <ItemsList
              selectedSub={selectedSub}
              parentMenu={parentMenu}
              search={search}
              movedInBySub={movedInBySub}
              archivedIds={archivedIds}
              onAfterArchive={handleAfterArchive}
              registerCurrentItems={registerCurrentItems}
            />
          </main>
        </div>

        {/* Toast */}
        {toast && (
          <div
            role="status"
            className="pointer-events-none fixed bottom-6 left-1/2 z-40 -translate-x-1/2 animate-fade-in rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background shadow-popover"
          >
            {toast}
          </div>
        )}
      </div>
    </DndContext>
  );
}

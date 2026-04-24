import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import { Inbox } from "lucide-react";
import { fetchItemsForSubMenu } from "@/lib/api";
import type { Item, Menu, SubMenu } from "@/types/api";
import { ItemsToolbar } from "./ItemsToolbar";
import { ItemCard } from "./ItemCard";

interface Props {
  selectedSub: SubMenu | null;
  parentMenu: Menu | null;
  search: string;
  // For DnD: keyed by sub-menu id we map to additional moved items
  movedInBySub: Record<number, Item[]>;
  archivedIds: Set<number>;
  onAfterArchive: (ids: number[]) => void;
  onMoveItem?: (item: Item, fromSubId: number, toSubId: number) => void;
  registerCurrentItems: (items: Item[]) => void;
}

const PRELOAD_DATES = ["09:42", "10:24", "11:08", "13:50", "15:22", "16:44"];

/**
 * Componente 4 — lista de itens. Suporta seleção, busca, ler/não ler, estrela.
 */
export function ItemsList({
  selectedSub,
  parentMenu,
  search,
  movedInBySub,
  archivedIds,
  onAfterArchive,
  registerCurrentItems,
}: Props) {
  const { t } = useTranslation();
  const subId = selectedSub?.id ?? null;

  const { data, isLoading, error } = useQuery({
    queryKey: ["items", subId],
    queryFn: () => (subId ? fetchItemsForSubMenu(subId) : Promise.resolve([])),
    enabled: subId !== null,
    staleTime: 60_000,
  });

  // Local UI state
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [unread, setUnread] = useState<Set<number>>(new Set());
  const [starred, setStarred] = useState<Set<number>>(new Set());

  // Reset selection on sub change
  useEffect(() => {
    setSelected(new Set());
  }, [subId]);

  // Compose: API items + items moved in - archived, then enrich + filter by search
  const items = useMemo<Item[]>(() => {
    const base = (data ?? []).map((it, idx) => ({
      ...it,
      date: it.date ?? PRELOAD_DATES[idx % PRELOAD_DATES.length],
      preview:
        it.preview ??
        "Mensagem com conteúdo completo aparece aqui — clique para abrir e responder.",
    }));
    const moved = subId !== null ? movedInBySub[subId] ?? [] : [];
    const all = [...moved, ...base].filter((it) => !archivedIds.has(it.id));
    if (!search.trim()) return all;
    const q = search.toLowerCase();
    return all.filter(
      (it) =>
        it.name.toLowerCase().includes(q) ||
        it.subject.toLowerCase().includes(q) ||
        it.owner.toLowerCase().includes(q),
    );
  }, [data, movedInBySub, subId, archivedIds, search]);

  // Mark first half as unread by default once we get items
  useEffect(() => {
    if (!data) return;
    setUnread((prev) => {
      const next = new Set(prev);
      data.forEach((it, i) => {
        if (i % 2 === 0) next.add(it.id);
      });
      return next;
    });
  }, [data]);

  // Register items list for DnD parent
  useEffect(() => {
    registerCurrentItems(items);
  }, [items, registerCurrentItems]);

  const toggleSelect = (id: number, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleArchive = () => {
    if (selected.size === 0) return;
    const ids = Array.from(selected);
    onAfterArchive(ids);
    setSelected(new Set());
  };

  const handleMarkRead = () => {
    setUnread((prev) => {
      const next = new Set(prev);
      selected.forEach((id) => {
        if (next.has(id)) next.delete(id);
        else next.add(id);
      });
      return next;
    });
  };

  const handleStar = () => {
    setStarred((prev) => {
      const next = new Set(prev);
      selected.forEach((id) => {
        if (next.has(id)) next.delete(id);
        else next.add(id);
      });
      return next;
    });
  };

  const toggleStar = (id: number) =>
    setStarred((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleRead = (id: number) =>
    setUnread((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const selectAll = () => setSelected(new Set(items.map((i) => i.id)));
  const clear = () => setSelected(new Set());

  const title = selectedSub?.name ?? t("list.empty");
  const subtitle = parentMenu ? parentMenu.name : undefined;

  return (
    <section className="flex h-full flex-col bg-background">
      <ItemsToolbar
        total={items.length}
        selectedCount={selected.size}
        onArchive={handleArchive}
        onMarkRead={handleMarkRead}
        onStar={handleStar}
        onSelectAll={selectAll}
        onClear={clear}
        title={title}
        subtitle={subtitle}
      />

      <div className="flex-1 overflow-y-auto" role="list">
        {isLoading && (
          <div className="space-y-px">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3 border-b border-border px-4 py-3 sm:px-6">
                <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-muted/70" />
                  <div className="h-2 w-1/2 animate-pulse rounded bg-muted/50" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="p-6 text-sm text-destructive">{(error as Error).message}</div>
        )}

        {!isLoading && !error && items.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent">
              <Inbox className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              {t("list.empty")}
            </h3>
            <p className="max-w-xs text-sm text-muted-foreground">
              {t("list.emptyHint")}
            </p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              selected={selected.has(item.id)}
              unread={unread.has(item.id)}
              starred={starred.has(item.id)}
              anySelected={selected.size > 0}
              onToggleSelect={toggleSelect}
              onToggleStar={toggleStar}
              onToggleRead={toggleRead}
            />
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}

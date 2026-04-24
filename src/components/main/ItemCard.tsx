import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useDraggable } from "@dnd-kit/core";
import { Star, Paperclip, MailOpen } from "lucide-react";
import type { Item } from "@/types/api";
import { InitialsAvatar } from "@/components/InitialsAvatar";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface Props {
  item: Item;
  selected: boolean;
  unread: boolean;
  starred: boolean;
  anySelected: boolean;
  onToggleSelect: (id: number, checked: boolean) => void;
  onToggleStar: (id: number) => void;
  onToggleRead: (id: number) => void;
}

export function ItemCard({
  item,
  selected,
  unread,
  starred,
  anySelected,
  onToggleSelect,
  onToggleStar,
  onToggleRead,
}: Props) {
  const { t } = useTranslation();

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `item-${item.id}`,
    data: { itemId: item.id },
  });

  // Always render checkbox space when selection mode is active OR when this row is selected
  const showCheckboxAlways = selected || anySelected;

  return (
    <motion.article
      ref={setNodeRef}
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: isDragging ? 0.4 : 1, y: 0 }}
      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative flex cursor-grab items-start gap-3 border-b border-border px-4 py-3 outline-none transition-colors sm:px-6",
        "hover:bg-accent/40 focus-within:bg-accent/40",
        selected && "bg-accent/60 hover:bg-accent/70",
        unread && !selected && "bg-primary/[0.04]",
        isDragging && "z-20 cursor-grabbing shadow-popover",
      )}
      aria-selected={selected}
    >
      {/* Unread indicator */}
      {unread && (
        <span
          aria-label={t("list.unread")}
          className="absolute left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary sm:left-2"
        />
      )}

      {/* Owner avatar / Checkbox swap on hover or selection */}
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-opacity",
            showCheckboxAlways
              ? "opacity-0 group-hover:opacity-0"
              : "opacity-100 group-hover:opacity-0",
          )}
          aria-hidden={showCheckboxAlways}
        >
          <InitialsAvatar
            initials={item.owner}
            size="lg"
            title={t("a11y.userInitials", { initials: item.owner })}
          />
        </div>
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-opacity",
            showCheckboxAlways
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100 focus-within:opacity-100",
          )}
        >
          <Checkbox
            checked={selected}
            onCheckedChange={(c) => onToggleSelect(item.id, !!c)}
            aria-label={t("a11y.selectItem", { name: item.name })}
            className="h-5 w-5"
            // Stop drag on checkbox click
            onPointerDown={(e) => e.stopPropagation()}
          />
        </div>
      </div>

      {/* Content area — also the drag handle */}
      <div
        {...listeners}
        {...attributes}
        className="min-w-0 flex-1 select-none"
      >
        <div className="flex items-center gap-2">
          <h3
            className={cn(
              "truncate text-sm",
              unread ? "font-semibold text-foreground" : "font-medium text-foreground/90",
            )}
          >
            {item.name}
          </h3>
          <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">
            {item.date ?? "10:24"}
          </span>
        </div>
        <p
          className={cn(
            "mt-0.5 truncate text-sm",
            unread ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {item.subject}
        </p>
        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground/80">
          {item.preview ??
            "Mensagem com conteúdo completo aparece aqui — clique para abrir e responder."}
        </p>

        {/* Footer: users + meta */}
        <div className="mt-2 flex items-center gap-2">
          <div className="flex -space-x-1.5">
            {item.users.slice(0, 3).map((u, i) => (
              <InitialsAvatar
                key={`${u}-${i}`}
                initials={u}
                size="xs"
                title={t("a11y.userInitials", { initials: u })}
              />
            ))}
          </div>
          <Paperclip className="h-3 w-3 text-muted-foreground/70" />
          <span className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleRead(item.id);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="rounded p-1 text-muted-foreground opacity-0 transition hover:bg-accent hover:text-foreground group-hover:opacity-100"
              aria-label={t("a11y.toggleRead")}
            >
              <MailOpen className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(item.id);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className={cn(
                "rounded p-1 transition",
                starred
                  ? "text-warning opacity-100"
                  : "text-muted-foreground opacity-0 hover:bg-accent hover:text-foreground group-hover:opacity-100",
              )}
              aria-label={t("a11y.toggleStar")}
              aria-pressed={starred}
            >
              <Star
                className="h-3.5 w-3.5"
                fill={starred ? "currentColor" : "none"}
              />
            </button>
          </span>
        </div>
      </div>
    </motion.article>
  );
}

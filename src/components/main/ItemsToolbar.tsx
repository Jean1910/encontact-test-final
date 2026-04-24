import { Archive, CheckSquare, MailOpen, Square, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Props {
  total: number;
  selectedCount: number;
  onArchive: () => void;
  onMarkRead: () => void;
  onStar: () => void;
  onSelectAll: () => void;
  onClear: () => void;
  title: string;
  subtitle?: string;
}

/**
 * Componente 3 — barra de ações (arquivar, marcar como lida, etc).
 */
export function ItemsToolbar({
  total,
  selectedCount,
  onArchive,
  onMarkRead,
  onStar,
  onSelectAll,
  onClear,
  title,
  subtitle,
}: Props) {
  const { t } = useTranslation();
  const hasSelection = selectedCount > 0;
  const allSelected = selectedCount === total && total > 0;

  return (
    <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex flex-col gap-1 px-4 pt-3 sm:px-6">
        <h1 className="truncate text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1 px-3 py-2 sm:px-5">
        <Button
          variant="ghost"
          size="sm"
          onClick={allSelected ? onClear : onSelectAll}
          aria-label={allSelected ? t("toolbar.clear") : t("toolbar.selectAll")}
          className="gap-1.5"
        >
          {allSelected ? (
            <CheckSquare className="h-4 w-4 text-primary" />
          ) : (
            <Square className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">
            {allSelected ? t("toolbar.clear") : t("toolbar.selectAll")}
          </span>
        </Button>

        <div className="mx-1 hidden h-5 w-px bg-border sm:block" />

        <AnimatePresence initial={false}>
          {hasSelection && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="flex items-center gap-1"
            >
              <Button
                size="sm"
                onClick={onArchive}
                className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary-hover"
              >
                <Archive className="h-4 w-4" />
                <span>{t("toolbar.archiveSelected", { count: selectedCount })}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={onMarkRead} className="gap-1.5">
                <MailOpen className="h-4 w-4" />
                <span className="hidden md:inline">{t("toolbar.markRead")}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={onStar} className="gap-1.5">
                <Star className="h-4 w-4" />
                <span className="hidden md:inline">{t("toolbar.star")}</span>
              </Button>
            </motion.div>
          )}
          {!hasSelection && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button
                size="sm"
                onClick={onArchive}
                disabled
                className="gap-1.5"
                variant="ghost"
              >
                <Archive className="h-4 w-4" />
                <span>{t("toolbar.archive")}</span>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <span className="ml-auto text-xs text-muted-foreground">
          {t("list.results", { count: total })}
        </span>
      </div>
    </div>
  );
}

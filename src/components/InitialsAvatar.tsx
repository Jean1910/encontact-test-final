import { cn } from "@/lib/utils";
import { avatarColor } from "@/lib/avatar";

interface InitialsAvatarProps {
  initials: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  title?: string;
}

const sizeClasses: Record<NonNullable<InitialsAvatarProps["size"]>, string> = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-7 w-7 text-[11px]",
  md: "h-9 w-9 text-xs",
  lg: "h-10 w-10 text-sm",
};

export function InitialsAvatar({
  initials,
  size = "md",
  className,
  title,
}: InitialsAvatarProps) {
  const bg = avatarColor(initials);
  return (
    <span
      className={cn(
        "inline-flex select-none items-center justify-center rounded-full font-semibold uppercase tracking-wide text-white ring-2 ring-card",
        sizeClasses[size],
        className,
      )}
      style={{ backgroundColor: bg }}
      title={title ?? initials}
      aria-label={title ?? `Avatar ${initials}`}
    >
      {initials.slice(0, 2)}
    </span>
  );
}

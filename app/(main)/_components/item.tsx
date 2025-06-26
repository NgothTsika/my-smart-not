"use client";

import { cn } from "@/lib/utils";
import {
  LucideIcon,
  ChevronDown,
  ChevronRight,
  ChevronsDown,
} from "lucide-react";

interface ItemProps {
  id?: string;
  documentIcon?: boolean;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
  onExpand?: () => void;
  label: string;
  onClick: () => void;
  icon: LucideIcon;
}

const Item = ({
  id,
  documentIcon,
  active,
  expanded,
  isSearch,
  level = 0,
  onExpand,
  label,
  onClick,
  icon: Icon,
}: ItemProps) => {
  const ChevronIcon = expanded ? ChevronsDown : ChevronRight;
  return (
    <div
      onClick={onClick}
      role="button"
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
      className={cn(
        "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium ",
        active && "bg-primary/5 text-primary"
      )}
    >
      {!!id && (
        <div
          role="button"
          className=" h-full rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 mr-1"
          onClick={() => {}}
        >
          <ChevronIcon className="h-4 w-4 mr-2 shrink-0 text-muted-foreground/50" />
        </div>
      )}
      {documentIcon ? (
        <div className=" shrink-0 mr-2 text-[18px]">{documentIcon}</div>
      ) : (
        <Icon className="h-[18px] mr-2 shrink-0 text-muted-foreground " />
      )}
      <span className="truncate">{label}</span>
      {isSearch && (
        <kbd className="ml-auto pointer-events-none items-center bg-muted select-none h-5 inline-flex border text-xs gap-1 rounded px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs text-muted-foreground ml-1">CDN</span>K
        </kbd>
      )}
    </div>
  );
};

export default Item;

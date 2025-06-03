import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/Button";
import {
  BreadcrumbTrail,
  type BreadcrumbItem,
} from "@/components/ui/BreadcrumbTrail";

import type { ReactNode } from "react";

export interface HeaderAction {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  variant?: React.ComponentProps<typeof Button>["variant"];
}

interface DetailHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  actions?: HeaderAction[];
  className?: string;
}

export function DetailHeader({
  breadcrumbs,
  actions = [],
  className,
}: DetailHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-6 py-4 bg-white",
        className
      )}
    >
      <BreadcrumbTrail items={breadcrumbs} />

      {actions.length > 0 && (
        <div className="flex items-center gap-2">
          {actions.map((action, idx) => (
            <Button
              key={idx}
              variant={action.variant ?? "default"}
              onClick={action.onClick}
              className="font-questrial"
            >
              {action.icon}
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

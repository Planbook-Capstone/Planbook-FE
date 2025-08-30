import { cn } from "@/lib/utils";
import { Button } from "./Button";
import Image from "next/image";

export function MenuItemButton({
  image,
  active,
  label,
  isActive,
  onClick,
  disabled = false,
}: {
  icon?: React.ReactNode;
  image: string;
  active: string;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const iconSize: number = 35;
  const iconActiveSize: number = 37;
  return (
    <Button
      variant="menuitem"
      size="icon"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cn(
        "h-fit flex flex-col items-center justify-center gap-0 px-2 py-1 text-xs text-muted-foreground hover:text-foreground",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none"
      )}
    >
      {isActive ? (
        <Image
          className={cn("max-w-none", disabled && "opacity-50")}
          height={iconActiveSize}
          width={iconActiveSize}
          src={active}
          alt={label}
        />
      ) : (
        <Image
          className={cn("max-w-none", disabled && "opacity-50")}
          height={iconSize}
          width={iconSize}
          src={image}
          alt={label}
        />
      )}
      <span className={cn("mt-1 text-xs text-black font-questrial", disabled && "opacity-50")}>{label}</span>
    </Button>
  );
}

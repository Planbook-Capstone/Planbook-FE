import { cn } from "@/lib/utils";
import { Button } from "./Button";
import Image from "next/image";

export function MenuItemButton({
  icon,
  image,
  active,
  label,
  isActive,
  onClick,
}: {
  icon: React.ReactNode;
  image: string;
  active: string;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}) {
  const iconSize: number = 35;
  const iconActiveSize: number = 37;
  return (
    <Button
      variant="menuitem"
      size="icon"
      onClick={onClick}
      className={cn(
        "h-fit flex flex-col items-center justify-center gap-0 px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
      )}
    >
      {isActive ? (
        <Image
          className="max-w-none"
          height={iconActiveSize}
          width={iconActiveSize}
          src={active}
          alt={label}
        />
      ) : (
        <Image
          className="max-w-none"
          height={iconSize}
          width={iconSize}
          src={image}
          alt={label}
        />
      )}
      <span className="mt-1 text-xs text-black font-questrial">{label}</span>
    </Button>
  );
}

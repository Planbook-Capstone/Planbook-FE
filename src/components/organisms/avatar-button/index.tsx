"use client";
import {  useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";
function AvatarButton() {
  const { user, logout, displayName, avatarUrl, initials, isAuthenticated } =
    useAuth();
  const router = useRouter();
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="size-9 rounded-full hover:opacity-75 transition border border-neutral-300">
          <AvatarImage
            src={avatarUrl || "/images/avatarLogo.png"}
            className="object-cover"
          />
          <AvatarFallback className="rounded-md bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="left"
        className="w-52"
        sideOffset={5}
      >
        <div className="cursor-pointer flex items-center justify-start gap-2 px-2.5 py-4">
          <Avatar className="size-9 hover:opacity-75 transition border border-neutral-300">
            <AvatarImage
              src={avatarUrl || "/images/avatarLogo.png"}
              className="object-cover"
            />
            <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start justify-center">
            <p className="text-sm font-medium text-neutral-900">
              {displayName}
            </p>
            <p className="text-xs text-neutral-500">{user?.email}</p>
          </div>
        </div>

        <DropdownMenuItem
          onClick={logout}
          className="h-10 flex items-center justify-center text-amber-700 font-medium cursor-pointer"
        >
          <LogOut className="size-4 mr-2" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default AvatarButton;

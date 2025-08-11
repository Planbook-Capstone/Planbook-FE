import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useWalletService } from "@/services/walletServices";

function UserButton() {
  const { user, logout, displayName, avatarUrl, initials, isAuthenticated } =
    useAuth();
  const router = useRouter();

  const { data: wallet, isLoading } = useWalletService("");

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex justify-end items-center gap-2.5">
      <Select defaultValue="2025">
        <SelectTrigger className="w-4/5 p-2 rounded-full">
          <div className="flex gap-2 items-center">
            <p className="font-calsans border-r-2 px-1">Năm học </p>
            <SelectValue placeholder="Học kì" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="2025">2025-2026</SelectItem>
          <SelectItem value="2024">2024-2025</SelectItem>
        </SelectContent>
      </Select>
      <div
        onClick={() => router.push("/pricing")}
        className="cursor-pointer px-3.5 py-1.5 border flex items-center justify-center font-calsans rounded-full"
      >
        <Image
          src="/images/power.svg"
          alt="PlanBook Logo"
          width={20}
          height={20}
          className="object-contain"
        />
        {isLoading ? <>Loading...</> : wallet?.data?.balance}
      </div>
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
          side="bottom"
          className="w-52"
          sideOffset={5}
        >
          <div
            onClick={() => router.push("/auth/profile")}
            className="cursor-pointer flex items-center justify-start gap-2 px-2.5 py-4"
          >
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
            <LogOut className="size-4 mr-2" /> Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default UserButton;

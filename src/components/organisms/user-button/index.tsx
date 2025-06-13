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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
function UserButton() {
  const router = useRouter();
  const handleLogout = () => {
    router.push("/login");
  };
  return (
    <div className="flex justify-end items-center gap-2.5">
      <Select defaultValue="2025">
        <SelectTrigger className="w-4/5 p-2">
          <div className="flex gap-2 items-center ">
            <p className="font-calsans border-r-2 px-1">Năm học </p>
            <SelectValue placeholder="Học kì" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="2025">2025-2026</SelectItem>
          <SelectItem value="2024">2024-2025</SelectItem>
        </SelectContent>
      </Select>
      <div className="px-3.5 py-1.5 border rounded-md flex items-center justify-center font-calsans">
        <Image
          src="/images/power.svg"
          alt="PlanBook Logo"
          width={20}
          height={20}
          className="object-contain"
        />
        500
      </div>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="outline-none relative">
          <Avatar className="size-9 rounded-md hover:opacity-75 transition border border-neutral-300">
            <AvatarImage
              src={
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3fA0BO-KVbrQRmZeAiRwHHDrllxLWuPK4HCKmjnKcTnc82OBcd_8iYKPHIS2doiXbq2A_&s"
              }
              className="object-cover"
            />
            <AvatarFallback className="rounded-md bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
              Test
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side="bottom"
          className="w-52"
          sideOffset={5}
        >
          <div className="flex items-center justify-start gap-2 px-2.5 py-4">
            <Avatar className="size-9 hover:opacity-75 transition border border-neutral-300">
              <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
                Test
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start justify-center">
              <p className="text-sm font-medium text-neutral-900">Test</p>
              <p className="text-xs  text-neutral-500">tran@gmail.com</p>
            </div>
          </div>

          <DropdownMenuItem
            onClick={handleLogout}
            className="h-10 flex items-center justify-center text-amber-700 font-medium cursor-pointer"
          >
            <LogOut className="size-4 mr-2" /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default UserButton;

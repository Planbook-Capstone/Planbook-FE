import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { userItems } from "@/constants/menuItem";
import { cn } from "@/lib/utils";
import { Avatar } from "antd";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserButton from "../user-button";

type MainHeaderProps = {};

const MainHeader = (props: MainHeaderProps) => {
  return (
    <header className="bg-primary-600 text-black p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex justify-start items-center gap-2">
          <Image
            src="/images/logoPlanbook.png"
            alt="PlanBook Logo"
            width={30}
            height={30}
            className="object-contain"
          />
          <h1 className="font-calsans text-2xl">PlanBook</h1>
        </div>
        <div className="flex justify-center items-center gap-10">
          {userItems.map((item) => {
            const pathname = usePathname();
            const isActive =
              item.href === "/"
                ? pathname.startsWith("/") && !pathname.startsWith("/document")
                : pathname.startsWith(`/${item.href}`);
            return (
              <Link href={item.href} key={item.href}>
                <div
                  className={cn(
                    "flex items-center text-[15px] rounded-md font-medium hover:text-primary transition text-neutral-500",
                    isActive && "font-calsans  hover:opacity-100 text-primary"
                  )}
                >
                  {item.label}
                </div>
              </Link>
            );
          })}
        </div>
        <div className="flex justify-end items-center gap-2.5 w-1/4">
          <Select defaultValue="2025">
            <SelectTrigger className="w-2/4 p-2">
              <div className="flex gap-2 items-center ">
                <p className="font-calsans border-r-2 px-1">Học kỳ </p>
                <SelectValue placeholder="Học kì" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025-2026</SelectItem>
              <SelectItem value="2024">2024-2025</SelectItem>
            </SelectContent>
          </Select>
          <UserButton/>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { LogOut, Bell } from "lucide-react";
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
import { useAcademicYearActiceService } from "@/services/academicYearServices";
import { useOrdersWithParamsService } from "@/services/orderServices";
import { Order } from "@/types";
import { useMemo } from "react";
import { NotificationIcon } from "@/constants/icon";

function UserButton() {
  const { user, logout, displayName, avatarUrl, initials, isAuthenticated } =
    useAuth();
  const router = useRouter();

  const { data: wallet, isLoading } = useWalletService("");
  const { data: academicYear } = useAcademicYearActiceService();

  // Lấy danh sách đơn hàng chưa hoàn tất thanh toán
  const { data: ordersData } = useOrdersWithParamsService(
    [1, 50], // lấy 50 đơn hàng đầu tiên
    { retry: 1, staleTime: 30000 }, // cache 30 giây
    {
      userId: user?.id,
      offset: 1,
      pageSize: 50,
      sort: "createdAt,desc",
    }
  );

  // Lọc các đơn hàng chưa hoàn tất thanh toán
  const pendingOrders = useMemo(() => {
    if (!ordersData?.data?.content) return [];
    return ordersData.data.content.filter(
      (order: Order) =>
        order.status === "PENDING" ||
        order.status === "FAILED" ||
        order.status === "RETRY"
    );
  }, [ordersData]);

  const handleNotificationClick = (order: Order) => {
    router.push(`/auth/order-history?orderId=${order.id}`);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex justify-end items-center gap-2.5">
      <Select defaultValue="2025">
        <SelectTrigger
          className="w-4/5 p-2 rounded-full"
          data-tour="academic-year"
        >
          <div className="flex gap-2 items-center">
            <p className="font-calsans border-r-2 px-1">Năm học </p>
            <SelectValue placeholder="Học kì" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="2025">{academicYear?.data?.yearLabel}</SelectItem>
        </SelectContent>
      </Select>
      <div
        data-tour="wallet"
        onClick={() => router.push("/auth/wallet")}
        className="cursor-pointer px-3.5 py-1.5 border flex items-center justify-center font-calsans rounded-full"
      >
        <Image
          src="/images/power.svg"
          alt="PlanBook Logo"
          width={20}
          height={20}
          className="object-contain"
        />
        {isLoading ? <>Loading...</> : wallet?.data?.balance || 0}
      </div>

      {/* Notification Button */}
      <Popover>
        <PopoverTrigger data-tour="notifications" className="outline-none relative">
          <div className="cursor-pointer p-2 border rounded-full hover:bg-gray-50 transition-colors relative">
            {/* <Bell className="size-5 text-gray-600" /> */}
            <div className="w-[20px] h-[20px]">{NotificationIcon}</div>
            {pendingOrders.length > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
              >
                {pendingOrders.length}
              </Badge>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80 p-0">
          <div className="p-4 border-b">
            <h3 className="font-calsans text-sm">Thông báo</h3>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {pendingOrders.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                Không có thông báo mới
              </div>
            ) : (
              pendingOrders.map((order: Order) => (
                <div
                  key={order.id}
                  onClick={() => handleNotificationClick(order)}
                  className="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm font-calsans text-gray-900">
                        Đơn hàng chưa hoàn tất thanh toán
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {order.subscriptionPackage?.name} -{" "}
                        {order.amount?.toLocaleString()}đ
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {pendingOrders.length > 0 && (
            <div className="p-3 border-t bg-gray-50 rounded-b-md cursor-pointer">
              <button
                onClick={() => router.push("/auth/order-history")}
                className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Xem tất cả đơn hàng
              </button>
            </div>
          )}
        </PopoverContent>
      </Popover>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger data-tour="user-menu" className="outline-none relative">
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

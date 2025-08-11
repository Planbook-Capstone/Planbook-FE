"use client";

import { useState, useMemo } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Plus, Search } from "lucide-react";
import CreateUserModal from "@/components/organisms/create-user-modal";
import { roleOptions, type CreateUserFormData } from "@/schemas";
import UserTable from "@/components/organisms/user-table";
import {
  useAllUsersService,
  useCreateUserService,
  useUpdateUserStatusService,
} from "@/services/userService";
import { toast } from "sonner";
import { UserWithWalletResponse } from "@/types";
import UserDetailModal from "@/components/molecules/user-detail-modal";

// Filter options for role
const filterOptions = [
  { value: "all", label: "Tất cả vai trò" },
  ...roleOptions,
];

export default function StaffUsersManagementPage() {
  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState("all");

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] =
    useState<UserWithWalletResponse | null>(null);
  const { data: allUsers } = useAllUsersService();

  // API hooks
  const createUserMutation = useCreateUserService();
  const updateUserStatusMutation = useUpdateUserStatusService();

  // Handlers
  const handleCreateUser = async (data: CreateUserFormData) => {
    createUserMutation.mutate(data, {
      onSuccess: (response) => {
        setIsCreateModalOpen(false);
        toast.success("Tạo người dùng thành công!");
      },
      onError: (error) => {
        console.error("Error creating user:", error);
        toast.error("Có lỗi xảy ra khi tạo người dùng!");
      },
    });
  };

  const handleViewUser = (user: UserWithWalletResponse) => {
    // You can implement modal/drawer logic here
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleToggleUserStatus = (user: UserWithWalletResponse) => {
    const newStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    // Show loading toast
    const loadingToast = toast.loading(
      `${newStatus === "ACTIVE" ? "Kích hoạt" : "Vô hiệu hóa"} người dùng...`
    );
    updateUserStatusMutation.mutate(
      {
        id: String(user.id),
        field: "status",
        queryParams: { status: newStatus }, // ✅ dùng biến động },
      },
      {
        onSuccess: () => {
          toast.dismiss(loadingToast);
          toast.success(
            `${
              newStatus === "ACTIVE" ? "Vô hiệu hóa" : "Kích hoạt"
            } người dùng thành công!`
          );
        },
        onError: () => {
          toast.dismiss(loadingToast);
          toast.error("Cập nhật trạng thái thất bại");
        },
      }
    );
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-gray-200">
        <div className="mx-auto px-0 py-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo tên, email hoặc username..."
                  value={searchValue}
                  onChange={(e: any) => setSearchValue(e.target.value)}
                  className="pl-10 min-w-xs"
                />
              </div>

              {/* Filter Select */}
              <div className="w-full sm:w-48">
                <Select value={filterValue} onValueChange={setFilterValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Lọc theo vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              onClick={() => {
                setIsCreateModalOpen(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus size={20} />
              Tạo người dùng mới
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-0 py-2">
        {/* Users Table */}
        <UserTable
          users={allUsers?.data?.content || []}
          onViewUser={handleViewUser}
          onToggleUserStatus={handleToggleUserStatus}
        />
      </div>
      <CreateUserModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateUser}
      />
      {selectedUser && (
        <UserDetailModal
          open={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          user={selectedUser}
        />
      )}
    </div>
  );
}
